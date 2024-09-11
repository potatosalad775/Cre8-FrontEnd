import { useEffect, useState } from "react";
import { isEmpty } from "../../provider/utilityProvider";
import apiInstance from "../../provider/networkProvider";

export default function CommunityNavBar() {
  const [communityListData, setCommunityListData] = useState();

  useEffect(() => {
    communityListLoader().then((res) => {
      setCommunityListData(res);
    })
  }, []);

  return (<div>
    {isEmpty(communityListData) && <p>empty</p>}
    {!isEmpty(communityListData) && communityListData.map((item, index) => (
      <div key={index}>{item.communityBoardName}</div>
    ))}
  </div>)
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
    console.error(error.message);
  }
  return [];
}
