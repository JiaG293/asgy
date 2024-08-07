import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiSolidUserRectangle as UserIcon } from "react-icons/bi";
import { IoMdLock as PasswordIcon } from "react-icons/io";
import { MdEmail as EmailIcon } from "react-icons/md";
import { FaCalendarAlt as DateIcon } from "react-icons/fa";
import { FaPhone as PhoneIcon } from "react-icons/fa";
import { IoEyeSharp as ShowPasswordIcon } from "react-icons/io5";
import { IoEyeOffSharp as HidePasswordIcon } from "react-icons/io5";
import "react-toastify/dist/ReactToastify.css";
import "./Register.scss";
import useRegister from "auth/useRegister";
import { toast } from "react-toastify";
import { clientID, refreshToken } from "env/env";
import axios from "axios";

function Register() {
  const {
    formData,
    handleChange,
    handleBlur,
    handleCheckboxChange,
    handleSubmit,
    handlePasswordVisibility,
    handlePasswordVisibility2,
    visible,
    visible2,
    warningMessages,
    sendOTP,
    verifyOTP,
  } = useRegister();

  const {
    username,
    fullName,
    gender,
    birthdate,
    phoneNumber,
    email,
    password,
    repassword,
    isAgree,
    otp,
  } = formData;

  // const [otp, setOtp] = useState("");
  // const [otpSent, setOtpSent] = useState(false);

  // const sendOTP = async (email) => {
  //   const headers = {
  //     "x-client-id": clientID,
  //     authorization: refreshToken,
  //   };

  //   if (!email) {
  //     toast.error("Vui lòng nhập email");
  //     return;
  //   }

  //   const body = {
  //     email: email,
  //   };

  //   try {
  //     await axios.post(`http://localhost:5000/api/v1/users/create-otp`, body, {
  //       headers,
  //     });
  //     toast.success("Đã gửi email đến " + email);
  //   } catch (error) {
  //     toast.error("Email đã được sử dụng");
  //     console.log(error);
  //   }
  // };

  // const verifyOTP = async (email, otp) => {
  //   const headers = {
  //     "x-client-id": clientID,
  //     authorization: refreshToken,
  //   };

  //   const body = {
  //     email: email,
  //     otp: otp,
  //   };

  //   console.log("send to");
  //   console.log(email);
  //   console.log(otp);

  //   try {
  //     const res = await axios.post(
  //       `http://localhost:5000/api/v1/users/verify-otp`,
  //       body,
  //       { headers }
  //     );
  //     console.log(res);
  //     // toast.success("Mã OTP chính xác");
  //   } catch (error) {
  //     console.log(otp);
  //     console.log(email);
  //     console.log(error);
  //   }
  // };

  // const handleVerifyOtp = (e) => {
  //   const value = e.target.value;
  //   console.log(value);
  //   if (value.length === 6) {
  //     if (!email) {
  //       return;
  //     }
  //     verifyOTP(email, value);
  //   }
  // };

  return (
    <div className="register-container">
      <form className="register-form" action="">
        <h1 style={{ color: "#232323", fontWeight: 500, textAlign: "center" }}>
          Đăng ký tài khoản
        </h1>
        <br />
        {/* Tên tài khoản */}
        <div className="register-input-box">
          <input
            type="text"
            className="register-input"
            placeholder="Tên tài khoản"
            name="username"
            value={username}
            onChange={handleChange}
            onBlur={handleBlur}
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
            name="fullName"
            value={fullName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <UserIcon className="register-icon"></UserIcon>{" "}
          <p className="register-warning-text">{warningMessages.fullName}</p>
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
              value="Nam"
              checked={gender === "Nam"}
              onChange={handleChange}
            />
            <p>Nam</p>
          </div>
          <div className="register-radio">
            <input
              type="radio"
              name="gender"
              value="Nữ"
              checked={gender === "Nữ"}
              onChange={handleChange}
            />
            <p>Nữ</p>
          </div>
          <div className="register-radio">
            <input
              type="radio"
              name="gender"
              value="Bí mật"
              checked={gender === "Bí mật"}
              onChange={handleChange}
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
              name="birthdate"
              value={birthdate}
              onChange={handleChange}
              onBlur={handleBlur}
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
            name="phoneNumber"
            value={phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <PhoneIcon className="register-icon"></PhoneIcon>{" "}
          <p className="register-warning-text">{warningMessages.phoneNumber}</p>
        </div>
        {/* Email*/}
        <div className="register-input-box">
          <input
            type="text"
            className="register-input"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
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
            name="password"
            value={password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <PasswordIcon className="register-icon"></PasswordIcon>
          {visible ? (
            <ShowPasswordIcon
              className="login-icon-right"
              onClick={handlePasswordVisibility}
            ></ShowPasswordIcon>
          ) : (
            <HidePasswordIcon
              className="login-icon-right"
              onClick={handlePasswordVisibility}
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
            name="repassword"
            value={repassword}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <PasswordIcon className="register-icon"></PasswordIcon>{" "}
          {visible2 ? (
            <ShowPasswordIcon
              className="login-icon-right"
              onClick={handlePasswordVisibility2}
            ></ShowPasswordIcon>
          ) : (
            <HidePasswordIcon
              className="login-icon-right"
              onClick={handlePasswordVisibility2}
            ></HidePasswordIcon>
          )}
          <p className="register-warning-text">{warningMessages.repassword}</p>
        </div>
        {/* OTP*/}
        <div className="register-group-otp">
          <button
            type="button"
            className="register-otp-button"
            onClick={() => {
              sendOTP(email);
            }}
          >
            Gửi OTP
          </button>
          <input
            type="text"
            className="register-otp-input"
            placeholder="OTP"
            name="otp"
            onChange={handleChange}
            value={otp}
          />
        </div>

        {/* Chính sách */}
        <div className="register-policy">
          <input
            type="checkbox"
            className="register-checkbox"
            checked={isAgree}
            onChange={handleCheckboxChange}
          />
          <span>
            Tôi đã đồng ý với <Link to="">Điều khoản</Link>,{" "}
            <Link to="">Chính sách quyền riêng tư</Link> và{" "}
            <Link to="">Chính sách Cookies</Link>
          </span>
        </div>
        {/* Button đăng ký */}
        <button
          type="button"
          onClick={handleSubmit}
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
    </div>
  );
}

export default Register;
