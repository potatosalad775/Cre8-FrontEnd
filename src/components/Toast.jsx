import { toast } from "react-toastify";

export const Toast = {
  success: (content, options) => {
    toast.success(content, {...options})
  },
  error: (content, options) => {
    toast.error(content, {...options})
  },
  registerSuccess: (content, options) => {
    toast.success(content, {...options, position: "bottom-right", autoClose: 3000})
  },
  registerError: (content, options) => {
    toast.error(content, {...options, position: "bottom-right", autoClose: 3000})
  },
  loginSuccess: (content, options) => {
    toast.success(content, {...options, position: "bottom-right", autoClose: 3000})
  },
  loginError: (content, options) => {
    toast.error(content, {...options, position: "bottom-right", autoClose: 3000})
  },
};