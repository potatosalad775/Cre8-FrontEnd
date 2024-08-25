import { Card, Grid } from "@mui/material";
import classes from "./HomeComponent.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiInstance from "../../provider/networkProvider";
import TagList from "../Tag/TagList";
import { isEmpty } from "../../provider/utilityProvider";

export default function HomeJobList() {
  const navigate = useNavigate();
  const [data, setData] = useState();

  useEffect(() => {
    fetchHomeJobList().then((res) => {
      setData(res);
    });
  }, []);

  const handleCardClick = (postID) => {
    navigate(`/job/${postID}`);
  };

  return (
    <div className={classes.homePostArea}>
      <h3>새로운 크리에이터 구인 공고</h3>
      <Grid container columns={{ xs: 2, sm: 4 }} spacing={{ xs: 2, sm: 2 }}>
        {!isEmpty(data) &&
          data?.employeePostSearchResponseDtoList?.map((item, index) => (
            <Grid item key={index} xs={2} sm={2}>
              <Card
                elevation={2}
                className={classes.homeJobPostCard}
                onClick={() => {
                  handleCardClick(item.employeePostId);
                }}
              >
                <h3>{item.title}</h3>
                <TagList tagList={item.tagNameList} />
              </Card>
            </Grid>
          ))}
      </Grid>
      {isEmpty(data) && <p>구인 공고를 불러오지 못했습니다.</p>}
    </div>
  );
}

// 구인 게시글 검색 함수
async function fetchHomeJobList() {
  try {
    const response = await apiInstance.get("/api/v1/employee-posts/search", {
      params: {
        size: 4,
        direction: "desc",
        sort: ["createdAt"],
      },
    });
    if (response.status === 200) {
      // 조회 성공
      if (response.data.data == "") {
        // 데이터가 비어있으면 null 반환
        return {};
      } else {
        return response.data.data;
      }
    }
  } catch (error) {
    // 조회 실패
    console.error(error.message);
  }
  return {};
}
