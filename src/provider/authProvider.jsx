import { createContext, useContext, useMemo, useEffect, useState, useCallback } from "react";
const apiAddress = import.meta.env.VITE_API_SERVER;
const TOKEN_REISSUE_INTERVAL = 5 * 60 * 1000 // 5 minutes

let currentToken = null;
let logoutFunction = null;
let onLoginFunction = null;

// 컴포넌트 간 Auth 상태를 공유하는데 사용될 Context Object
const AuthContext = createContext();

// AuthContext를 위한 Provider.
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userID, setUserID] = useState(localStorage.getItem("userID"));
  const [memberCode, setMemberCode] = useState(localStorage.getItem("memberCode"));

  // Request new accessToken
  const reissueToken = useCallback(async () => {
    if (!token) return; // Don't attempt to reissue if there's no token

    const url = `${apiAddress}/api/v1/auth/reissue`;
    //console.log("Reissuing Token");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          accessToken: token,
        },
        credentials: "include",
      });
      if (response.ok) {
        const json = await response.json();
        setToken(json.data.accessToken);
        //console.log("Token reissued successfully");
      }
    } catch (error) {
      console.error("Error reissuing token:", error);
      logout();
    }
  }, [token]);
  
  useEffect(() => {
    const intervalId = setInterval(reissueToken, TOKEN_REISSUE_INTERVAL);
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [reissueToken]);
  
  // This feature runs whenever Token values are changed
  useEffect(() => {
    if (token) {
      currentToken = token;
      localStorage.setItem("token", token);
    }
  }, [token]);

  // Feature for Successful Login
  const onLogin = useCallback(({ newToken, newUserID, newMemberCode }) => {
    setToken(newToken);
    setUserID(newUserID);
    setMemberCode(newMemberCode);
    localStorage.setItem("userID", newUserID);
    localStorage.setItem("memberCode", newMemberCode);
  }, []);
  onLoginFunction = onLogin;

  // Logout Feature
  const logout = useCallback(() => {
    console.log("Logging out!")
    setToken("");
    setUserID("");
    setMemberCode("");
    currentToken = "";
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("memberCode");
  }, []);
  logoutFunction = logout;

  const contextValue = useMemo(
    () => ({
      token,
      userID,
      memberCode,
      setToken,
      reissueToken,
      onLogin,
      logout,
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

// Exposed Feature sets for Axios
export const getCurrentToken = () => currentToken;
export const requestLogout = () => logoutFunction && logoutFunction();
export const onLogin = ({ newToken, newUserID, newMemberCode }) =>
  onLoginFunction && onLoginFunction({ newToken, newUserID, newMemberCode });

export default AuthProvider;
