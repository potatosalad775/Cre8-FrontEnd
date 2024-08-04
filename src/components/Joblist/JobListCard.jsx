import TagList from "../Tag/TagList";
import classes from "./JobList.module.css";

export function RecruitListCard({ itemData, onClick = () => {} }) {
  return <div className={classes.jobListCard} onClick={onClick}>
    <h3>{itemData.title}</h3>
    <h5>{itemData.companyName} | {itemData.enrollDurationType}</h5>
    <TagList tagList={itemData.tagNameList}/>
  </div>;
}

export function JobListCard({ itemData, onClick = () => {} }) {
  return <div className={classes.jobListCard} onClick={onClick}>
    <h3>{itemData.title}</h3>
    <h5>{itemData.memberName.replace(/..$/, "**")} | {itemData.sex} | {itemData.year}년생</h5>
    <TagList tagList={itemData.tagNameList}/>
  </div>;
}