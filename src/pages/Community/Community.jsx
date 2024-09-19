import { useState } from "react";
import { useNavigate, useRouteLoaderData, useLocation } from "react-router-dom";
import { useTheme, useMediaQuery, Card, Button, Divider } from "@mui/material";

import TitleBar from "../../components/TitleBar";
import CommunityNavBar from "../../components/Community/CommunityNavBar";
import { isEmpty, timeSince } from "../../provider/utilityProvider";
import apiInstance from "../../provider/networkProvider";
import classes from "./Community.module.css";
import { useAuth } from "../../provider/authProvider";

// TODO:
// 무한 스크롤 로직 추가

export default function CommunityPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const boardId = searchParams.get("b") || 1;
  const boardName = location.state?.boardName || '자유게시판'
  // Tab Index
  const initData = useRouteLoaderData("community-page");
  const [data, setData] = useState({
    postList: initData.communityPostSearchResponseDtoList,
    hasNextPage: initData.hasNextPage,
  });
  // Page Info
  const [pageObj, setPageObj] = useState({
    page: 0,
    size: 10,
    sort: ["createdAt"],
    direction: "desc",
  });
  const [isFetching, setIsFetching] = useState(false);

  const handleWriteBtnClick = (e) => {
    e.preventDefault();
    navigate("/c/edit", {
      state: { boardId: boardId, isCreation: true },
    });
  };

  const handlePostClick = (postId) => {
    navigate(`./${postId}`);
  };

  return (
    <div className={classes.communityContent}>
      <Card sx={{ borderRadius: "0.7rem", margin: "1.3rem 0", flexGrow: "3" }}>
        <TitleBar title={boardName}>
          {isLoggedIn && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleWriteBtnClick}
            >
              게시물 작성
            </Button>
          )}
        </TitleBar>
        <Divider />
        {isFetching && <p>로딩 중</p>}
        {!isFetching && isEmpty(data.postList) && (
          <p>표시할 내용이 없습니다.</p>
        )}
        {!isFetching &&
          !isEmpty(data.postList) &&
          data.postList?.map((item, index) => (
            <div
              key={`POST_${index}`}
              className={classes.communityPostLink}
              onClick={() => handlePostClick(item.communityPostId)}
            >
              <span>
                <h4>{item.title}</h4>
                <h4 style={{color: 'red'}}>[{item.replyCount}]</h4>
              </span>
              <p>
                {item.writerNickName} | {timeSince(item.createdAt)}
              </p>
            </div>
          ))}
      </Card>
      {!matchDownSm && (
        <Card
          sx={{ borderRadius: "0.7rem", margin: "1.3rem 0", flexGrow: "1" }}
        >
          <CommunityNavBar />
        </Card>
      )}
    </div>
  );
}

// 커뮤니티 게시글 목록 데이터 요청 함수
export async function communityLoader({ boardType = 1, pageNum = 0 }) {
  try {
    const response = await apiInstance.get(
      `/api/v1/community/posts/search/${boardType}`,
      {
        params: {
          page: pageNum,
          size: 10,
          sort: ["createdAt,desc"],
        },
      }
    );
    if (response.status === 200) {
      // 조회 성공
      //console.log(response.data.data)
      return response.data.data;
    }
  } catch (error) {
    console.log(error.message);
  }
  return [];
}
