import { useState, useEffect } from "react";

import TestContent from "./TestContent.jsx";
import { fetchTestData, addTestData } from "../../http.js";
import { useAuth } from "../../provider/authProvider.jsx";

const apiAddress = import.meta.env.VITE_API_SERVER;

export default function LoginTest() {
  const { token, reissueToken } = useAuth();

  const [loginMessage, setLoginMessage] = useState("");

  const handleClick = async () => {
    let url = apiAddress + "/test/login";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: 'include',
    });

    const resText = await response.text();
    if(response.status === 200) {
      setLoginMessage(resText);
    } else {
      setLoginMessage("Authorization Failed");
    }
  }

  const handleReIssue = () => {
    reissueToken();
  }

  return (
    <section id="test-section">
      <h3>Login Test Section</h3>
      <div>
        <p>{loginMessage}</p>
      </div>
      <button onClick={handleClick}>확인</button>
      <button onClick={handleReIssue}>토큰 재발급</button>
    </section>
  );
}