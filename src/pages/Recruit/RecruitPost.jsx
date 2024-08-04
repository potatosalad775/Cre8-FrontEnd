import { useState, useEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { Divider, ImageList, ImageListItem, Chip, Fab } from "@mui/material";

import PageContent from "../../components/PageContent";
import TitleBar from "../../components/TitleBar";
import TagList from "../../components/Tag/TagList";
import apiInstance from "../../provider/networkProvider";
import { ReadOnlyEditor } from "../../components/Editor";
import classes from "./Recruit.module.css";

export default function RecruitPostPage() {
  const data = useRouteLoaderData("recruitPost-page");
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

  return (
    <>
      <TitleBar backBtnTarget={"../"} title="구인 게시글" />
      {!data ? (
        <PageContent>
          <p>게시글을 불러오는 중 오류가 발생했습니다.</p>
        </PageContent>
      ) : (
        <>
          <div className={classes.recPostTitleArea}>
            <h2>{data.title}</h2>
            <h3>{data.companyName}</h3>
            <TagList tagList={tagDataList} />
          </div>
          <div className={classes.recPostInfoArea}>
            <div className={classes.recPostInfoAreaBox}>
              <h3>모집 정보</h3>
              <div className={classes.recPostInfoAreaRow}>
                <p>급여</p>
                <Chip label={data.paymentMethod} size="small" />
                <b>{data.paymentAmount}</b>
              </div>
              {data.tagPostResponseDto.subCategoryWithChildTagResponseDtoList.map(
                (item, itemIndex) => (
                  <div key={itemIndex} className={classes.recPostInfoAreaRow}>
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
            </div>
            <Divider orientation="vertical" flexItem />
            <div className={classes.recPostInfoAreaBox}>
              <h3>모집 조건</h3>
              <div className={classes.recPostInfoAreaRow}>
                <p>모집 인원</p>
                <b>{`${data.numberOfEmployee}명`}</b>
              </div>
              <div className={classes.recPostInfoAreaRow}>
                <p>모집 기간</p>
                <b>{data.enrollDurationType}</b>
                {data.enrollDurationType == "마감일 지정" && 
                  <>
                  :
                  <b>{data.localDate}</b>
                  </>
                }
              </div>
              <div className={classes.recPostInfoAreaRow}>
                <p>요구 경력</p>
                <b>
                  {data.hopeCareerYear == 0 || data.hopeCareerYear == null
                    ? "경력 무관"
                    : `${data.hopeCareerYear}년`}
                </b>
              </div>
            </div>
          </div>
          <div className={classes.recPostDescArea}>
            <ReadOnlyEditor content={JSON.parse(data.contents)} />
          </div>
          <Fab
            color="primary"
            variant="extended"
            sx={{
              position: "fixed",
              bottom: "1.3rem",
              right: "1.3rem",
              "&:hover": { color: "common.white" },
            }}
          >
            채팅 시작하기
          </Fab>
        </>
      )}
    </>
  );
}

// 포트폴리오 데이터 요청 함수
export async function recruitPostLoader({ request, params }) {
  const rpID = params.recruitPostID;
  try {
    const response = await apiInstance.get(`/employer/posts/${rpID}`);
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

const dummyPageData = {
  title: "Sample Title",
  companyName: "Sample Company",
  tagPostResponseDto: {
    workFieldTagName: "영상 편집",
    subCategoryWithChildTagResponseDtoList: [
      {
        subCategoryName: "작업 도구",
        childTagName: ["Addddddddddt", "Dddddde"],
      },
    ],
  },
  paymentMethod: "Payment Type",
  paymentAmount: 10000,
  numberOfEmployee: 0,
  enrollDurationType: "Duration",
  localDate: "2024-07-21",
  hopeCareerYear: 0,
  contents: JSON.stringify({
    type: "paragraph",
    content: [
      {
        type: "text",
        text: "Wow, this editor instance exports its content as JSON.",
      },
    ],
  }),
};
