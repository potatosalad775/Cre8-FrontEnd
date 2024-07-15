import { useState, useEffect } from "react";

import TitleBar from "../../components/TitleBar";
import TagSelector from "../../components/Tag/TagSelector";
import TagChildSelector from "../../components/Tag/TagChildSelector";
import JobListSortBar from "../../components/Joblist/JobListSortBar";
import JobListCard from "../../components/Joblist/JobListCard";
import { tagLoader, tagElementLoader } from "../../components/Tag/TagLoader";
import classes from "./Recruit.module.css";

export default function RecruitPage() {
  //const data = useRouteLoaderData("recruit-page");
  const data = dummyData;
  // Tag Data
  const [tagData, setTagData] = useState();
  const [tagElementData, setTagElementData] = useState();
  // User selected tag
  const [selectedTag, setSelectedTag] = useState();
  const [selectedElement, setSelectedElement] = useState(new Set());

  useEffect(() => {
    // on Initial Load...
    // Load Main Tag
    if (!tagData) {
      //console.log("Loading Main Tag");
      tagLoader().then((res) => {
        setTagData(res);
      });
    }
  }, []);

  useEffect(() => {
    // on Main Tag Change...
    // Load Tag Child
    if (selectedTag) {
      //console.log("Loading Tag Child");
      tagElementLoader(selectedTag).then((res) => {
        setTagElementData(res);
        //console.log(tagElementData);
      });
    }
    //console.log(tagData)
    //console.log(tagElementData)
  }, [selectedTag]);

  return (
    <div>
      <TitleBar title="구인" />
      <div className={classes.recruitTagArea}>
        <TagSelector
          title="작업 분야"
          tagList={tagData}
          selectedTag={selectedTag}
          setTag={setSelectedTag}
        />
        {tagElementData &&
          tagElementData.map((subTag, index) => (
            <TagChildSelector
              key={index}
              title={subTag.subCategoryName}
              tagList={subTag.workFieldChildTagResponseDtoList}
              selectedElement={selectedElement}
              setElement={setSelectedElement}
            />
          ))}
      </div>
      <JobListSortBar />
      <div>
        {data.employerPostSearchResponseDtoList &&
          data.employerPostSearchResponseDtoList.map((item, index) => (
            <JobListCard key={index} itemData={item}/>
          ))}
      </div>
    </div>
  );
}

const dummyData = {
  totalCount: 2,
  employerPostSearchResponseDtoList: [
    {
      employerPostId: 0,
      title: "Test Post 1",
      companyName: "Test Company",
      enrollDurationType: "Duration 1",
      tagNameList: ["Tag1", "Tag2"],
    },
    {
      employerPostId: 1,
      title: "Test Post 2",
      companyName: "테스트 회사",
      enrollDurationType: "Duration 2",
      tagNameList: ["hello?", "yyyyyyy"],
    },
  ],
  totalPages: 1,
};
