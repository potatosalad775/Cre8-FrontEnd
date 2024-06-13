import { useState, useEffect } from "react";
import { Form, useSubmit, useNavigation, redirect } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import UserValidate from "../components/Auth/UserValidate";

import classes from "./Register.module.css";

const apiAddress = import.meta.env.VITE_API_SERVER

export default function RegisterPage() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  // 사용자 입력 정보
  const [data, setData] = useState(INIT_INPUT_DATA);
  const [focus, setFocus] = useState({});
  const [error, setError] = useState({});

  const [inputCode, setInputCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    setError(UserValidate(data, "signup"));
  }, [data, focus])

  function handleFocus(e) {
    setFocus({...focus, [e.target.name]: true});
  }

  // 사용자 입력 event handler
  // - 사용자 입력 데이터 저장
  function handleChange(e) {
    if(e.target.name === "authCode") {
      setInputCode(e.target.value);
    } else {
      setData((prevData) => {
        return {
          ...prevData,
          [e.target.name]: e.target.value,
        };
      });
    }
  }

  // 제출 event handler
  function handleSubmit(e) {
    e.preventDefault();
    
    if (Object.keys(error).length) {
      // 회원가입 검증 실패
      toast("Wrong Input!");
      setFocus(FOCUS_ALL_DATA);
    } else if (!isCodeSent) {
      // 이메일 인증번호 전송
      checkDuplicateId(data.loginId).then((res) => {
        if (res.status === 200) {
          sendVerifyCode(data.email);
        }
      });
      setFocus(FOCUS_ALL_DATA);
    } else {
      // 회원가입 검증 통과
      checkVerifyCode({
        email: data.email,
        authNum: inputCode,
      }).then((response) => {
        submit(data, { method: "POST" });
        console.log(data);
      }, () => {
        toast("Wrong Verify Code");
      })
    }
  }

  async function sendVerifyCode(inputEmail) {
    let url = apiAddress + '/api/v1/mail';
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: inputEmail})
    });
  
    
    if(!response.ok) {
      if (response.status === 400) {
        toast("Duplicate Email Found!")
      } else if (response.status === 500) {
        toast("Mail Server is currently unavailable!")
      } else {
        toast("Unknown Error Occurred!")
      }
    } else {
      if (response.status === 200) {
        toast("Successfully sent Verification Code!")
        setIsCodeSent(true);
      } else {
        toast("Unknown Error Occurred!")
      }
    }

    return response;
  }
  
  async function checkVerifyCode(data) {
    let url = apiAddress + '/api/v1/mail/check';

    const response = await fetch(url, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: data.email,
        authNum: data.authNum,
      })
    });
    
    if(!response.ok) {
      if (response.status === 400) {
        toast("Verification Code Incorrect!")
      } else {
        toast("Unknown Error Occurred!")
      }
    } else {
      if (response.status === 200) {
        toast("Email Verification Done!")
      } else {
        toast("Unknown Error Occurred!")
      }
    }

    return response;
  }

  async function checkDuplicateId(loginId) {
    let url = apiAddress + "/api/v1/members/check?login-id=" + loginId;
  
    try {
      const response = await fetch(url, { method: "GET" });
  
      if (!response.ok) {
        if (response.status === 400) {
          toast("이미 사용 중인 아이디입니다!");
          setError({...error, loginId: "이미 사용 중인 아이디입니다!"});
        } else {
          toast("중복 아이디를 확인하는 중 오류가 발생했습니다!");
        }
      } else {
        if (response.status === 200) {
          delete error.loginId;
        } else {
          toast("중복 아이디를 확인하는 중 오류가 발생했습니다!");
        }
      }
    } catch (e) {
      console.log("Error:", e);
    } finally {
      console.log(response);
      return response;
    }
  }

  return (
    <div className="center">
      <section className={classes.regSection}>
        <h1>회원가입</h1>
        <Form method="POST" className={classes.form}>
          <div>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              onFocus={handleFocus}
              required
            />
            {error.email && focus.email && <span>{error.email}</span>}
          </div>
          <div>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              value={data.password}
              onChange={handleChange}
              onFocus={handleFocus}
              required
            />
            {error.password && focus.password && <span>{error.password}</span>}
          </div>
          <div>
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={data.confirmPassword}
              onChange={handleChange}
              onFocus={handleFocus}
              required
            />
            {error.confirmPassword && focus.confirmPassword && <span>{error.confirmPassword}</span>}
          </div>
          <div>
            <label htmlFor="loginId">아이디</label>
            <input
              id="loginId"
              name="loginId"
              type="text"
              value={data.loginId}
              onChange={handleChange}
              onFocus={handleFocus}
              required
            />
            {error.loginId && focus.loginId && <span>{error.loginId}</span>}
          </div>
          <div>
            <label htmlFor="nickName">별명</label>
            <input
              id="nickName"
              name="nickName"
              type="text"
              value={data.nickName}
              onChange={handleChange}
              onFocus={handleFocus}
              required
            />
            {error.nickName && focus.nickName && <span>{error.nickName}</span>}
          </div>
          <div>
            <label htmlFor="name">이름</label>
            <input
              id="name"
              name="name"
              type="text"
              value={data.name}
              onChange={handleChange}
              onFocus={handleFocus}
              required
            />
            {error.name && focus.name && <span>{error.name}</span>}
          </div>
          <div>
            <label htmlFor="sex">성별</label>
            <select
              id="sex"
              name="sex"
              value={data.sex}
              onChange={handleChange}
              onFocus={handleFocus}
            >
              <option value="" disabled>
                선택해주세요.
              </option>
              <option value="M">남자</option>
              <option value="W">여자</option>
            </select>
            {error.sex && focus.sex && <span>{error.sex}</span>}
          </div>
          <div>
            <label htmlFor="birthDay">생년월일</label>
            <input
              id="birthDay"
              name="birthDay"
              type="date"
              value={data.date}
              onChange={handleChange}
              onFocus={handleFocus}
              required
            />
            {error.birthDay && focus.birthDay && <span>{error.birthDay}</span>}
          </div>
          <div style={{display: isCodeSent ? undefined : 'none'}}>
            <label htmlFor="authCode">확인 코드</label>
            <input
              id="authCode"
              name="authCode"
              type="authCode"
              value={inputCode}
              onChange={handleChange}
              onFocus={handleFocus}
              disabled={!isCodeSent}
              required
            />
            {error.authCode && focus.authCode && <span>{error.authCode}</span>}
          </div>
          <button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? "회원가입 중" : "회원가입"}
          </button>
        </Form>
      </section>
      <ToastContainer />
    </div>
  );
}

export async function action({request}) {
  const data = await request.formData();
  
  const registerData = { 
    "name": data.get('name'),
    "loginId": data.get('loginId'),
    "password": data.get('password'),
    "sex": data.get('sex'),
    "nickName": data.get('nickName'),
    "birthDay": data.get('birthDay'),
    "email": data.get('email'),
  };

  let url = apiAddress + '/api/v1/members';

  const response = await fetch(url, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
  });

  if(!response.ok) {
    if (response.status === 400) {
      toast("중복된 정보가 발견되었습니다!")
    } else {
      toast("알 수 없는 오류가 발생했습니다!!")
    }
  } else {
    if (response.status === 201) {
      toast("성공적으로 가입되었습니다!!")
      return redirect('/');;
    } else {
      toast("알 수 없는 오류가 발생했습니다!")
    }
  }
  return response;
}

const INIT_INPUT_DATA = {
  email: "",
  password: "",
  confirmPassword: "",
  loginId: "",
  nickName: "",
  name: "",
  sex: "",
  birthDay: "",
};

const FOCUS_ALL_DATA = {
  email: true,
  password: true,
  confirmPassword: true,
  loginId: true,
  nickName: true,
  name: true,
  sex: true,
  birthDay: true,
};