import { FaArrowAltCircleRight as NextButton } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

  // hàm chuyển hướng trang sang trang tiếp
function CreateUserInfor() {
  const navigate = useNavigate();
  const navigateToNext = () => {
    navigate("/register");
  };

//render
  return (
    <div className="create-user-inforainer">
      <form className="create-user-infor" action="">
        <h1>Hồ sơ người dùng</h1>
        {/* Tên người dùng*/}
        <div className="create-user-infort-box">
          <label>Họ tên</label>
          <input
            type="text"
            className="create-user-infort"
            placeholder="Nhập họ và tên"
          ></input>
        </div>
        {/* Giới tính */}
        <div className="create-user-infort-box">
          <label>Giới tính</label>
          <div className="create-user-inforo">
            <input
              type="radio"
              className="create-user-inforo"
              name="gender"
            ></input>
            <p>Nam</p>
          </div>
          <div className="create-user-inforo">
            <input
              type="radio"
              className="create-user-inforo"
              name="gender"
            ></input>
            <p>Nữ</p>
          </div>
          <div className="create-user-inforo">
            <input
              type="radio"
              className="create-user-inforo"
              name="gender"
            ></input>
            <p>Bí mật</p>
          </div>
        </div>
        {/* Ngày sinh */}
        <div className="create-user-infort-box">
          <label>Ngày sinh</label>
          <input type="date" className="create-user-infort"></input>
        </div>
        {/* Số điện thoại */}
        <div className="create-user-infort-box">
          <label>SĐT</label>
          <input
            type="text"
            className="create-user-infort"
            placeholder="Nhập số điện thoại"
          ></input>
        </div>
        {/* Địa chỉ */}
        <div className="create-user-infort-box">
          <label>Địa chỉ</label>
          <input
            type="text"
            className="create-user-infort"
            placeholder="Nhập địa chỉ"
          ></input>
        </div>
        {/* Button đăng ký */}
        <div className="create-user-inforon-box">
          <button type="submit" onClick={navigateToNext}>
            <span>Bước tiếp theo</span>
            <NextButton></NextButton>
          </button>
        </div>
        {/* Link đăng nhập */}
        <div className="create-user-inforn-link">
          <p>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default CreateUserInfor;
