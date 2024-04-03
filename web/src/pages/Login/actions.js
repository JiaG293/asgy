import { useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { setProfile, setUser } from "../../redux/action";

//hiển thị mật khẩus
export const usePasswordVisibility = () => {
  const [visible, setVisible] = useState(false);
  const togglePasswordVisibility = () => setVisible(!visible);
  return { visible, togglePasswordVisibility };
};

//Đăng nhập thành công
export const handleLoginSuccess = (res, dispatch, navigate) => {
  const { refreshToken, profile, user } = res.metadata.tokens;
  dispatch(setProfile(profile));
  dispatch(setUser(user));
  Cookies.set("refreshToken", refreshToken);
  navigate("/home");
};

//Đăng nhập thất bại
export const handleLoginFailure = () => {
  toast.error("Mật khẩu hoặc tài khoản không chính xác");
};

//Có lỗi xảy ra khi đăng nhập
export const handleLoginError = (error) => {
  console.log(error);
  toast.error("Có lỗi xảy ra");
};

const actions = {
  usePasswordVisibility,
  handleLoginSuccess,
  handleLoginFailure,
  handleLoginError
};

export default actions;
