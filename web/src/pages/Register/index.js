import { FaArrowAltCircleRight as NextButton } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../Register/Register.scss";

// giao diện register
function Register() {
  // hàm chuyển hướng trang sang trang tiếp
  const navigate = useNavigate();
  const navigateToNext = () => {
    navigate("/register-next");
  };
//render
  return (
    <div className="register-container">
      <form className="register-form" action="">
        <h1>Hồ sơ người dùng</h1>
        {/* Tên người dùng*/}
        <div className="register-input-box">
          <label>Họ tên</label>
          <input
            type="text"
            className="register-input"
            placeholder="Nhập họ và tên"
          ></input>
        </div>
        {/* Giới tính */}
        <div className="register-input-box">
          <label>Giới tính</label>
          <div className="register-radio">
            <input
              type="radio"
              className="register-radio"
              name="gender"
            ></input>
            <p>Nam</p>
          </div>
          <div className="register-radio">
            <input
              type="radio"
              className="register-radio"
              name="gender"
            ></input>
            <p>Nữ</p>
          </div>
          <div className="register-radio">
            <input
              type="radio"
              className="register-radio"
              name="gender"
            ></input>
            <p>Bí mật</p>
          </div>
        </div>
        {/* Ngày sinh */}
        <div className="register-input-box">
          <label>Ngày sinh</label>
          <input type="date" className="register-input"></input>
        </div>
        {/* Số điện thoại */}
        <div className="register-input-box">
          <label>SĐT</label>
          <input
            type="text"
            className="register-input"
            placeholder="Nhập số điện thoại"
          ></input>
        </div>
        {/* Địa chỉ */}
        <div className="register-input-box">
          <label>Địa chỉ</label>
          <input
            type="text"
            className="register-input"
            placeholder="Nhập địa chỉ"
          ></input>
        </div>
        {/* Button đăng ký */}
        <div className="register-button-box">
          <button type="submit" onClick={navigateToNext}>
            <span>Bước tiếp theo</span>
            <NextButton></NextButton>
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
