import { Chip } from "@mui/material";
import classes from "./Tag.module.css";

export default function TagSelector({ title, tagList, selectedTag, setTag, toggle = false }) {
  const handleClick = (tagID) => {
    setTag(tagID);
    if(selectedTag == tagID && toggle) {
      setTag();
    }
  };

  return (
    <div className={classes.tagSelector}>
      {title && <h4>{title}</h4>}
      <ul>
        {tagList &&
          tagList.map((tag, index) => (
            <li className={classes.chip} key={index}>
              <Chip
                label={tag.name}
                color={(selectedTag == tag.workFieldTagId) ? "primary" : "default"}
                onClick={() => {
                  handleClick(tag.workFieldTagId);
                }}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}
