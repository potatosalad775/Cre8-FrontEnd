import { createContext, useContext, useMemo, useEffect, useState } from "react";
import Cookie from "js-cookie";
const apiAddress = import.meta.env.VITE_API_SERVER;

// 컴포넌트 간 Auth 상태를 공유하는데 사용될 Context Object
const AuthContext = createContext();

// AuthContext를 위한 Provider.
export const AuthProvider = ({ children }) => {
  // Refresh Token should be moved to Cookie
  const [token, setToken_] = useState(localStorage.getItem("token"));

  // Set new Access Token
  const setToken = (newAccessToken) => {
    setToken_(newAccessToken);
  };

  // Request new accessToken
  const reissueToken = async () => {
    const url = apiAddress + "/api/v1/auth/reissue";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "accessToken": token
      },
      credentials: 'include',
    });

    if(response.ok) {
      // Apply new Token
      const json = await response.json();
      setToken(json.data.accessToken);
    } else {
      // Auto Logout
      setToken("")
    }
  }

  // Feature for Successful Login
  var loginID = localStorage.getItem("loginID");
  var memberCode = localStorage.getItem("memberCode");
  const onLogin = ({newToken, newLoginID, newMemberCode}) => {
    loginID = newLoginID;
    memberCode = newMemberCode;
    setToken(newToken);
    localStorage.setItem("loginID", loginID);
    localStorage.setItem("memberCode", memberCode);

    // Automatically refresh Token for every 5 minutes
    setTimeout(reissueToken, 5 * 60 * 1000);
  }

  // This feature runs whenever Token values are changed
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      loginID = "";
      localStorage.removeItem("loginID");
      memberCode = "";
      localStorage.removeItem("memberCode");
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      loginID,
      memberCode,
      setToken,
      reissueToken,
      onLogin,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
