import { Link, useNavigate } from "react-router-dom";
import { BiSolidUserRectangle as UserIcon } from "react-icons/bi";
import { IoMdLock as PasswordIcon } from "react-icons/io";
import { MdEmail as EmailIcon } from "react-icons/md";
import { FaCalendarAlt as DateIcon } from "react-icons/fa";
import { FaPhone as PhoneIcon } from "react-icons/fa";
import { IoIosSend as SendIcon } from "react-icons/io";
import { MdOutlineVerifiedUser as OTPIcon } from "react-icons/md";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Register.scss";
import { useState } from "react";

// giao diện register
function Register() {
  const navigate = useNavigate();
  const [getUsername, setUsername] = useState("");
  const [getEmail, setEmail] = useState("");
  const [getFullname, setFullname] = useState("");
  const [getPhonenumber, setPhonenumber] = useState("");
  const [getGender, setGender] = useState("Nam");
  const [getBirthdate, setBirthdate] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getRepassword, setRepassword] = useState("");
  const [isAgree, setIsAgree] = useState(false);

  const initialWarningState = {
    email: "",
    username: "",
    fullname: "",
    phone: "",
    gender: "",
    birthdate: "",
    password: "",
    repassword: "",
  };
  const [warningMessages, setWarningMessages] = useState(initialWarningState);

  // // hàm chuyển hướng trang sang trang tiếp
  // const navigateToCreateUserInfor = () => {
  //   // navigate("/create-user-infor");
  // };

  //hàm kiểm tra đồng ý điều khoản
  const handleAgreeChange = () => {
    setIsAgree(!isAgree);
    console.log("Checkbox checked:", !isAgree);
  };

  // Hàm kiểm tra hợp lệ
  const validateInput = () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const currentDate = new Date();
    const minBirthdate = new Date(
      currentDate.getFullYear() - 16,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    // Kiểm tra và cập nhật warningMessages
    setWarningMessages((prev) => ({
      ...prev,
      username:
        getUsername.length < 6 ? "Tên tài khoản phải có ít nhất 6 ký tự" : "",
      email: !emailRegex.test(getEmail)
        ? "Vui lòng nhập một địa chỉ email hợp lệ"
        : "",
      phone:
        getPhonenumber.length !== 10 || !getPhonenumber.startsWith("0")
          ? "Số điện thoại 10 kí tự số và bắt đầu bằng số 0"
          : "",
      password:
        getPassword.length < 8 ? "Mật khẩu phải có ít nhất 8 ký tự" : "",
      repassword: getPassword !== getRepassword ? "Mật khẩu không khớp" : "",
      birthdate:
        new Date(getBirthdate) > minBirthdate
          ? "Bạn phải đủ 16 tuổi để đăng ký"
          : "",
      fullname: getFullname.trim() === "" ? "Vui lòng nhập họ và tên" : "",
      birthdate: getBirthdate.trim() === "" ? "Vui lòng chọn ngày sinh" : "",
    }));

    // Kiểm tra tất cả các điều kiện và trả về true hoặc false
    const isValid =
      emailRegex.test(getEmail) &&
      getUsername.length >= 6 &&
      getPassword.length >= 8 &&
      getPassword === getRepassword &&
      getPhonenumber.length === 10 &&
      getPhonenumber.startsWith("0") &&
      new Date(getBirthdate) <= minBirthdate;

    // Nếu dữ liệu nhập vào đúng, cập nhật lại state cảnh báo về giá trị mặc định
    if (isValid) {
      setWarningMessages(initialWarningState);
    }

    return isValid;
  };

  // Hàm xử lý đăng ký
  const handleRegister = async () => {
    try {
      // Kiểm tra hợp lệ
      const isValid = validateInput();

      // Nếu thông tin không hợp lệ
      if (!isValid) {
        return;
      }

      // Tiếp tục đăng ký nếu thông tin hợp lệ
      await axios.post("http://localhost:5000/api/v1/users/signup", {
        email: getEmail,
        username: getUsername,
        password: getPassword,
        fullName: getFullname,
        gender: getGender,
        birthday: getBirthdate,
        phoneNumber: getPhonenumber,
      });
      toast.success("Đăng ký thành công");
    } catch (error) {
      toast.error("Tên người dùng, SĐT hoặc Email đã được dùng");
    }
  };

  //render
  return (
    <div className="register-container">
      <form className="register-form" action="">
        <h1 style={{ color: "#69bc5b", fontWeight: 500, textAlign: "center" }}>
          Đăng ký tài khoản
        </h1>
        <br></br>
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
          ></input>
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
            ></input>
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
            ></input>
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
            ></input>
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
                const formattedDate = new Date(
                  e.target.value
                ).toLocaleDateString("en-CA"); // Format: yyyy-mm-dd
                setBirthdate(formattedDate);
              }}
            />
            <DateIcon className="register-icon"></DateIcon>{" "}
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
          ></input>
          <PhoneIcon className="register-icon"></PhoneIcon>{" "}
          <p className="register-warning-text">{warningMessages.phone}</p>
        </div>
        {/*Email*/}
        <div className="register-input-box">
          <input
            type="text"
            className="register-input"
            placeholder="Email"
            value={getEmail}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <EmailIcon className="register-icon"></EmailIcon>
          <p className="register-warning-text">{warningMessages.email}</p>
        </div>

        {/* Mật khẩu */}
        <div className="register-input-box">
          <input
            type="password"
            className="register-input"
            placeholder="Mật khẩu"
            value={getPassword}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <PasswordIcon className="register-icon"></PasswordIcon>{" "}
          <p className="register-warning-text">{warningMessages.password}</p>
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
          <PasswordIcon className="register-icon"></PasswordIcon>{" "}
          <p className="register-warning-text">{warningMessages.repassword}</p>
        </div>
        {/* Chính sách */}
        <div className="register-policy">
          <input
            type="checkbox"
            className="register-checkbox"
            checked={isAgree}
            onChange={handleAgreeChange}
          ></input>
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
