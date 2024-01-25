import "../Login/Login.scss";
import { BiSolidUserRectangle as UserIcon } from "react-icons/bi";
import { IoMdLock as PasswordIcon } from "react-icons/io";
import { Link } from "react-router-dom";

// giao diện login
function Login() {
  return (
    <div className="container">
      <form className="login-form" action="">
        <h1>Asgy</h1>
        <h2>
          {`Nơi những dòng tin nhắn giản đơn`}
          <br />
          {`trở thành những khoảnh khắc đặc biệt`}
        </h2>
        <div className="login-input-box">
          <input
            type="text"
            placeholder="Email hoặc số điện thoại"
            className="login-input"
          ></input>
          <UserIcon className="icon"></UserIcon>
        </div>
        <div className="login-input-box">
          <input
            type="password"
            placeholder="Mật khẩu"
            className="login-input"
          ></input>
          <PasswordIcon className="icon"></PasswordIcon>
        </div>
        <div className="login-forgot-password">
          <a href="">Quên mật khẩu</a>
        </div>
        <div className="login-button-box">
          <button type="submit">Đăng nhập</button>
        </div>
        <div className="login-signup-link">
          <p>
            Chưa có tài khoản? <Link to="/sign-up">Đăng ký</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
