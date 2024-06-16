import {
  useNavigate,
  useParams,
  useRouteLoaderData,
  Form,
  useSubmit,
} from "react-router-dom";

import PageContent from "../components/PageContent";
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
import { ProfileEditor } from "../components/Editor";

const apiAddress = import.meta.env.VITE_API_SERVER;

export default function EditProfilePage() {
  const submit = useSubmit();
  const response = useRouteLoaderData("profile-page");
  const navigate = useNavigate();
  const params = useParams();
  const { loginID } = useAuth();
  const [profileAbout, setProfileAbout] = useState(
    response.data.personalStatement
  );
  const [profileData, setProfileData] = useState({
    uPFPLink: response.data.accessUrl,
    uNickName: response.data.userNickName,
    uLinkYoutube: response.data.youtubeLink,
    uLinkTwitter: response.data.twitterLink,
    uLinkWebpage: response.data.personalLink,
    uUserAbout: profileAbout,
  });
  const [tabIndex, setTabIndex] = useState("1");

  function handleSaveClick() {
    setProfileData({
      ...profileData,
      uUserAbout: JSON.stringify(profileAbout[0]),
    });
    submit(profileData, { method: "PUT" });
  }

  const handleChange = (e) => {
    setProfileData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleTabChange = (e, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Form onSubmit={handleSaveClick}>
      <div className={classes.content}>
        <Avatar
          alt={profileData.uNickName}
          src={profileData.uPFPLink}
          sx={{ width: "7rem", height: "7rem" }}
        />
        <ul className={classes.contextButtonList}>
          <li>
            <h1>{profileData.uNickName}</h1>
          </li>
          <li>
            {params.userID === loginID && (
              <button onClick={handleSaveClick}>저장</button>
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
      <p>{profileData.uUserAbout}</p>
    </Form>
  );
}

// 프로필 데이터 수정 요청 함수
export async function editProfileAction({ request }) {
  const data = await request.formData();

  const profileData = {
    multipartFile: data.get("uPFPLink"),
    userNickName: data.get("uNickName"),
    youtubeLink: data.get("uLinkYoutube"),
    twitterLink: data.get("uLinkTwitter"),
    personalLink: data.get("uLinkWebpage"),
    personalStatement: data.get("uUserAbout"),
  };

  let url = apiAddress + "/api/v1/profile";

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: profileData,
    credentials: 'include',
  });

  //console.log(response);

  switch (response.status) {  
    // 저장 완료
    case 200:
      Toast.success("변경사항들을 저장했습니다.");
      return redirect("..");
    // 인증 실패
    case 401:
      Toast.success("인증과정에서 오류가 발생했습니다.");
      return redirect("..");
    // 기타 오류
    default:
      Toast.error("알 수 없는 오류가 발생했습니다.");
      break;
  }

  return response;
}
