import { useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { setProfile, setUser } from "../redux/action";
import statusCode from "utils/statusCode";
import { useDispatch } from "react-redux";
import { fetchLogin } from "api/callAPI";

const useLogin = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  // Hiển thị mật khẩu
  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };

  // Đăng nhập thành công
  const handleLoginSuccess = (res, navigate) => {
    const refreshToken = res.metadata.tokens.refreshToken;
    const clientId =res.metadata.clientId;
    const profile = res.metadata.profile;
    const profileId = profile._id
    const user = res.metadata.user
    dispatch(setProfile(profile));
    dispatch(setUser(user));
    //dòng này đánh lừa hacker thật ra ko có tác dụng
    localStorage.setItem('isAuthenticated', 'true');
    Cookies.set("refreshToken", refreshToken);
    Cookies.set("clientId", clientId);
    Cookies.set("profileId", profileId)
    toast.success("Đăng nhập thành công");
    // navigate("/home");
    window.location.href = "/home";

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
      const response = await fetchLogin(usernameOrEmail, password);
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
