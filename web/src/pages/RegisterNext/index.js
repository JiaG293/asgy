import { Link, useNavigate } from "react-router-dom";
import { BiSolidUserRectangle as UserIcon } from "react-icons/bi";
import { IoMdLock as PasswordIcon } from "react-icons/io";
import { MdEmail as EmailIcon } from "react-icons/md";
import { IoIosSend as SendIcon } from "react-icons/io";
import { MdOutlineVerifiedUser as OTPIcon } from "react-icons/md";

import "../RegisterNext/RegisterNext.scss";

// giao diện register
function RegisterNext() {
  // hàm chuyển hướng trang sang trang tiếp
  const navigate = useNavigate();
  const navigateToContacts = () => {
    navigate("/home");
  };
  //render
  return (
    <div className="register-next-container">
      <form className="register-next-form" action="">
        <h1>Thông tin tài khoản</h1>
        {/* Tên tài khoản */}
        <div className="register-next-input-box">
          <input
            type="text"
            className="register-next-input"
            placeholder="Tên tài khoản"
          ></input>
          <UserIcon className="register-next-icon"></UserIcon>
        </div>
        {/*Email*/}
        <div className="register-next-input-box">
          <input
            type="text"
            className="register-next-input"
            placeholder="Nhập email"
          ></input>
          <EmailIcon className="register-next-icon"></EmailIcon>
        </div>
        {/*OTP*/}
        <div className="register-next-OTP-div">
          <div className={"register-next-input-box  register-OTP"}>
            <input
              type="text"
              className="register-next-input"
              placeholder="Nhập OTP"
            ></input>
            <OTPIcon className="register-next-icon"></OTPIcon>
          </div>
          <button className="register-next-btn-send-OTP">
            <span style={{fontSize:9}}>Gửi OTP</span>
            <SendIcon></SendIcon>
          </button>
        </div>
        {/* Mật khẩu */}
        <div className="register-next-input-box">
          <input
            type="password"
            className="register-next-input"
            placeholder="Nhập mật khẩu"
          ></input>
          <PasswordIcon className="register-next-icon"></PasswordIcon>
        </div>
        {/* Mật khẩu nhập lại*/}
        <div className="register-next-input-box">
          <input
            type="password"
            className="register-next-input"
            placeholder="Nhập lại mật khẩu"
          ></input>
          <PasswordIcon className="register-next-icon"></PasswordIcon>
        </div>
        {/* Chính sách */}
        <div className="register-next-policy">
          <input type="checkbox" className="register-next-checkbox"></input>
          <p>
            Tôi đã đồng ý với <a href="">Điều khoản</a>,{" "}
            <a href="">Chính sách quyền riêng tư</a> và{" "}
            <a href="">Chính sách Cookies</a>
          </p>
        </div>
        {/* Button đăng ký */}
        <div className="register-next-button-box">
          <button type="submit" onClick={navigateToContacts}>
            <span>Đăng ký</span>
          </button>
        </div>
        {/* Link đăng nhập */}
        <div className="register-next-login-link">
          <p>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterNext;
