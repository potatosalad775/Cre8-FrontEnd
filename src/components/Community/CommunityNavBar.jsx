import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { isEmpty } from "../../provider/utilityProvider";
import apiInstance from "../../provider/networkProvider";
import { Toast } from "../Common/Toast";
import classes from "./CommComponent.module.css";

export default function CommunityNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const boardId = searchParams.get("b") || 1;
  const [communityListData, setCommunityListData] = useState();

  useEffect(() => {
    communityListLoader().then((res) => {
      setCommunityListData(res);
    });
  }, []);
  
  const handleClick = (boardId, boardName) => {
    navigate(`/c?b=${boardId}`, { replace: true, state: { boardName: boardName } });
  }

  return (
    <div className={classes.cmNavBtnList}>
      {isEmpty(communityListData) && <p>empty</p>}
      {!isEmpty(communityListData) &&
        communityListData.map((item, index) => (
          <Button 
            key={`CM_NAV_BTN_${index}`} 
            variant="text" 
            sx={boardId == item.communityBoardId ? {
              color: "var(--color-primary-600)",
              borderLeft: "0.2rem solid var(--color-primary-600)",
              padding: "0.7rem 1.3rem 0.7rem 1.1rem",
              fontWeight: "800"
            } : {
              color: "inherit",
              borderLeft: "0",
              padding: "0.7rem 1.3rem",
              fontWeight: "inherit"
            }}
            onClick={() => handleClick(item.communityBoardId, item.communityBoardName)}
            fullWidth
          >
            {item.communityBoardName}
          </Button>
        ))}
    </div>
  );
}

// 커뮤니티 목록 데이터 요청 함수
async function communityListLoader() {
  try {
    const response = await apiInstance.get("/api/v1/community/boards");
    if (response.status === 200) {
      // 조회 성공
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
    Toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
  }
  return [];
}
