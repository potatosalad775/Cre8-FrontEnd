import { TextField, Button } from "@mui/material"
import { RiImage2Fill } from "@remixicon/react";
import classes from './ChatComponent.module.css';

export default function ChatRoomInputBar() {
  return <div className={classes.chatRoomInputBar}>
    <TextField 
      variant="outlined" size="small" multiline minRows={2} fullWidth 
      sx={{"& .MuiInputBase-root": { background: "var(--color-gray-100)" }}}
    />
    <div className={classes.chatRoomInputBarButtonRow}>
      <Button size="small" variant="contained" color="inherit" sx={{minWidth: "35px", padding: "0", aspectRatio: "1/1"}}><RiImage2Fill size={20} /></Button>
      <Button size="small" variant="contained" color="primary">전송</Button>
    </div> 
  </div>
}