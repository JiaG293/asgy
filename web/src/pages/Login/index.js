import { BiSolidUserRectangle as UserIcon } from "react-icons/bi";
import { IoMdLock as PasswordIcon } from "react-icons/io";
import { IoEyeSharp as ShowPasswordIcon } from "react-icons/io5";
import { IoEyeOffSharp as HidePasswordIcon } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import "../Login/Login.scss";
import { usePasswordVisibility } from "./action";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { setProfile, setUser, setAuthenticated } from "../../redux/action";
import { useSelector, useDispatch } from "react-redux";

// giao diện login
function Login() {
  //gọi hàm từ file action
  const { visible, togglePasswordVisibility } = usePasswordVisibility();
  const [getUsernameOrEmail, setUsernameOrEmail] = useState("");
  const [getPassword, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const setAuthenticated = useSelector((state) => state.isAuthenticated);
  const dispatch = useDispatch();
  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/login",
        {
          userID: getUsernameOrEmail,
          password: getPassword,
        }
      );
  
      if (response.status === 200) {
        const refreshToken = response.data.metadata.tokens.refreshToken;
  
        const profile = response.data.metadata.profile;
        console.log(profile);
        const user = response.data.metadata.user;
  
        dispatch(setProfile(profile));
        dispatch(setUser(user));
        // dispatch(setAuthenticated(true))
  
        Cookies.set("refreshToken", refreshToken);
        navigate("/home");
      } else {
        toast.error("Đăng nhập thất bại");
      }
    } catch (error) {
      console.log(error);
      toast.error("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  //render
  return (
    <div className="login-container">
      <form className="login-form">
        <h1>Asgy</h1>
        <h2>
          {`Nơi những dòng tin nhắn giản đơn`}
          <br />
          {`trở thành những khoảnh khắc đặc biệt`}
        </h2>
        {/* Tên tài khoản hoặc email */}
        <div className="login-input-box">
          <input
            type="text"
            placeholder="Tên tài khoản hoặc email"
            className="login-input"
            value={getUsernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          ></input>
          <UserIcon className="login-icon"></UserIcon>
        </div>
        {/* Mật khẩu */}
        <div className="login-input-box">
          <input
            type={visible ? "text" : "password"}
            placeholder="Mật khẩu"
            className="login-input"
            value={getPassword}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <PasswordIcon className="login-icon"></PasswordIcon>
          {visible ? (
            <ShowPasswordIcon
              className="login-icon-right"
              onClick={togglePasswordVisibility}
            ></ShowPasswordIcon>
          ) : (
            <HidePasswordIcon
              className="login-icon-right"
              onClick={togglePasswordVisibility}
            ></HidePasswordIcon>
          )}
        </div>
        {/* Quên mật khẩu */}
        <div className="login-forgot-password">
          <Link to="/forgot-password">Quên mật khẩu</Link>
        </div>
        {/* Button đăng nhập */}
        <div className="login-button-box">
          <button type="button" onClick={handleLogin} disabled={loading}>
            {loading ? "Đang đăng nhập ..." : "Đăng nhập"}
          </button>
        </div>
        {/* Link đăng ký */}
        <div className="login-register-link">
          <p>
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
