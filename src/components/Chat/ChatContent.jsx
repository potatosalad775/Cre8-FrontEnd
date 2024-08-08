import { useEffect, useState } from "react";
import { isEmpty } from "../../provider/utilityProvider";
import apiInstance from "../../provider/networkProvider";

export default function ChatContent({roomId}) {
  const [chatContent, setChatContent] = useState();

  useEffect(() => {
    chatContentLoader(roomId).then((res) => {
      setChatContent(res);
    })
  }, [roomId])

  return <>
    {isEmpty(chatContent) && <p>Content is empty.</p>}
    {!isEmpty(chatContent) && chatContent.map((item, index) => (
      <p key={index}>{item.contents}</p>
    ))}
  </>
}

// 채팅 데이터 요청 함수
async function chatContentLoader(roomId) {
  try {
    const response = await apiInstance.get(`/api/v1/chats/room/${roomId}`);
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