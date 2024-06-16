import axios from "axios";
import { useState, useEffect } from "react";
import { Form, useNavigation, useNavigate } from "react-router-dom";

import { useAuth } from "../provider/authProvider";
import UserValidate from "../components/Auth/UserValidate";
import { Toast } from "../components/Toast";
import classes from "./Register.module.css";

const apiAddress = import.meta.env.VITE_API_SERVER;

export default function LoginPage() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  // 사용자 입력 정보
  const [loginData, setLoginData] = useState({
    userID: "",
    password: "",
  });
  const [focus, setFocus] = useState({});
  const [loginError, setLoginError] = useState({});

  const { setToken, setID } = useAuth();

  useEffect(() => {
    setLoginError(UserValidate(loginData, "signin"));
  }, [loginData, focus]);

  const handleFocus = (e) => {
    setFocus({ ...focus, [e.target.name]: true });
  };

  // 사용자 입력 event handler
  // - 사용자 입력 데이터 저장
  const handleChange = (e) => {
    setLoginData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (Object.keys(loginError).length) {
      console.log(loginError)
      // 입력값 오류가 한 개 이상 발견 시
      Toast.registerError("입력하신 내용들을 다시 확인해주세요!");
      setFocus(FOCUS_ALL_DATA);
    } else {
      // 로그인 시도
      const response = await sendLoginRequest(loginData);
      switch(response.status) {
        case 201:
          // 로그인 성공
          const json = await response.json();
          const userID = json.data.userId
          setToken(response.headers.get("Authorization"));
          setID(userID);
          Toast.loginSuccess(`${userID}님 환영합니다.`);
          navigate("/");
          break;
        case 400:
          // 로그인 실패
          Toast.loginError("아이디 또는 비밀번호가 틀립니다.");
          break;
        default:
          Toast.loginError("알 수 없는 오류가 발생했습니다.");
          break;
      }
    }
  };

  return (
    <div className="center">
      <section className={classes.regSection}>
        <h1>로그인</h1>
        <Form onSubmit={handleLogin} className={classes.form}>
          <div>
            <label htmlFor="userID">아이디</label>
            <input
              id="userID"
              name="userID"
              type="text"
              value={loginData.userID}
              onChange={handleChange}
              onFocus={handleFocus}
              required
            />
            {loginError.userID && focus.userID && <span>{loginError.userID}</span>}
          </div>
          <div>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              value={loginData.password}
              onChange={handleChange}
              onFocus={handleFocus}
              required
            />
            {loginError.password && focus.password && <span>{loginError.password}</span>}
          </div>
          <div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "로그인 중" : "로그인"}
            </button>
          </div>
        </Form>
      </section>
    </div>
  );
}

// 로그인 요청 함수
async function sendLoginRequest(inputData) {
  let url = apiAddress + "/api/v1/auth/login";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputData),
    credentials: 'include',
  });

  return response;
}

const FOCUS_ALL_DATA = {
  userID: true,
  password: true,
};
