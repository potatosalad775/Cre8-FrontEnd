import { createContext, useContext, useMemo, useEffect, useState } from "react";

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
  const setID = (newLoginID) => {
    loginID = newLoginID;
    localStorage.setItem("loginID", loginID);
  };

  // This feature runs whenever Token values are changed
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      loginID = "";
      localStorage.removeItem("loginID");
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      loginID,
      setToken,
      setID,
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
