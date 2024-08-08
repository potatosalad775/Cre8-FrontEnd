import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { Button } from "@mui/material";
import TitleBar from "../../components/TitleBar";
import ChatListCard from "../../components/Chat/ChatListCard";
import ChatRoomTopBar from "../../components/Chat/ChatRoomTopBar";
import ChatRoomInputBar from "../../components/Chat/ChatRoomInputBar";
import PageContent from "../../components/PageContent";
import apiInstance from "../../provider/networkProvider";
import classes from "./Chat.module.css";
import ChatContent from "../../components/Chat/ChatContent";

export default function ChatPage() {
  const data = useRouteLoaderData("chat-page");
  //const data = dummyData;
  const [selectedRoom, setSelectedRoom] = useState({roomId: -1, nickName: ""});

  const handleListClick = (key, name) => {
    setSelectedRoom({roomId: key, nickName: name});
  };

  return (
    <>
      <TitleBar title="채팅">
        <Button variant="contained" color="secondary">
          채팅 시작하기?
        </Button>
      </TitleBar>
      <div className={classes.chatPage}>
        <div className={classes.chatList}>
          {data.map((item, index) => (
            <ChatListCard
              key={index}
              name={item.nickName}
              message={item.latestMessage}
              onClick={() => {
                handleListClick(item.roomId, item.nickName);
              }}
            />
          ))}
        </div>
        <div className={classes.chatContent}>
          {selectedRoom.roomId == -1 && <p>Select Something</p>}
          {selectedRoom.roomId > -1 && <>
            <ChatRoomTopBar name={selectedRoom.nickName} />
            <ChatContent roomId={selectedRoom.roomId} />
            <ChatRoomInputBar />
          </>}
        </div>
      </div>
    </>
  );
}

// 채팅 목록 데이터 요청 함수
export async function chatListLoader({ request, params }) {
  try {
    const response = await apiInstance.get("/api/v1/chats/room");
    if (response.status === 200) {
      // 조회 성공
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
    console.error(error.message);
  }
  return null;
}

const dummyData = [
  {
    roomId: 0,
    nickName: "stringIIIIIIIIIIIIIIIIII",
    latestMessage: "stringlllllllllllllllIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
  },
  {
    roomId: 1,
    nickName: "string1",
    latestMessage: "string1",
  },
  {
    roomId: 2,
    nickName: "string2",
    latestMessage: "string2",
  },
];
