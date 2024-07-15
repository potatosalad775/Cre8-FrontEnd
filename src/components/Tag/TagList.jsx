import { Chip } from "@mui/material";
import classes from "./Tag.module.css";

export default function TagList({ tagList }) {
  return (
    <ul className={classes.tagList}>
      {tagList.map((tag, index) => (
        <li className={classes.chip} key={index}>
          <Chip label={tag}/>
        </li>
      ))}
    </ul>
  );
}
