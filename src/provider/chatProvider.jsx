import { Client } from "@stomp/stompjs";
import { useCallback, useEffect } from "react";

const wsAddress = import.meta.env.VITE_WS_SERVER;

const chatClient = new Client();
chatClient.configure({
  brokerURL: wsAddress,
  connectHeaders: {
    Authorization: localStorage.getItem("token"),
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  debug: (msg) => {
    //console.log(new Date(), msg);
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
  useEffect(() => {
    // Activate Chat Client on first run
    activateChatClient();
    // Deactivate after chat is over
    return () => {
      deactivateChatClient()
    };
  }, []);

  const subscribeToRoom = useCallback((roomId) => {
    if(roomId == -1) return;
    // Subscribe if roomId is valid
    const subscription = chatClient.subscribe(
      `/sub/chat/room/${roomId}`,
      (message) => {
        //console.log(message)
        if (message.body) {
          const msg = JSON.parse(message.body);
          onMessageReceived(msg);
        }
      }
    );
    // Unsubscribe when it's unmounted
    return () => {
      subscription.unsubscribe();
    }
  }, [onMessageReceived]); // Memoizes and only changes when onMsgReceived is changed

  useEffect(() => {
    const unsubscribe = subscribeToRoom(roomId);
    return unsubscribe;
  }, [roomId, subscribeToRoom]);

  const sendMessage = useCallback((message) => {
    if(roomId == -1) return;
    // Send Message if roomId is valid
    chatClient.publish({
      destination: `/pub/message/${roomId}`,
      body: JSON.stringify({ message }),
    });
  }, [roomId]);

  return { sendMessage };
}