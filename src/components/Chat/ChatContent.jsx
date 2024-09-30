import { useEffect, useRef } from "react";
import apiInstance from "../../provider/networkProvider";
import { useAuth } from "../../provider/authProvider";
import { Toast } from "../Common/Toast";
import classes from "./ChatComponent.module.css";

export default function ChatContent({ roomId, chatContent, setChatContent }) {
  const { memberCode } = useAuth();

  // Move scroll to bottom at initial render
  function ScrollToBottom() {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  useEffect(() => {
    chatContentLoader(roomId).then((res) => {
      setChatContent(res);
    });
  }, [roomId]);

  return (
    <div className={classes.chatContent}>
      {chatContent?.messageResponseDtoList?.length == 0 && <p>표시할 내용이 없습니다.</p>}
      {chatContent?.messageResponseDtoList?.length != 0 &&
        chatContent?.messageResponseDtoList?.slice(0).reverse().map((item, index) => {
          if (memberCode == item.senderId) {
            return (
              <span key={index} className={`${classes.chatBubble} ${classes.chatMyBubble}`}>
                {item.contents}
              </span>
            );
          } else {
            return (
              <span key={index} className={`${classes.chatBubble} ${classes.chatOthersBubble}`}>
                {item.contents}
              </span>
            );
          }
        })
      }
      <ScrollToBottom />
    </div>
  );
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
    Toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
  }
  return {};
}
