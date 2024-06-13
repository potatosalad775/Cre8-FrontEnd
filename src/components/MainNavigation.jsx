import { NavLink } from "react-router-dom";

import classes from "./MainNavigation.module.css";
import { useAuth } from "../provider/authProvider";

export default function MainNavigation() {
  const { token, setToken } = useAuth();

  const handleLogout = () => {
    setToken();
  }

  return (
    <header className={classes.header}>
      <nav className={classes.nav}>
        <ul className={classes.list}>
          <li>
            <NavLink to="/" className={classes.homeBtn} end>
              Cre8
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/recruit"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              구인
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/job"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              구직
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/community"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              커뮤니티
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/test"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              테스트
            </NavLink>
          </li>
        </ul>
        {!token ? (
          <ul className={classes.list}>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                로그인
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? classes.registerBtnActive : classes.registerBtn
                }
              >
                회원가입
              </NavLink>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <button onClick={handleLogout}>
                로그아웃
              </button>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
