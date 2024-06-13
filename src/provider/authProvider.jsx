import axios from "axios";
import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 컴포넌트 간 Auth 상태를 공유하는데 사용될 Context Object
const AuthContext = createContext();

// AuthContext를 위한 Provider.
export const AuthProvider = ({ children }) => {
  // Refresh Token should be moved to Cookie
  const [token, setToken_] = useState(localStorage.getItem("token"));

  // Set new Access Token
  const setToken = (newAccessToken) => {
    console.log("Setting Access Token!");
    setToken_(newAccessToken);
  };

  // This feature runs whenever Token values are changed
  useEffect(() => {
    if (token) {
      // axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      axios.interceptors.request.use((config) => {
        config.headers.Authorization = "Bearer " + token;
        return config;
      });
      localStorage.setItem('token', token);
    } else {
      axios.interceptors.request.use((config) => {
        config.headers.Authorization = "";
        return config;
      });
      localStorage.removeItem('token')
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  return <AuthContext.Provider value={contextValue}>
    {children}
  </AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;