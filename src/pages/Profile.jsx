import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";

import { useState } from "react";
import { useAuth } from "../provider/authProvider";

import { Avatar, Link, Tab, Box } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import {
  faSquareXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import classes from "./Profile.module.css";
import { ReadOnlyEditor } from "../components/Editor";

const apiAddress = import.meta.env.VITE_API_SERVER;

export default function ProfilePage() {
  const navigate = useNavigate();
  const params = useParams();
  const { loginID } = useAuth();
  const [tabIndex, setTabIndex] = useState("1");

  const response = useRouteLoaderData("profile-page");

  const profileData = {
    uProfileImage: response.data.accessUrl || "",
    uNickName: response.data.userNickName || "",
    uLinkYoutube: response.data.youtubeLink || "",
    uLinkTwitter: response.data.twitterLink || "",
    uLinkWebpage: response.data.personalLink || "",
  };
  const profileAboutJSON = JSON.parse(response.data.personalStatement) || "";

  function handleEditClick() {
    navigate("edit");
  }

  const handleTabChange = (e, newValue) => {
    setTabIndex(newValue);
  };

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
            {params.userID === loginID && (
              <button onClick={handleEditClick}>프로필 수정</button>
            )}
          </li>
        </ul>
        <div>
          {profileData.uLinkTwitter && (
            <ul className={classes.list}>
              <li>
                <FontAwesomeIcon
                  icon={faSquareXTwitter}
                  fixedWidth
                  fontSize="1.2rem"
                  transform="down-1.0"
                />
              </li>
              <li>
                <Link href={profileData.uLinkTwitter} color="inherit">
                  {profileData.uLinkTwitter}
                </Link>
              </li>
            </ul>
          )}
          {profileData.uLinkYoutube && (
            <ul className={classes.list}>
              <li>
                <FontAwesomeIcon
                  icon={faYoutube}
                  fixedWidth
                  fontSize="1.2rem"
                  transform="down-1.0"
                />
              </li>
              <li>
                <Link href={profileData.uLinkYoutube} color="inherit">
                  {profileData.uLinkYoutube}
                </Link>
              </li>
            </ul>
          )}
          {profileData.uLinkWebpage && (
            <ul className={classes.list}>
              <li>
                <FontAwesomeIcon
                  icon={faGlobe}
                  fixedWidth
                  fontSize="1.2rem"
                  transform="down-1.0"
                />
              </li>
              <li>
                <Link href={profileData.uLinkWebpage} color="inherit">
                  {profileData.uLinkWebpage}
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className={classes.tab}>
        <TabContext value={tabIndex}>
          <Box sx={{ borderBottom: 1, borderColor: "#ccc9c6" }}>
            <TabList onChange={handleTabChange}>
              <Tab value="1" label="자기소개" />
              <Tab value="2" label="포트폴리오" />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ padding: 0 }}>
            <ReadOnlyEditor content={profileAboutJSON} />
          </TabPanel>
          <TabPanel value="2">포트폴리오</TabPanel>
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
