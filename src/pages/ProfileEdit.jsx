import {
  useNavigate,
  useParams,
  useRouteLoaderData,
  Form,
  useSubmit,
  redirect,
} from "react-router-dom";

import PageContent from "../components/PageContent";
import { useState, useRef } from "react";
import { useAuth } from "../provider/authProvider";

import { Avatar, Link, Tab, Box, IconButton } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import {
  faSquareXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import classes from "./Profile.module.css";
import { ProfileEditor } from "../components/Editor";
import { Toast } from "../components/Toast";

const apiAddress = import.meta.env.VITE_API_SERVER;

export default function ProfileEditPage() {
  const submit = useSubmit();
  const response = useRouteLoaderData("profile-page");
  const navigate = useNavigate();
  const params = useParams();
  const { token, loginID } = useAuth();
  const [profileAbout, setProfileAbout] = useState(
    JSON.parse(response.data.personalStatement) || ""
  );
  const [profileData, setProfileData] = useState({
    uProfileImage: response.data.accessUrl || "",
    uNickName: response.data.userNickName || "",
    uLinkYoutube: response.data.youtubeLink || "",
    uLinkTwitter: response.data.twitterLink || "",
    uLinkWebpage: response.data.personalLink || "",
    uUserAbout: response.data.personalStatement || "",
  });
  const [tabIndex, setTabIndex] = useState("1");
  const [previewImg, setPreviewImg] = useState(
    response.data.accessUrl || ""
  );
  let isImageChanged = false;

  function handleSaveClick() {
    //console.log(profileData.uProfileImage)

    const formData = new FormData();
    isImageChanged && formData.append("multipartFile", profileData.uProfileImage);
    formData.append("userNickName", profileData.uNickName);
    formData.append("youtubeLink", profileData.uLinkYoutube);
    formData.append("twitterLink", profileData.uLinkTwitter);
    formData.append("personalLink", profileData.uLinkWebpage);
    formData.append("personalStatement", JSON.stringify(profileAbout));
    formData.append("token", token);
    //console.log(formData.get("multipartFile"))

    profileEditAction(formData).then((res) => {
      if(res.status === 200) {
        navigate("..");
      }
    });
  }

  const handleChange = (e) => {
    if (e.target.type === "file") {
      // Fetch Preview Image
      if (!e.target.files) return;
      const userImg = e.target.files[0];
      const imgURL = window.URL.createObjectURL(userImg);
      setPreviewImg(imgURL);
      //console.log(imgURL);
      isImageChanged = true;
      setProfileData((prevData) => {
        return {
          ...prevData,
          uProfileImage: userImg,
        };
      });
    } else {
      setProfileData((prevData) => {
        return {
          ...prevData,
          [e.target.name]: e.target.value,
        };
      });
    }
  };

  const handleTabChange = (e, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Form onSubmit={handleSaveClick}>
      <div className={classes.content}>
        <IconButton
          component="label"
          sx={{ width: "7rem", height: "7rem" }}
          className={classes.avatarButton}
          onChange={handleChange}
        >
          <Avatar
            alt={profileData.uNickName}
            src={previewImg}
            sx={{ width: "7rem", height: "7rem" }}
          />
          <input
            style={{ display: "none" }}
            type="file"
            accept="image/jpeg, image/png, image/webp"
          />
        </IconButton>
        <ul className={classes.contextButtonList}>
          <li>
            <h1>{profileData.uNickName}</h1>
          </li>
          <li>
            {params.userID === loginID && (
              <button type="submit">저장</button>
            )}
          </li>
        </ul>
        <div>
          <ul className={classes.list}>
            <li>
              <FontAwesomeIcon
                icon={faSquareXTwitter}
                fixedWidth
                fontSize="1.2rem"
              />
            </li>
            <li>
              <input
                id="uLinkTwitter"
                name="uLinkTwitter"
                type="text"
                value={profileData.uLinkTwitter || ""}
                onChange={handleChange}
              />
            </li>
          </ul>
          <ul className={classes.list}>
            <li>
              <FontAwesomeIcon icon={faYoutube} fixedWidth fontSize="1.2rem" />
            </li>
            <li>
              <input
                id="uLinkYoutube"
                name="uLinkYoutube"
                type="text"
                value={profileData.uLinkYoutube || ""}
                onChange={handleChange}
              />
            </li>
          </ul>
          <ul className={classes.list}>
            <li>
              <FontAwesomeIcon icon={faGlobe} fixedWidth fontSize="1.2rem" />
            </li>
            <li>
              <input
                id="uLinkWebpage"
                name="uLinkWebpage"
                type="text"
                value={profileData.uLinkWebpage || ""}
                onChange={handleChange}
              />
            </li>
          </ul>
        </div>
      </div>
      <div className={classes.tab}>
        <TabContext value={tabIndex}>
          <Box sx={{ borderBottom: 1, borderColor: "#aeaba7" }}>
            <TabList onChange={handleTabChange}>
              <Tab value="1" label="자기소개" />
              <Tab value="2" label="포트폴리오" />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ padding: 0 }}>
            <ProfileEditor
              profileAbout={profileAbout}
              setProfileAbout={setProfileAbout}
            />
          </TabPanel>
          <TabPanel value="2">포트폴리오</TabPanel>
        </TabContext>
      </div>
    </Form>
  );
}

// 프로필 데이터 수정 요청 함수
async function profileEditAction(formData) {
  const token = formData.get("token");
  formData.delete("token");

  console.log(...formData);
  //console.log(formData.get("multipartFile"))
  //console.log(token);
  
  let url = apiAddress + "/api/v1/profiles";

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      //"Content-Type": "multipart/form-data",
    },
    body: formData,
    credentials: "include",
  });

  switch (response.status) {
    // 저장 완료
    case 200:
      Toast.success("변경사항들을 저장했습니다.");
      break;
    // 인증 실패
    case 401:
      Toast.error("인증과정에서 오류가 발생했습니다.");
      break;
    // 기타 오류
    default:
      Toast.error("알 수 없는 오류가 발생했습니다.");
      break;
  }

  return response;
}
