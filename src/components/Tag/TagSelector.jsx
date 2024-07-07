import { Chip } from "@mui/material";
import { IconButton } from "@mui/material";
import { RiArrowLeftLine } from "@remixicon/react";
import classes from "./TagList.module.css";

export default function TagSelector({ title, tagList }) {
  return (
    <ul className={classes.tagSelector}>
      <h4>{title}</h4>
      {tagList.map((tag, index) => (
        <li className={classes.chip} key={index}>
          <Chip label={tag} />
        </li>
      ))}
    </ul>
  );
}
