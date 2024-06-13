import { toast } from "react-toastify";

export const Toast = {
  success: (content, options) => {
    toast.success(content, {...options})
  },
  error: (content, options) => {
    toast.error(content, {...options})
  },
  registerSuccess: (content, options) => {
    toast.success(content, {...options, position: "bottom-right"})
  },
  registerError: (content, options) => {
    toast.error(content, {...options, position: "bottom-right"})
  },
  loginSuccess: (content, options) => {
    toast.success(content, {...options, position: "bottom-right"})
  },
  loginError: (content, options) => {
    toast.error(content, {...options, position: "bottom-right"})
  },
};