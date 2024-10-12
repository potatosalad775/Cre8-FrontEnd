import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthProvider from "./provider/authProvider";
import NotificationProvider from "./provider/notificationProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import Routes from "./routes/Routes";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <NotificationProvider>
          <Routes />
          <ToastContainer pauseOnFocusLoss={false}/>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;

const theme = createTheme({
  palette: {
    primary: {
      main: '#673AB7',
    },
    secondary: {
      main: '#F39C12',
    },
    divider: '#AEABA7'
  },
  typography: {
    "fontFamily": 'Pretendard, system-ui, Helvetica, Arial, sans-serif'
  }
});