import { ImageList, ImageListItem } from "@mui/material";

import classes from "./Portfolio.module.css";

export const PortfolioGrid = ({ itemData }) => {
  return (
    <ImageList cols={3} gap={10}>
      {itemData.map((item) => (
        <ImageListItem key={item.title} className={classes.portfolioThumbnail}>
          <img src={`${item.img}`} alt={item.title} />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
