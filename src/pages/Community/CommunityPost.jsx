import { useState, useEffect } from "react";
import { useNavigate, useMatch, useRouteLoaderData, redirect } from "react-router-dom";
import {
  Divider,
  ImageList,
  ImageListItem,
  Chip,
  Fab,
  Grid,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  Card,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import {
  RiChat1Fill,
  RiStarFill,
  RiStarLine,
  RiPencilLine,
  RiHeartFill,
  RiMoreLine,
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

export default function CommunityPostPage() {
  const initData = useRouteLoaderData("communityPost-page");
  const match = useMatch("/c/:postID");
  const navigate = useNavigate();
  const { isLoggedIn, memberCode } = useAuth();
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
  const [data, setData] = useState(initData);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLikeClicked, setIsLikeClicked] = useState(initData.like || false);
  const [isUpdating, setIsUpdating] = useState("false");
  const open = Boolean(anchorEl);
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
      CommunityPostLoader({
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
  */
  const handleLikeClick = () => {
    setIsLikeClicked(!isLikeClicked);
    CommunityPostLikeRequest(data.communityPostId).then((status) => {
      if (status != 200) {
        Toast.error("북마크에 추가하는 과정에서 오류가 발생했습니다.");
        setIsLikeClicked(!isLikeClicked);
      }
    });
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = () => {
    navigate(`/c/edit/${data.communityPostId}`, {
      state: { postId: data.communityPostId, isCreation: false },
    });
  };
  const handleDelete = () => {
    CommunityPostDeleteRequest(data.communityPostId).then((status) => {
      if (status == 200) {
        Toast.success("게시글을 삭제했습니다.");
        navigate(-1, {replace: true});
      } else {
        Toast.error("게시글을 삭제하는 과정에서 오류가 발생했습니다.");
      }
    });
  };

  return (
    <Card sx={{ borderRadius: "0.7rem", margin: "1.3rem 0" }}>
      <TitleBar backBtnTarget={-1} title="커뮤니티 게시글">
        {data.writerId == memberCode && (
          <>
            <Tooltip title="더 보기" placement="top">
              <IconButton onClick={handleMenuClick}>
                <RiMoreLine />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              disableScrollLock={true}
            >
              <MenuItem sx={{ minHeight: "32px" }} onClick={handleEdit}>
                내 게시글 수정
              </MenuItem>
              <Divider />
              <MenuItem sx={{ minHeight: "32px" }} onClick={handleDelete}>
                내 게시글 삭제
              </MenuItem>
            </Menu>
          </>
        )}
      </TitleBar>
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
            {!isEmpty(data.accessUrl) && <img src={data.accessUrl} />}
            <ReadOnlyEditor content={data.contents} />
          </div>
          <div className={classes.communityPostButtonArea}>
            <Tooltip
              title={!isLoggedIn && "해당 기능을 사용하려면 로그인하세요."}
            >
              <div className={classes.communityPostLikeButton}>
                <Button
                  color={isLikeClicked ? "primary" : "inherit"}
                  variant="contained"
                  size="small"
                  disabled={!isLoggedIn}
                  startIcon={<RiHeartFill size="16" />}
                  onClick={handleLikeClick}
                >
                  좋아요
                </Button>
                <h5>+{data.likeCounts + (isLikeClicked ? 1 : 0)}</h5>
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
export async function CommunityPostLoader({ request, params }) {
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
async function CommunityPostLikeRequest(postId) {
  try {
    const response = await apiInstance.post(
      `/api/v1/like/community/posts/${postId}`
    );
    // 성공
    return response.status;
  } catch (error) {
    // 실패
    //console.error(error.message);
  }
  return 0;
}

// 커뮤니티 게시글 삭제 요청 함수
async function CommunityPostDeleteRequest(postId) {
  try {
    const response = await apiInstance.delete(
      `/api/v1/community/posts/${postId}`
    );
    // 성공
    return response.status;
  } catch (error) {
    // 실패
    //console.error(error.message);
  }
  return 0;
}
