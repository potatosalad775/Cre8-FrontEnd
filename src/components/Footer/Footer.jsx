import { Divider, IconButton, Link } from "@mui/material";
import { RiSunLine, RiMoonLine } from "@remixicon/react";
import FooterLink from "./FooterLink";
import { useDarkMode } from "../../provider/darkModeProvider";
import classes from "./Footer.module.css";

export default function Footer() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <footer className={classes.footer}>
      <div className={classes.footerContent}>
        <h1>Cre8</h1>
        <div className={classes.footerText}>
          <div className={classes.footerTopArea}>
            <p>Copyright © Cre8 - All Rights Reserved.</p>
            <IconButton onClick={toggleDarkMode}>
              {darkMode == "dark" ? <RiMoonLine /> : <RiSunLine />}
            </IconButton>
          </div>
          <Divider />
          <div className={classes.footerBottomArea}>
            <div className={classes.footerLinkRow}>
              <FooterLink href={"/agreement"}>이용약관</FooterLink>
              <FooterLink href={"https://forms.gle/reZc8LzyYNE4mnzx7"}>건의하기</FooterLink>
              <FooterLink href={"/policy"} >개인정보 처리방침</FooterLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}