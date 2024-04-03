import { BiSolidUserRectangle as UserIcon } from "react-icons/bi";
import { IoMdLock as PasswordIcon } from "react-icons/io";
import { IoEyeSharp as ShowPasswordIcon } from "react-icons/io5";
import { IoEyeOffSharp as HidePasswordIcon } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import "../Login/Login.scss";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import callAPI from "api/callAPI";
import actions from "./actions.js";
import statusCode from "global/statusCode";
import { useDispatch } from "react-redux";

// giao diện login
function Login() {
  const { visible, togglePasswordVisibility } = actions.usePasswordVisibility();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await callAPI.login(usernameOrEmail, password);
      if (response.status === statusCode.OK) {
        actions.handleLoginSuccess(response, navigate, dispatch);
      } else {
        actions.handleLoginFailure();
      }
    } catch (error) {
      actions.handleLoginError(error);
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
            value={usernameOrEmail}
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
            value={password}
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
