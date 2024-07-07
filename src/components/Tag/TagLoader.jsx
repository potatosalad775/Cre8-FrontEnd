import apiInstance from "../../provider/networkProvider";

// 포트폴리오 데이터 요청 함수
export async function tagLoader() {
  try {
    const response = await apiInstance.get("/tag");
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