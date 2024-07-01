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

  var loginID = localStorage.getItem("loginID");
  var memberIDCode = localStorage.getItem("memberIDCode");
  const setID = ({newLoginID, newMemberIDCode}) => {
    loginID = newLoginID;
    memberIDCode = newMemberIDCode;
    localStorage.setItem("loginID", loginID);
    localStorage.setItem("memberIDCode", memberIDCode);
  };

  const reissueToken = async () => {
    const url = apiAddress + "/api/v1/auth/reissue";
    const refreshToken = Cookie.get("refreshToken");
 
    //console.log(refreshToken);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "accessToken": token,
        "refreshToken": refreshToken,
      },
      credentials: 'include',
    });

    console.log(response)
    console.log(response.data)
    if(response.ok) {
      console.log(response.data.accessToken)
    }
  }

  // This feature runs whenever Token values are changed
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      loginID = "";
      localStorage.removeItem("loginID");
      memberIDCode = "";
      localStorage.removeItem("memberIDCode");
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      loginID,
      memberIDCode,
      setToken,
      setID,
      reissueToken,
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
