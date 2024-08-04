import { Button, Divider } from "@mui/material";
import classes from "./JobList.module.css";

export default function JobListSortBar() {
  const sortMenu = [
    "최신 등록 순",
    "마감일 순",
    "요구 경력 낮은 순",
    "요구 경력 높은 순",
  ];

  return (
    <ul className={classes.jobListSortBar}>
      {sortMenu.map((menu, index) => (
        <li key={`btn${index}`}>
          <Button
            color="inherit"
            onClick={() => {}}
            disabled={false}
          >
            {menu}
          </Button>
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