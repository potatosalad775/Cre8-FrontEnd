import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Card,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { RiArticleLine, RiBookmarkLine, RiChat4Line, RiLogoutBoxLine, RiNotification3Line, RiUserLine } from "@remixicon/react";

import classes from "./MainNavBar.module.css";
import { useAuth } from "../../provider/authProvider";

export default function MainNavBar() {
  const navigate = useNavigate();
  const { logout, userID, isLoggedIn } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navList = [
    { name: "구인", link: "/recruit" },
    { name: "구직", link: "/job" },
    { name: "커뮤니티", link: "/community" },
    { name: "테스트", link: "/test" },
  ];

  return (
    <header className={classes.header}>
      <Card className={classes.nav}>
        <ul className={classes.list}>
          <li>
            <NavLink to="/" className={classes.homeBtn} end>
              Cre8
            </NavLink>
          </li>
          {navList.map((item, index) => (
            <li key={`NAV_LIST_${index}`}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        {!isLoggedIn ? (
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
          <ul className={classes.buttonList}>
            <li>
              <IconButton onClick={() => navigate("/chat")}>
                <RiChat4Line size={20} className={classes.navIcon} />
              </IconButton>
            </li>
            <li>
              <IconButton>
                <RiNotification3Line size={20} className={classes.navIcon} />
              </IconButton>
            </li>
            <li>
              <IconButton onClick={handleClick}>
                <Avatar sx={{ width: 36, height: 36 }}></Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                disableScrollLock={true}
              >
                <MenuItem sx={{minHeight: "32px"}} onClick={() => navigate(`/p/${userID}`)}>
                  <ListItemIcon><RiUserLine size={22}/></ListItemIcon>
                  <ListItemText>프로필</ListItemText>
                </MenuItem>
                <MenuItem sx={{minHeight: "32px"}} onClick={() => navigate("/my-post")}>
                  <ListItemIcon><RiArticleLine size={22}/></ListItemIcon>
                  <ListItemText>My 게시글</ListItemText>
                </MenuItem>
                <MenuItem sx={{minHeight: "32px"}} onClick={() => navigate("/bookmark")}>
                  <ListItemIcon><RiBookmarkLine size={22}/></ListItemIcon>
                  <ListItemText>My 북마크</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem sx={{minHeight: "32px"}} onClick={logout}>
                  <ListItemIcon><RiLogoutBoxLine size={22}/></ListItemIcon>
                  <ListItemText>로그아웃</ListItemText>
                </MenuItem>
              </Menu>
            </li>
          </ul>
        )}
      </Card>
    </header>
  );
}