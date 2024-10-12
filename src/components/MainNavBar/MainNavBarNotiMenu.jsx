import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  MenuItem,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { RiExternalLinkLine } from "@remixicon/react";

import { isEmpty } from "../../provider/utilityProvider";
import { useNotifications } from "../../provider/notificationProvider";
import apiInstance from "../../provider/networkProvider";

export default function MainNavBarNotiMenu({ anchorEl, open, handleClose }) {
  const navigate = useNavigate();
  const { setHasUnreadNotifications } = useNotifications();
  const [notiData, setNotiData] = useState([]);

  useEffect(() => {
    notiLoader().then((res) => {
      setNotiData((prev) => [...res, ...prev]);
    });
  }, [open]);

  useEffect(() => {
    if(isEmpty(notiData)) {
      setHasUnreadNotifications(false);
    }
  }, [notiData]);

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      disableScrollLock={true}
      slotProps={{
        paper: {
          style: {
            maxHeight: 32 * 8,
            width: "25rem",
          },
        },
      }}
    >
      <MenuItem sx={{ height: "28px" }}>알림</MenuItem>
      <Divider />
      {isEmpty(notiData) ? (
        <MenuItem>
          <ListItemText>알림이 없습니다.</ListItemText>
        </MenuItem>
      ) : (
        notiData.map((item, index) => (
          <MenuItem
            key={index}
            sx={{ minHeight: "32px" }}
            onClick={() => {
              if (item.notificationType === "COMMUNITY") {
                setNotiData((prev) => {
                  return [...prev.slice(0, index), ...prev.slice(index + 1)];
                });
                navigate(`/c/${item.postId}`);
              }
            }}
          >
            <Typography variant="inherit" noWrap width="100%">
              <span style={{ 
                fontWeight: "bold", 
                fontSize: "10px", 
                margin: "0", 
                display: "block" 
              }}>
                {item.notificationType}
              </span>
              {item.contents}
            </Typography>
            <RiExternalLinkLine
              size={18}
              style={{ marginBottom: "2px", marginLeft: "12px" }}
            />
          </MenuItem>
        ))
      )}
    </Menu>
  );
}

// 알림 데이터 요청 함수
async function notiLoader() {
  try {
    const response = await apiInstance.get("/api/v1/notify");
    if (response.status === 200) {
      // 조회 성공
      return response.data.data;
    }
  } catch (error) {
    // 조회 실패
    //Toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
    console.error("Error fetching notifications:", error);
  }
  return [];
}