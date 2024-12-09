import { Divider, IconButton, Link } from "@mui/material";
import { RiSunLine, RiMoonLine } from "@remixicon/react";
import FooterLink from "./FooterLink";
import { useDarkMode } from "../../provider/darkModeProvider";
import classes from "./Footer.module.css";

export default function FooterMd() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  
  return (
    <footer className={`${classes.footer} ${classes.footerMd}`}>
      <div className={`${classes.footerContent} ${classes.footerContentMd}`}>
        <div className={classes.footerTopArea}>
          <div className={classes.footerTopLogo}>
            <h1>Cre8</h1>
            <p>© All Rights Reserved.</p>
          </div>
          <IconButton onClick={toggleDarkMode}>
            {darkMode == "dark" ? <RiMoonLine /> : <RiSunLine />}
          </IconButton>
        </div>
        <div className={`${classes.footerText} ${classes.footerTextMd}`}>
          <Divider />
          <div className={`${classes.footerLinkRow} ${classes.footerLinkRowMd}`}>
              <FooterLink href={"/agreement"}>이용약관</FooterLink>
              <FooterLink href={"https://forms.gle/reZc8LzyYNE4mnzx7"}>건의하기</FooterLink>
              <FooterLink href={"/policy"} >개인정보 처리방침</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}