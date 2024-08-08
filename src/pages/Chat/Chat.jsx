import PageContent from '../../components/PageContent';
import classes from './Chat.module.css';

export default function ChatPage() {
  return (
    <>
      <TitleBar title="채팅">
        {isLoggedIn && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddClick}
          >
            채팅 시작하기?
          </Button>
        )}
      </TitleBar>
      <div className={classes.chatPage}>
        <div className={classes.chatList}>

        </div>
        <div className={classes.chatContent}>

        </div>
      </div>
      <PageContent title="Chat Page">
        <p>This is Placeholder Text</p>
      </PageContent>
    </>
  );
}