import apiInstance from "../../provider/networkProvider";

// 작업 분야 태그 목록 요청 함수
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

// 태그 내 카테고리 목록 요청 함수
export async function tagCategoryLoader(workFieldTagID) {
  try {
    const response = await apiInstance.get(`/tag/subcategory/${workFieldTagID}`);
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

// 태그 내 카테고리 및 하위 항목 요청 함수
export async function tagElementLoader(workFieldTagID) {
  try {
    const response = await apiInstance.get(`/tag/child/${workFieldTagID}`);
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