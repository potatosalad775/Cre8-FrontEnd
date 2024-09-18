import { Client } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";

const wsAddress = import.meta.env.VITE_WS_SERVER;
const CONNECTION_TIMEOUT = 3000;

const chatClient = new Client();
chatClient.configure({
  brokerURL: wsAddress,
  connectHeaders: {
    Authorization: localStorage.getItem("token"),
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 3000,
  heartbeatOutgoing: 3000,
  
  debug: (msg) => {
    console.log(new Date(), msg);
  }
  
});

export default chatClient;

let activationPromise = null;

export const activateChatClient = () => {
  if(!activationPromise) {
    activationPromise = chatClient.activate();
  }
  return activationPromise;
};

export const deactivateChatClient = () => {
  chatClient.deactivate();
  activationPromise = null;
}

export function useChatConnection(roomId, onMessageReceived) {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    let timeoutID;

    const connectionWithTimeout = async () => {
      setConnectionStatus('connecting');

      try {
        const connectPromise = activateChatClient();
        timeoutID = setTimeout(() => {
          setConnectionStatus('timeout');
          throw new Error('Connection Timeout');
        }, CONNECTION_TIMEOUT);
        // Await Connection for Certain amount of time
        await connectPromise;
        clearTimeout(timeoutID);
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Failed to connect:', error);
        setConnectionStatus('error');
      }
    }

    // Activate Chat Client on first run
    connectionWithTimeout();

    // Deactivate after chat is over
    return () => {
      clearTimeout(timeoutID);
      deactivateChatClient();
      setConnectionStatus('disconnected');
    };
  }, []);

  const subscribeToRoom = useCallback((roomId) => {
    if(roomId == -1 || connectionStatus !== 'connected') return;
    // Subscribe if roomId is valid
    let subscription;
    //
    const subscribe = async (attempt) => {
      try {
        subscription = chatClient.subscribe(
          `/sub/chat/room/${roomId}`,
          (message) => {
            //console.log(message)
            if (message.body) {
              const msg = JSON.parse(message.body);
              onMessageReceived(msg);
            }
          }
        );
      } catch (error) {
        if (attempt <= 3) {
          console.warn(`Attempt ${attempt} failed, retrying...`);
          await subscribe(attempt + 1);
        } else {
          console.error("CHAT Subscription Error:", error);
          setConnectionStatus('error');
        }
      }
    }
    //
    subscribe(1);
    
    // Unsubscribe when it's unmounted
    return () => {
      if(subscription) {
        try {
          subscription.unsubscribe();
        } catch (e) {
          console.error(e.message);
        }
      }
    };
  }, [connectionStatus, onMessageReceived]); // Memoizes and only changes when onMsgReceived is changed

  useEffect(() => {
    const unsubscribe = subscribeToRoom(roomId);
    return unsubscribe;
  }, [roomId, subscribeToRoom]);

  const sendMessage = useCallback((message) => {
    if(roomId == -1 || connectionStatus !== 'connected') return;
    // Send Message if roomId is valid
    const publishMessage = async (attempt) => {
      try {
        chatClient.publish({
          destination: `/pub/message/${roomId}`,
          body: JSON.stringify({ message }),
        });
      } catch (error) {
        if (attempt <= 3) {
          console.warn(`Attempt ${attempt} failed, retrying...`);
          await publishMessage(attempt + 1);
        } else {
          console.error("Send Message Error:", error);
          setConnectionStatus('error');
        }
      }
    };
    // Try Publishing Message
    publishMessage(1);
  }, [roomId, connectionStatus]);

  return { sendMessage, connectionStatus };
}