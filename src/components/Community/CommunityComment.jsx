import { useState, useEffect } from "react";
import { Avatar, Link, IconButton } from "@mui/material";
import { RiMore2Line } from "@remixicon/react";

import CommunityTextField from "./CommunityTextField";
import { isEmpty } from "../../provider/utilityProvider";
import { useAuth } from "../../provider/authProvider";
import { Toast } from "../Toast";
import classes from "./CommComponent.module.css";

export default function CommunityComment({
  communityPostId,
  commentData,
  isUpdating,
  setIsUpdating,
}) {
  const { isLoggedIn } = useAuth();
  const [replyTextFieldTarget, setReplyTextFieldTarget] = useState(-1);

  // Close Reply TextField if new comment is uploaded
  useEffect(() => {
    if(isUpdating === "done") {
      // Close Reply TextField
      setReplyTextFieldTarget(-1);
    }
  }, [isUpdating])

  const CommentBox = ({ item, isReply = false }) => {
    return (
      <div className={!isReply ? classes.communityComment : `${classes.communityComment} ${classes.communityReply}`}>
        <Avatar src={item.memberAccessUrl} sx={{ marginTop: "0.1rem" }} />
        <span className={classes.communityCommentContent}>
          <h4>{item.memberNickName}</h4>
          <p>{item.contents}</p>
          {isLoggedIn && !isReply && (
            <Link
              component="button"
              style={{ fontSize: "14px" }}
              onClick={() => setReplyTextFieldTarget(item.replyId)}
            >
              답글 달기
            </Link>
          )}
        </span>
        <IconButton className={classes.communityCommentMoreButton}>
          <RiMore2Line/>
        </IconButton>
      </div>
    );
  };

  return (
    <>
      {!isEmpty(commentData) &&
        commentData.map((item, index) => (
          <div key={`COMMENT_${index}`}>
            <CommentBox item={item.parentReplyResponseDto} />
            {replyTextFieldTarget == item?.parentReplyResponseDto?.replyId &&
              isLoggedIn && (
                <CommunityTextField
                  communityPostId={communityPostId}
                  parentReplyId={item.parentReplyResponseDto.replyId}
                  setIsUpdating={setIsUpdating}
                />
              )}
            {!isEmpty(item.childReplyResponseDto) &&
              item.childReplyResponseDto.map((reply, index) => (
                <div key={`REPLY_${index}`}>
                  <CommentBox item={reply} isReply={true} />
                </div>
              ))}
          </div>
        ))}
    </>
  );
}

// 커뮤니티 게시글 대댓글 등록 함수
export async function communityPostCommentRequest(postId, commentData) {
  try {
    const response = await apiInstance.post("/api/v1/community/posts/reply", {
      communityPostId: postId,
      contents: commentData,
    });
    // 추가 성공
    if (response.status === 201) {
      // 조회 성공
      return response.status;
    }
  } catch (error) {
    // 추가 실패
    Toast.error("댓글을 등록하는 과정에서 오류가 발생했습니다.");
  }
  return 0;
}
