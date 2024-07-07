import {
  useNavigate,
  useParams,
  useRouteLoaderData,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, Link, Tab, Box } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { RiGlobalLine, RiTwitterXLine, RiYoutubeLine } from "@remixicon/react";
import classes from "./Profile.module.css";

import { ReadOnlyEditor } from "../../components/Editor";
import { PortfolioGrid } from "../../components/Portfolio/PortfolioGrid";
import { useAuth } from "../../provider/authProvider";

const apiAddress = import.meta.env.VITE_API_SERVER;

export default function ProfilePage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const response = useRouteLoaderData("profile-page");
  const { memberCode } = useAuth();
  // Profile Data
  const profileData = {
    uProfileImage: response.data.accessUrl || "",
    uNickName: response.data.userNickName || "",
    uLinkYoutube: response.data.youtubeLink || "",
    uLinkTwitter: response.data.twitterLink || "",
    uLinkWebpage: response.data.personalLink || "",
    uAbout: JSON.parse(response.data.personalStatement) || "",
  };
  // Tab Index
  const tabIndex = searchParams.get("tab") || "1";

  const handleEditClick = () => {
    navigate("edit");
  };

  const handleTabChange = (e, newValue) => {
    searchParams.set("tab", newValue);
    navigate(`?${searchParams.toString()}`);
  };

  // !!! 프로필 수정 버튼 = 임시 조치
  return (
    <>
      <div className={classes.content}>
        <Avatar
          alt={profileData.uNickName}
          src={profileData.uProfileImage}
          sx={{ width: "7rem", height: "7rem" }}
        />
        <ul className={classes.contextButtonList}>
          <li>
            <h1>{profileData.uNickName}</h1>
          </li>
          <li>
            {params.userID === memberCode && (
              <button onClick={handleEditClick}>프로필 수정</button>
            )}
          </li>
        </ul>
        <div>
          {profileData.uLinkTwitter && (
            <ul className={classes.list}>
              <li>
                <RiTwitterXLine size={22} className={classes.profileIcon} />
              </li>
              <li>
                <Link
                  href={profileData.uLinkTwitter}
                  color="inherit"
                  rel="noopener noreferrer"
                >
                  {profileData.uLinkTwitter}
                </Link>
              </li>
            </ul>
          )}
          {profileData.uLinkYoutube && (
            <ul className={classes.list}>
              <li>
                <RiYoutubeLine size={22} className={classes.profileIcon} />
              </li>
              <li>
                <Link
                  href={profileData.uLinkYoutube}
                  color="inherit"
                  rel="noopener noreferrer"
                >
                  {profileData.uLinkYoutube}
                </Link>
              </li>
            </ul>
          )}
          {profileData.uLinkWebpage && (
            <ul className={classes.list}>
              <li>
                <RiGlobalLine size={22} className={classes.profileIcon} />
              </li>
              <li>
                <Link
                  href={profileData.uLinkWebpage}
                  color="inherit"
                  rel="noopener noreferrer"
                >
                  {profileData.uLinkWebpage}
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className={classes.tab}>
        <TabContext value={tabIndex}>
          <TabList onChange={handleTabChange} className={classes.tabList}>
            <Tab value="1" label="자기소개" />
            <Tab value="2" label="포트폴리오" />
          </TabList>
          <TabPanel value="1" sx={{ padding: "0.5rem 1.3rem", height: "80%" }}>
            <ReadOnlyEditor content={profileData.uAbout} />
          </TabPanel>
          <TabPanel value="2" sx={{ padding: "1.3rem" }}>
            <PortfolioGrid memberCode={params.userID} />
          </TabPanel>
        </TabContext>
      </div>
    </>
  );
}

// 프로필 데이터 요청 함수
export async function profileLoader({ request, params }) {
  const uID = params.userID;
  let url = apiAddress + `/api/v1/${uID}/profile`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

const INIT_PROFILE_DATA = {
  uProfileImage: "",
  uNickName: "",
  uLinkYoutube: "",
  uLinkTwitter: "",
  uLinkWebpage: "",
  uAbout: "",
};
