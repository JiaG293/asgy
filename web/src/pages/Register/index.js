import { Link, useNavigate } from "react-router-dom";
import { BiSolidUserRectangle as UserIcon } from "react-icons/bi";
import { IoMdLock as PasswordIcon } from "react-icons/io";
import { MdEmail as EmailIcon } from "react-icons/md";
import { IoIosSend as SendIcon } from "react-icons/io";
import { MdOutlineVerifiedUser as OTPIcon } from "react-icons/md";
import axios from "axios";

import "./Register.scss";
import { useState } from "react";

// giao diện register
function Register() {
  const navigate = useNavigate();
  const [getUsername, setUsername] = useState("");
  const [getEmail, setEmail] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getRepassword, setRepassword] = useState("");

  // hàm chuyển hướng trang sang trang tiếp
  const navigateToCreateUserInfor = () => {
    // navigate("/create-user-infor");
  };

  //hàm đăng ký
  const handleRegister = async () => {
    try {
      //1. lấy value trên form
      const username = getUsername;
      const email = getEmail;
      const password = getPassword;
      await axios.post("http://localhost:5000/v1/signup", {
        username: username,
        email: email,
        password: password,
      });
    } catch (error) {}
  };

  //render
  return (
    <div className="register-container">
      <form className="register-form" action="">
        <h1>Thông tin tài khoản</h1>
        {/* Tên tài khoản */}
        <div className="register-input-box">
          <input
            type="text"
            className="register-input"
            placeholder="Tên tài khoản"
            value={getUsername}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
          <UserIcon className="register-icon"></UserIcon>
        </div>
        {/*Email*/}
        <div className="register-input-box">
          <input
            type="text"
            className="register-input"
            placeholder="Nhập email"
            value={getEmail}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <EmailIcon className="register-icon"></EmailIcon>
        </div>
        {/*OTP*/}
        <div className="register-OTP-div">
          <div className={"register-input-box  register-OTP"}>
            <input
              type="text"
              className="register-input"
              placeholder="Nhập OTP"
            ></input>
            <OTPIcon className="register-icon"></OTPIcon>
          </div>
          <button className="register-btn-send-OTP">
            <span style={{ fontSize: 9 }}>Gửi OTP</span>
            <SendIcon></SendIcon>
          </button>
        </div>
        {/* Mật khẩu */}
        <div className="register-input-box">
          <input
            type="password"
            className="register-input"
            placeholder="Nhập mật khẩu"
            value={getPassword}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <PasswordIcon className="register-icon"></PasswordIcon>
        </div>
        {/* Mật khẩu nhập lại*/}
        <div className="register-input-box">
          <input
            type="password"
            className="register-input"
            placeholder="Nhập lại mật khẩu"
            value={getRepassword}
            onChange={(e) => {
              setRepassword(e.target.value);
            }}
          ></input>
          <PasswordIcon className="register-icon"></PasswordIcon>
        </div>
        {/* Chính sách */}
        <div className="register-policy">
          <input type="checkbox" className="register-checkbox"></input>
          <p>
            Tôi đã đồng ý với <a href="">Điều khoản</a>,{" "}
            <a href="">Chính sách quyền riêng tư</a> và{" "}
            <a href="">Chính sách Cookies</a>
          </p>
        </div>
        {/* Button đăng ký */}
        <div className="register-button-box">
          <button type="button" onClick={handleRegister}>
            <span>Đăng ký</span>
          </button>
        </div>
        {/* Link đăng nhập */}
        <div className="register-login-link">
          <p>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
