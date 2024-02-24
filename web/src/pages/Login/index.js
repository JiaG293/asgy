import { BiSolidUserRectangle as UserIcon } from "react-icons/bi";
import { IoMdLock as PasswordIcon } from "react-icons/io";
import { IoEyeSharp as ShowPasswordIcon } from "react-icons/io5";
import { IoEyeOffSharp as HidePasswordIcon } from "react-icons/io5";
import { Link } from "react-router-dom";
import "../Login/Login.scss";
import { usePasswordVisibility } from "./action";

// giao diện login
function Login() {
  const { visible, togglePasswordVisibility } = usePasswordVisibility();

  return (
    <div className="login-container">
      <form className="login-form" action="">
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
          ></input>
          <UserIcon className="login-icon"></UserIcon>
        </div>
        {/* Mật khẩu */}
        <div className="login-input-box">
          <input
            type={visible?'text':'password'}
            placeholder="Mật khẩu"
            className="login-input"
          ></input>
          <PasswordIcon className="login-icon"></PasswordIcon>
          {visible ? (
            <ShowPasswordIcon className="login-icon-right" onClick={togglePasswordVisibility}></ShowPasswordIcon>
          ) : (
            <HidePasswordIcon className="login-icon-right" onClick={togglePasswordVisibility}></HidePasswordIcon>
          )}
        </div>
        {/* Quên mật khẩu */}
        <div className="login-forgot-password">
          <a href="">Quên mật khẩu</a>
        </div>
        {/* Button đăng nhập */}
        <div className="login-button-box">
          <button type="submit">Đăng nhập</button>
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
