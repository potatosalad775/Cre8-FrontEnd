import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Link } from "@mui/material";
import apiInstance from "../../provider/networkProvider";
import { isEmpty } from "../../provider/utilityProvider";
import classes from "./HomeComponent.module.css";

export default function HomeCommunityCard({ title, boardID }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    HomeCommunityListRequest(boardID).then((res) => {
      setData(res);
    });
  }, []);

  const handleLinkClick = (postID) => {
    navigate(`/c/${postID}`);
  }

  return (
    <div className={classes.homeCommunityCardArea}>
      <h3>{title}</h3>
      <Card elevation={2} className={classes.homeCommunityCard}>
        {isEmpty(data) && <p style={{ textAlign: "center" }}>첫 게시글의 주인공이 되어보세요!</p>}
        {!isEmpty(data) && data?.map((item, index) => (
          <Link
            key={index}
            color="inherit"
            underline="none"
            className={classes.homeCommunityCardLink}
            onClick={() => {handleLinkClick(item.communityPostId)}}
          >
            <span className={classes.titleName}>{item.title} </span>
            <span className={classes.titleComment}>[{item.replyCount}]</span>
          </Link>
        ))}
      </Card>
    </div>
  );
}

async function HomeCommunityListRequest(boardID) {
  try {
    const response = await apiInstance.get(
      `/api/v1/community/posts/search/${boardID}`,
      {
        params: {
          page: 0,
          size: 5,
          sort: ["createdAt,desc"],
        },
      }
    );
    if (response.status === 200) {
      // 조회 성공
      //console.log(response.data.data)
      return response.data.data.communityPostSearchResponseDtoList;
    }
  } catch (error) {
    //console.log(error.message);
  }
  return [];
}