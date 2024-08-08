
import classes from './ChatComponent.module.css';

export default function ChatRoomTopBar({ name }) {
  return <div className={classes.chatRoomTopBar}>
    <h3>{name}</h3>
  </div>
}