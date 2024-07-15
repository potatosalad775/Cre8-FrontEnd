import { Chip } from "@mui/material";
import { IconButton } from "@mui/material";
import { RiArrowLeftLine } from "@remixicon/react";
import classes from "./Tag.module.css";

export default function TagChildSelector({ title, tagList, selectedElement, setElement }) {
  const handleClick = (tagID) => {
    if(selectedElement.has(tagID)) {
      //console.log("deleting tag")
      selectedElement.delete(tagID);
    } else {
      //console.log("adding tag")
      selectedElement.add(tagID)
    }
    setElement(new Set(selectedElement));
  };

  return (
    <div className={classes.tagSelector}>
      <h4>{title}</h4>
      <ul>
        {tagList &&
          tagList.map((tag, index) => (
            <li className={classes.chip} key={index}>
              <Chip
                label={tag.name}
                color={(selectedElement.has(tag.workFieldChildTagId)) ? "primary" : "default"}
                onClick={() => {
                  handleClick(tag.workFieldChildTagId);
                }}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}
