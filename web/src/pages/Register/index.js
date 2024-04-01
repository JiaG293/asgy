import { Link, useNavigate } from "react-router-dom";
import { BiSolidUserRectangle as UserIcon } from "react-icons/bi";
import { IoMdLock as PasswordIcon } from "react-icons/io";
import { MdEmail as EmailIcon } from "react-icons/md";
import { FaCalendarAlt as DateIcon } from "react-icons/fa";
import { FaPhone as PhoneIcon } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { IoEyeSharp as ShowPasswordIcon } from "react-icons/io5";
import { IoEyeOffSharp as HidePasswordIcon } from "react-icons/io5";
import "react-toastify/dist/ReactToastify.css";
import "./Register.scss";
import useRegister from "./action";

// giao diện register
function Register() {
  const {
    getUsername,
    setUsername,
    getEmail,
    setEmail,
    getFullname,
    setFullname,
    getPhonenumber,
    setPhonenumber,
    getGender,
    setGender,
    getBirthdate,
    setBirthdate,
    getPassword,
    setPassword,
    getRepassword,
    setRepassword,
    isAgree,
    setIsAgree,
    warningMessages,
    handleAgreeChange,
    handleRegister,
    usePasswordVisibility,
    visible,
    visible2,
    usePasswordVisibility2,
  } = useRegister();

  //render
  return (
    <div className="register-container">
      <form className="register-form" action="">
        <h1 style={{ color: "#3cd9b6", fontWeight: 500, textAlign: "center" }}>
          Đăng ký tài khoản
        </h1>
        <br />
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
          />
          <UserIcon className="register-icon"></UserIcon>
          <p className="register-warning-text">{warningMessages.username}</p>
        </div>
        {/* Tên người dùng*/}
        <div className="register-input-box">
          <input
            type="text"
            className="register-input"
            placeholder="Họ và tên"
            value={getFullname}
            onChange={(e) => {
              setFullname(e.target.value);
            }}
          />
          <UserIcon className="register-icon"></UserIcon>{" "}
          <p className="register-warning-text">{warningMessages.fullname}</p>
        </div>
        {/* Giới tính */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <div className="register-radio">
            <input
              type="radio"
              name="gender"
              value={"Nam"}
              checked={getGender === "Nam"}
              onChange={(e) => {
                setGender(e.target.value);
              }}
            />
            <p>Nam</p>
          </div>
          <div className="register-radio">
            <input
              type="radio"
              name="gender"
              value={"Nữ"}
              checked={getGender === "Nữ"}
              onChange={(e) => {
                setGender(e.target.value);
              }}
            />
            <p>Nữ</p>
          </div>
          <div className="register-radio">
            <input
              type="radio"
              name="gender"
              value={"Bí mật"}
              checked={getGender === "Bí mật"}
              onChange={(e) => {
                setGender(e.target.value);
              }}
            />
            <p>Bí mật</p>
          </div>
        </div>
        {/* Ngày sinh */}
        <div style={{ marginTop: "10px" }}>
          <span className="register-label">Ngày sinh</span>
          <div className="register-input-box">
            <input
              type="date"
              className="register-input"
              placeholder="Ngày sinh"
              value={getBirthdate}
              onChange={(e) => {
                setBirthdate(e.target.value);
              }}
            />
            <DateIcon className="register-icon"></DateIcon>
            <p className="register-warning-text">{warningMessages.birthdate}</p>
          </div>
        </div>
        {/* Số điện thoại */}
        <div className="register-input-box">
          <input
            type="text"
            className="register-input"
            placeholder="Số điện thoại"
            value={getPhonenumber}
            onChange={(e) => {
              setPhonenumber(e.target.value);
            }}
          />
          <PhoneIcon className="register-icon"></PhoneIcon>{" "}
          <p className="register-warning-text">{warningMessages.phone}</p>
        </div>
        {/* Email*/}
        <div className="register-input-box">
          <input
            type="text"
            className="register-input"
            placeholder="Email"
            value={getEmail}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <EmailIcon className="register-icon"></EmailIcon>
          <p className="register-warning-text">{warningMessages.email}</p>
        </div>
        {/* Mật khẩu */}
        <div className="register-input-box">
          <input
            type={visible ? "text" : "password"}
            className="register-input"
            placeholder="Mật khẩu"
            value={getPassword}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <PasswordIcon className="register-icon"></PasswordIcon>
          {visible ? (
            <ShowPasswordIcon
              className="login-icon-right"
              onClick={usePasswordVisibility}
            ></ShowPasswordIcon>
          ) : (
            <HidePasswordIcon
              className="login-icon-right"
              onClick={usePasswordVisibility}
            ></HidePasswordIcon>
          )}
          <p className="register-warning-text">{warningMessages.password}</p>
        </div>
        {/* Mật khẩu nhập lại */}
        <div className="register-input-box">
          <input
            type={visible2 ? "text" : "password"}
            className="register-input"
            placeholder="Nhập lại mật khẩu"
            value={getRepassword}
            onChange={(e) => {
              setRepassword(e.target.value);
            }}
          />
          <PasswordIcon className="register-icon"></PasswordIcon>{" "}
          {visible2 ? (
            <ShowPasswordIcon
              className="login-icon-right"
              onClick={usePasswordVisibility2}
            ></ShowPasswordIcon>
          ) : (
            <HidePasswordIcon
              className="login-icon-right"
              onClick={usePasswordVisibility2}
            ></HidePasswordIcon>
          )}
          <p className="register-warning-text">{warningMessages.repassword}</p>
        </div>
        {/* Chính sách */}
        <div className="register-policy">
          <input
            type="checkbox"
            className="register-checkbox"
            checked={isAgree}
            onChange={handleAgreeChange}
          />
          <span>
            Tôi đã đồng ý với <a href="">Điều khoản</a>,{" "}
            <a href="">Chính sách quyền riêng tư</a> và{" "}
            <a href="">Chính sách Cookies</a>
          </span>
        </div>
        {/* Button đăng ký */}
        <button
          type="button"
          onClick={handleRegister}
          disabled={!isAgree}
          className={`register-btn ${
            isAgree ? "register-btn-enabled" : "register-btn-disabled"
          }`}
        >
          <span>Đăng ký</span>
        </button>
        {/* Link đăng nhập */}
        <div className="register-login-link">
          <span>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </span>
        </div>
      </form>
      <ToastContainer /> {/* Thêm ToastContainer vào cuối component */}
    </div>
  );
}

export default Register;
