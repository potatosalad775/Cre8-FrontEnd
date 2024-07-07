import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthProvider from "./provider/authProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import Routes from "./routes/Routes";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Routes />
        <ToastContainer pauseOnFocusLoss={false}/>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;

const theme = createTheme({
  palette: {
    primary: {
      main: "#673ab7",
    },
    secondary: {
      main: "#8bc34a",
    },
  },
  typography: {
    "fontFamily": 'Pretendard, system-ui, Helvetica, Arial, sans-serif'
  }
});
