import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import AuthProvider from "./provider/authProvider";
import Routes from "./routes/Routes";

function App() {
  return <AuthProvider>
    <Routes />
    <ToastContainer />
  </AuthProvider>;
}

export default App;
