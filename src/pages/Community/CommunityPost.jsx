import { useState, useEffect } from "react";
import { useNavigate, useMatch, useRouteLoaderData } from "react-router-dom";
import {
  Divider,
  ImageList,
  ImageListItem,
  Chip,
  Fab,
  Grid,
  Tooltip,
  useMediaQuery,
  useTheme,
  Card,
  Button,
  TextField,
} from "@mui/material";
import {
  RiChat1Fill,
  RiStarFill,
  RiStarLine,
  RiPencilLine,
  RiHeartFill,
} from "@remixicon/react";

import PageContent from "../../components/PageContent";
import TitleBar from "../../components/TitleBar";
import TagList from "../../components/Tag/TagList";
import apiInstance from "../../provider/networkProvider";
import { useAuth } from "../../provider/authProvider";
import { Toast } from "../../components/Toast";
import { ReadOnlyEditor } from "../../components/Editor";
import { dateTimeExtractor, isEmpty } from "../../provider/utilityProvider";
import classes from "./Community.module.css";
import CommunityComment from "../../components/Community/CommunityComment";
import CommunityTextField from "../../components/Community/CommunityTextField";

// TODO:
// 좋아요 버튼 기능 구현

export default function CommunityPostPage() {
  const initData = useRouteLoaderData("communityPost-page");
  const match = useMatch("/c/:postID");
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const memberCode = localStorage.getItem("memberCode");
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
  const [data, setData] = useState(initData);
  const [isUpdating, setIsUpdating] = useState("false");
  // Bookmark Button State
  /*
  const [bookmarkBtnState, setBookmarkBtnState] = useState(
    !isEmpty(data.bookMarked) ? data.bookMarked : false
  );
  */

  useEffect(() => {
    // Load new data if new comment is uploaded
    if (isUpdating === "done") {
      // Load new post data
      communityPostLoader({
        params: { communityPostID: match.params.postID },
      }).then((newData) => {
        setData(newData);
      });
      setIsUpdating("false");
    }
  }, [isUpdating]);

  /*
  const handleImgClick = (e, portfolioID) => {
    navigate(`./${portfolioID}`);
  };
  const handleEditClick = (e) => {
    navigate(`/job/edit/${match.params.lastPart}`, {
      state: { isCreation: false },
    });
  };
  const handleBookmarkClick = () => {
    setBookmarkBtnState(!bookmarkBtnState);
    jobAddBookmarkRequest(match.params.lastPart).then((status) => {
      if (status != 200) {
        Toast.error("북마크에 추가하는 과정에서 오류가 발생했습니다.");
        setBookmarkBtnState(!bookmarkBtnState);
      }
    });
  };
  */

  return (
    <Card sx={{ borderRadius: "0.7rem", margin: "1.3rem 0" }}>
      <TitleBar backBtnTarget={-1} title="커뮤니티 게시글" />
      {!data ? (
        <PageContent>
          <p>게시글을 불러오는 중 오류가 발생했습니다.</p>
        </PageContent>
      ) : (
        <>
          <div className={classes.communityPostTitle}>
            <h2>{data.title}</h2>
            <h4>{data.writerNickName}</h4>
            <p>{dateTimeExtractor(data.createdAt).fullString}</p>
          </div>
          <div className={classes.communityPostContentArea}>
            <ReadOnlyEditor content={data.contents} />
          </div>
          <div className={classes.communityPostButtonArea}>
            <Tooltip title="해당 기능을 사용하려면 로그인하세요.">
              <div className={classes.communityPostLikeButton}>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={!isLoggedIn}
                  startIcon={<RiHeartFill size="20" />}
                >
                  좋아요
                </Button>
                <h4>+{data.likeCounts}</h4>
              </div>
            </Tooltip>
          </div>
          <div className={classes.communityPostCommentDivider}>
            <p>댓글</p>
          </div>
          <div className={classes.communityPostCommentArea}>
            <CommunityComment
              communityPostId={match.params.postID}
              commentData={data.replyListResponseDtoList}
              isUpdating={isUpdating}
              setIsUpdating={setIsUpdating}
            />
          </div>
          {isLoggedIn && (
            <CommunityTextField
              communityPostId={match.params.postID}
              isUpdating={isUpdating}
              setIsUpdating={setIsUpdating}
            />
          )}
        </>
      )}
    </Card>
  );
}

// 커뮤니티 게시글 데이터 요청 함수
export async function communityPostLoader({ request, params }) {
  const cpID = params.communityPostID;

  try {
    const response = await apiInstance.get(`/api/v1/community/posts/${cpID}`);
    if (response.status === 200) {
      // 조회 성공
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
    //console.error(error.message);
  }
  return null;
}

// 커뮤니티 게시글 좋아요 요청 함수
export async function communityPostLikeRequest(postId) {
  try {
    const response = await apiInstance.post(
      `/api/v1/bookmark/employee-post/${postId}`
    );
    // 추가 성공
    return response.status;
  } catch (error) {
    // 추가 실패
    console.error(error.message);
  }
  return 0;
}
