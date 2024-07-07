import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { RiArrowLeftLine } from "@remixicon/react";
import classes from "./TitleBar.module.css";

export default function TitleBar({ backBtnTarget = null, title }) {
  const navigate = useNavigate();

  const handleBackBtnClick = () => {
    if (backBtnTarget) {
      navigate(backBtnTarget);
    }
  };

  return (
    <ul className={backBtnTarget ? classes.titleBar : classes.btnlessTitleBar}>
      {backBtnTarget && (
        <li>
          <IconButton onClick={handleBackBtnClick}>
            <RiArrowLeftLine />
          </IconButton>
        </li>
      )}
      <li>
        <h2>{title}</h2>
      </li>
    </ul>
  );
}
