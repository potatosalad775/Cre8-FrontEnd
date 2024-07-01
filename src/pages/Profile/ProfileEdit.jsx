import {
  useNavigate,
  useParams,
  useRouteLoaderData,
  Form
} from "react-router-dom";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Avatar, Tab, Box, IconButton } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faSquareXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";

import { useAuth } from "../../provider/authProvider";
import { EditorMenuBar, editorExtensions } from "../../components/Editor";
import { Toast } from "../../components/Toast";

import classes from "./Profile.module.css";

const apiAddress = import.meta.env.VITE_API_SERVER;

export default function ProfileEditPage() {
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
  const [isImageChanged, setImageChanged] = useState(false);

  const handleSaveClick = (e) => {
    e.preventDefault();

    const formData = new FormData();
    isImageChanged && formData.append("multipartFile", profileData.uProfileImage);
    formData.append("userNickName", profileData.uNickName);
    formData.append("youtubeLink", getExternalLink(profileData.uLinkYoutube));
    formData.append("twitterLink", getExternalLink(profileData.uLinkTwitter));
    formData.append("personalLink", getExternalLink(profileData.uLinkWebpage));
    formData.append("personalStatement", JSON.stringify(profileAbout));
    formData.append("token", token);

    profileEditAction(formData).then((res) => {
      // Success
      if(res.status === 200) {
        navigate("..");
      }
      // TODO: error handling
    });
  }

  const handleChange = (e) => {
    if (e.target.type === "file") {
      // Fetch Preview Image
      if (!e.target.files) return;
      const userImg = e.target.files[0];
      const imgURL = window.URL.createObjectURL(userImg);
      setImageChanged(true);
      setPreviewImg(imgURL);
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
    <>
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
              <button type="submit" onClick={handleSaveClick}>저장</button>
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
                type="url"
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
                type="url"
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
                type="url"
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
    </>
  );
}

// 프로필 에디터
const ProfileEditor = ({ profileAbout, setProfileAbout }) => {
  const editor = useEditor({
    extensions: editorExtensions,
    content: profileAbout ? {
      "type": "doc",
      "content": profileAbout,
    } : "",
    onUpdate: ({editor}) => {
      const json = editor.getJSON()
      const data = json.content
      setProfileAbout(data);
    }
  });

  return (
    <div className={`${classes.editor} ${classes.profileEditor}`}>
      <EditorMenuBar editor={editor} />
      <EditorContent editor={editor}/>
    </div>
  );
};

// 프로필 데이터 수정 요청 함수
async function profileEditAction(formData) {
  const token = formData.get("token");
  formData.delete("token");
  
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
      //setToken(); // Logout
      break;
    // 기타 오류
    default:
      Toast.error("알 수 없는 오류가 발생했습니다.");
      break;
  }

  return response;
}

// 링크 가공 함수
function getExternalLink(link) {
  const pattern = /^(https?:\/)/;
  if (!pattern.test(link)) {
    return `https://${link}`;
  }
  return link;
}