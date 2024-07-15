import TagList from "../Tag/TagList";
import classes from "./JobList.module.css";

export default function JobListCard({itemData}) {
  return <div className={classes.jobListCard}>
    <h3>{itemData.title}</h3>
    <h5>{itemData.companyName} | {itemData.enrollDurationType}</h5>
    <TagList tagList={itemData.tagNameList}/>
  </div>;
}