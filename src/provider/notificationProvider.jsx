import React, { createContext, useState, useEffect, useContext } from "react";
import apiInstance from "./networkProvider";

const NotificationContext = createContext();

export default function NotificationProvider({ children }) {
  const [hasUnreadChat, setHasUnreadChat] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const checkForNotifications = async () => {
    try {
      const response = await apiInstance.get("/api/v1/notify/check");
      if (response.status === 200) {
        // 조회 성공
        setHasUnreadChat(response.data.data.unReadChat);
        setHasUnreadNotifications(response.data.data.unreadNotify);
      }
    } catch (error) {
      // 조회 실패
      //Toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
      console.error("Error fetching notifications:", error);
    }
    return {};
  };

  useEffect(() => {
    checkForNotifications();
    // Set up an interval to check for notifications periodically
    const intervalId = setInterval(checkForNotifications, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ 
        hasUnreadChat, 
        hasUnreadNotifications, 
        setHasUnreadChat,
        setHasUnreadNotifications,
        checkForNotifications 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
