import { useRouteLoaderData } from "react-router-dom";
import { ImageList, ImageListItem } from "@mui/material";

import PageContent from "../../components/PageContent";
import TitleBar from "../../components/TitleBar";
import TagList from "../../components/Tag/TagList";
import apiInstance from "../../provider/networkProvider";
import { ReadOnlyEditor } from "../../components/Editor";
import classes from "./Portfolio.module.css";

export default function PortfolioPage() {
  const data = useRouteLoaderData("portfolio-page");
  //const data = dummyPortfolioPageData;

  return (
    <>
      <TitleBar backBtnTarget={"..?tab=2"} title="포트폴리오" />
      {!data ? (
        <PageContent>
          <p>포트폴리오를 불러오는 중 오류가 발생했습니다.</p>
        </PageContent>
      ) : (
        <>
          <div className={classes.ptfDescArea}>
            <ReadOnlyEditor content={JSON.parse(data.description)} />
          </div>
          <div className={classes.ptfTagArea}>
            <TagList tagList={data.tagName} />
          </div>
          <ImageList
            cols={1}
            gap={20}
            sx={{ padding: "0 1.3rem 1.3rem 1.3rem" }}
          >
            {data.accessUrl.map((item, index) => (
              <ImageListItem key={`IMG_${index}`}>
                <img src={`${item}`} alt={`IMG_${index}`} />
              </ImageListItem>
            ))}
          </ImageList>
        </>
      )}
    </>
  );
}

// 포트폴리오 데이터 요청 함수
export async function portfolioLoader({ request, params }) {
  const pID = params.portfolioID;
  try {
    const response = await apiInstance.get(`/portfolios/${pID}`);
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

const dummyPortfolioPageData = {
  tagName: [
    "Sample Tag",
    "Tag2",
    "Looooooooooong Tag",
    "Suuuuuuuuuuuper Loooooooooooooooooooooooooooong Tag",
    "Hello",
  ],
  accessUrl: [
    "https://media1.tenor.com/m/CWHdjtoLXToAAAAC/among-us.gif",
    "https://media1.tenor.com/m/f4PUj7wUIm4AAAAC/cat-tongue.gif",
    "https://media1.tenor.com/m/w0dZ4Eltk7IAAAAC/vuknok.gif",
  ],
  description: "This is dummy data",
};
