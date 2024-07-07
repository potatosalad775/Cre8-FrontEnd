import { useEffect, useState } from "react";
import { useParams, useNavigate, useRouteLoaderData } from "react-router-dom";
import { ImageList, ImageListItem, IconButton } from "@mui/material";
import { RiAddFill, RiDeleteBinLine } from "@remixicon/react";
import { useEditor, EditorContent } from "@tiptap/react";

import PageContent from "../../components/PageContent";
import TitleBar from "../../components/TitleBar";
import TagList from "../../components/Tag/TagList";
import TagSelector from "../../components/Tag/TagSelector";
import { tagLoader } from "../../components/Tag/TagLoader";
import apiInstance from "../../provider/networkProvider";
import { Toast } from "../../components/Toast";
import { EditorMenuBar, editorExtensions } from "../../components/Editor";
import classes from "./Portfolio.module.css";

export default function PortfolioEditPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(useRouteLoaderData("portfolio-page-edit"));
  // Portfolio Description in JSON type
  const [ptfDesc, setPtfDesc] = useState(JSON.parse(data.description) || "");
  const [uploadedImgArray, setUploadedImgArray] = useState([]);
  const [mainTag, setMainTag] = useState();

  useEffect(() => {
    // Load Global Tag
    tagLoader().then((tagData) => {
      setMainTag(tagData);
    });
    //console.log(data);
  }, []);

  const handleDeleteImg = () => {
    console.log("REMOVE IMAGE!!");
  };
  const handleAddImg = (e) => {
    console.log("ADD IMAGE!!");
    if (e.target.type === "file" && e.target.files && e.target.files[0]) {
      // Fetch Preview Image
      const uploadedImg = e.target.files[0];
      const imgURL = window.URL.createObjectURL(uploadedImg);
      setUploadedImgArray(prevArray => [...prevArray, uploadedImg]);
      setData((prevData) => {
        return {
          ...prevData,
          accessUrl: [...prevData.accessUrl, imgURL],
        };
      });
    }
  };
  const handleCancelEdit = () => {
    navigate("../");
  };
  const handleSaveEdit = (e) => {
    console.log("Saving!!");
    e.preventDefault();
    console.log(uploadedImgArray);

    const formData = new FormData();
    formData.append("portfolioId", params.portfolioID);
    //formData.append("workFieldId", "");
    //formData.append("workFieldChildTagId", "");
    uploadedImgArray.forEach((file, index) => {
      formData.append("multipartFileList", file);
    });
    formData.append("description", JSON.stringify(ptfDesc));

    portfolioEditAction(formData).then((res) => {
      // Success
      if (res && res.status === 200) {
        navigate("..");
      }
      // TODO: error handling
    });
  };

  return (
    <div className={classes.ptfEditPage}>
      <TitleBar title="포트폴리오 수정" />
      <div className={classes.editTagArea}>
        <h3>태그 설정</h3>
        <p>작업물을 가장 잘 설명하는 태그를 선택해주세요.</p>
        <TagSelector title="테스트" tagList={data.tagName} />
        <TagSelector title="테스트" tagList={data.tagName} />
        <TagSelector title="테스트" tagList={data.tagName} />
      </div>
      <div className={classes.editImageArea}>
        <h3>이미지 첨부</h3>
        <ImageList cols={5} gap={10} sx={{ padding: "0.4rem 1.3rem" }}>
          {data.accessUrl.map((item, index) => (
            <ImageListItem key={`IMG_${index}`}>
              <img src={`${item}`} alt={`IMG_${index}`} />
              <IconButton
                className={classes.deleteButton}
                onClick={handleDeleteImg}
              >
                <RiDeleteBinLine />
              </IconButton>
            </ImageListItem>
          ))}
          <label htmlFor="ptfImgUploadBtn">
            <ImageListItem key={"imgAddBtn"} className={classes.imgAddBtn}>
              <RiAddFill />
              <input
                id="ptfImgUploadBtn"
                style={{ display: "none" }}
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleAddImg}
              />
            </ImageListItem>
          </label>
        </ImageList>
      </div>
      <div className={classes.editDescArea}>
        <h3>작업물 설명</h3>
        <PortfolioEditor ptfDesc={ptfDesc} setPtfDesc={setPtfDesc} />
      </div>
      <div className={classes.editBtnArea}>
        <button onClick={handleCancelEdit} className={classes.cancelEditBtn}>
          취소
        </button>
        <button onClick={handleSaveEdit}>저장</button>
      </div>
    </div>
  );
}

// 프로필 데이터 수정 요청 함수
async function portfolioEditAction(formData) {
  /*
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
  */
  try {
    const response = await apiInstance({
      method: "put",
      url: "/portfolios",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200) {
      // 저장 성공
      Toast.success("변경사항들을 저장했습니다.");
      return response;
    }
  } catch (error) {
    // 로그인 실패
    console.log(error.message);
    if (error.response && error.response.status === 400) {
      Toast.error("인증과정에서 오류가 발생했습니다.");
    } else if (error.response && error.response.status === 404) {
      Toast.error("태그를 다루는 도중 오류가 발생했습니다.");
    } else {
      Toast.error("알 수 없는 오류가 발생했습니다.");
    }
  }
  return null;
}

// 포트폴리오 에디터
const PortfolioEditor = ({ ptfDesc, setPtfDesc }) => {
  const editor = useEditor({
    extensions: editorExtensions,
    content: ptfDesc
      ? {
          type: "doc",
          content: ptfDesc,
        }
      : "",
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const data = json.content;
      setPtfDesc(data);
    },
    editorProps: {
      attributes: {
        style: "min-height: 17rem;",
      },
    },
  });

  return (
    <div className={classes.editor}>
      <EditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

const dummyPortfolioPageData = {
  tagName: ["Sample Tag", "Tag2", "Looooooooooong Tag"],
  accessUrl: [
    "https://media1.tenor.com/m/CWHdjtoLXToAAAAC/among-us.gif",
    "https://media1.tenor.com/m/f4PUj7wUIm4AAAAC/cat-tongue.gif",
    "https://media1.tenor.com/m/w0dZ4Eltk7IAAAAC/vuknok.gif",
  ],
  description: "This is dummy data",
};
