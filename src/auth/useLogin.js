import { useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { setProfile, setUser } from "../redux/action";
import callAPI from "api/callAPI";
import statusCode from "utils/statusCode";
import { useDispatch } from "react-redux";

const useLogin = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  // Hiển thị mật khẩu
  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };

  // Đăng nhập thành công
  const handleLoginSuccess = (res, navigate) => {
    const { refreshToken, profile, user } = res.metadata.tokens;
    dispatch(setProfile(profile));
    dispatch(setUser(user));
    localStorage.setItem('isAuthenticated', 'true');
    Cookies.set("refreshToken", refreshToken);
    toast.success("Đăng nhập thành công");
    navigate("/home");
  };

  // Đăng nhập thất bại
  const handleLoginFailure = () => {
    toast.error("Tài khoản hoặc mật khẩu không chính xác");
  };

  // Xử lý lỗi khi đăng nhập
  const handleLoginError = (error) => {
    console.log(error);
    toast.error("Tài khoản hoặc mật khẩu không chính xác");
  };

  // Xử lý đăng nhập
  const handleLogin = async (usernameOrEmail, password, setLoading, navigate) => {
    setLoading(true);
    try {
      const response = await callAPI.login(usernameOrEmail, password);
      if (response.status === statusCode.OK) {
        handleLoginSuccess(response, navigate);
      } else {
        handleLoginFailure();
      }
    } catch (error) {
      handleLoginError(error);
    } finally {
      setLoading(false);
    }
  };

  return { visible, togglePasswordVisibility, handleLogin };
};

export default useLogin;