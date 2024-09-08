import { Outlet } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";

import MainNavBar from "../components/MainNavBar/MainNavBar";
import MainNavBarSm from "../components/MainNavBar/MainNavBarSm";
import Footer from "../components/Footer/Footer";
import FooterMd from "../components/Footer/FooterMd";

export default function RootLayout() {
  const theme = useTheme();
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {matchDownSm ? <MainNavBarSm /> : <MainNavBar />}
      <main>
        <Outlet />
      </main>
      {matchDownMd ? <FooterMd /> : <Footer />}
    </>
  );
}
