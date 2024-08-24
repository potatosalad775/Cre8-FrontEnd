import { useState, useEffect } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import {
  Divider,
  ImageList,
  ImageListItem,
  Chip,
  Fab,
  Grid,
  Tooltip,
} from "@mui/material";
import { RiChat1Fill } from "@remixicon/react";
import PageContent from "../../components/PageContent";
import TitleBar from "../../components/TitleBar";
import TagList from "../../components/Tag/TagList";
import apiInstance from "../../provider/networkProvider";
import { useAuth } from "../../provider/authProvider";
import { ReadOnlyEditor } from "../../components/Editor";
import classes from "./Job.module.css";

export default function JobPostPage() {
  const data = useRouteLoaderData("jobPost-page");
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  //console.log(data);
  //const data = dummyPageData;
  // Tag List
  const [tagDataList, setTagDataList] = useState([]);

  useEffect(() => {
    let tempList = [data.tagPostResponseDto.workFieldTagName];
    data.tagPostResponseDto.subCategoryWithChildTagResponseDtoList.map(
      (item) => {
        tempList = [...tempList, ...item.childTagName];
      }
    );
    setTagDataList(tempList);
  }, []);

  const handleImgClick = (e, portfolioID) => {
    navigate(`./${portfolioID}`);
  };

  const handleFABClick = (e) => {
    navigate('/chat', { state: { chatQuery: {
      targetCode: data.writerId,
      targetNickName: data.writerNickName,
    }}})
  }

  return (
    <>
      <TitleBar backBtnTarget={"../"} title="구직 게시글" />
      {!data ? (
        <PageContent>
          <p>게시글을 불러오는 중 오류가 발생했습니다.</p>
        </PageContent>
      ) : (
        <>
          <div className={classes.jobPostTitleArea}>
            <h2>{data.title}</h2>
            <h3>
              {data.name.replace(/..$/, "**")} | {data.sex} | {data.birthYear}
              년생
            </h3>
            <h4>{data.contact}</h4>
            <TagList tagList={tagDataList} />
          </div>
          <div className={classes.jobPostPtfArea}>
            <h3>작성자 포트폴리오</h3>
            <ImageList cols={3} gap={10}>
              {data.portfolioSimpleResponseDtoList &&
                data.portfolioSimpleResponseDtoList.map((item) => (
                  <ImageListItem
                    key={item.id}
                    className={classes.jobPortfolioThumbnail}
                  >
                    <img
                      src={`${item.accessUrl}`}
                      alt={item.id}
                      onClick={(e) => {
                        handleImgClick(e, item.id);
                      }}
                    />
                  </ImageListItem>
                ))}
            </ImageList>
          </div>
          <div className={classes.jobPostInfoArea}>
            <Grid
              container
              columns={{ xs: 2, sm: 31 }}
              spacing={{ xs: 2, sm: 2 }}
              sx={{
                marginTop: "0.7rem !important",
              }}
              justifyContent="space-between"
            >
              <Grid item xs={2} sm={15} sx={{paddingTop: "0.6rem !important"}}>
                <h3>역량</h3>
                {data.tagPostResponseDto.subCategoryWithChildTagResponseDtoList.map(
                  (item, itemIndex) => (
                    <div key={itemIndex} className={classes.jobPostInfoAreaRow}>
                      <p>{item.subCategoryName}</p>
                      <ul>
                        {item.childTagName.map((child, childIndex) => (
                          <li key={childIndex}>
                            <Chip label={child} size="small" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </Grid>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mr: "-1px", paddingLeft: "16px" }}
              />
              <Grid item xs={2} sm={15} sx={{paddingTop: "0.6rem !important"}}>
                <h3>작성자 정보</h3>
                <div className={classes.jobPostInfoAreaRow}>
                  <p>희망 급여</p>
                  <Chip label={data.paymentMethod} size="small" />
                  <b>{data.paymentAmount}원</b>
                </div>
                <div className={classes.jobPostInfoAreaRow}>
                  <p>작업 경력</p>
                  <b>{data.careerYear}년</b>
                </div>
              </Grid>
            </Grid>
          </div>
          <div className={classes.jobPostDescArea}>
            <ReadOnlyEditor content={data.contents} />
          </div>
          <Tooltip title={!isLoggedIn ? "채팅을 시작하려면 로그인하세요." : ""} placement="top">
            <div className={classes.jobPostFAB}>
              <Fab
                color="primary"
                variant="extended"
                sx={{ gap: "0.5rem" }}
                disabled={!isLoggedIn}
                onClick={handleFABClick}
              >
                <RiChat1Fill/>
                채팅 시작하기
              </Fab>
            </div>
          </Tooltip>
        </>
      )}
    </>
  );
}

// 포트폴리오 데이터 요청 함수
export async function jobPostLoader({ request, params }) {
  const rpID = params.jobPostID;
  try {
    const response = await apiInstance.get(`/api/v1/employee/posts/${rpID}`);
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
