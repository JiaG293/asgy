import { BiSolidUserRectangle as UserIcon } from "react-icons/bi";
import { IoMdLock as PasswordIcon } from "react-icons/io";
import { IoEyeSharp as ShowPasswordIcon } from "react-icons/io5";
import { IoEyeOffSharp as HidePasswordIcon } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import "../Login/Login.scss";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import useLogin from "../../auth/useLogin";

// Giao diện login
function Login() {
  const { visible, togglePasswordVisibility, handleLogin } = useLogin();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    handleLogin(usernameOrEmail, password, setLoading, navigate);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLoginClick();
    }
  };

  // Render
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
            onKeyDown={handleKeyPress}
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
            onKeyDown={handleKeyPress}
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
          <button type="button" onClick={handleLoginClick} disabled={loading}>
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
