import { Divider } from "@mui/material";
import classes from "./JobList.module.css";

export default function JobListSortBar() {
  const sortMenu = [
    "최신 등록 순",
    "마감일 순",
    "요구 경력 낮은 순",
    "요구 경력 높은 순",
    "무작위 순서",
  ];

  return (
    <ul className={classes.jobListSortBar}>
      {sortMenu.map((menu, index) => (
        <li key={`btn${index}`}>
          <button
            onClick={() => {}}
            disabled={false}
          >
            {menu}
          </button>
          {!(index == sortMenu.length - 1) && <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ borderColor: "#aeaba7" }}
          />}
        </li>
      ))}
    </ul>
  );
};