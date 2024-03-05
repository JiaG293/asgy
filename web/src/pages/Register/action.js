import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useRegister = () => {
  const [getUsername, setUsername] = useState("");
  const [getEmail, setEmail] = useState("");
  const [getFullname, setFullname] = useState("");
  const [getPhonenumber, setPhonenumber] = useState("");
  const [getGender, setGender] = useState("Nam");
  const [getBirthdate, setBirthdate] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getRepassword, setRepassword] = useState("");
  const [isAgree, setIsAgree] = useState(false);
  const navigate = useNavigate();

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
      fullname: getFullname.trim() === "" ? "Vui lòng nhập họ và tên" : "",
      birthdate: getBirthdate.trim() === "" ? "Vui lòng chọn ngày sinh" : "",
      birthdate:
        new Date(getBirthdate) > minBirthdate
          ? "Bạn phải đủ 16 tuổi để đăng ký"
          : "",
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
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      toast.error("Đăng ký thất bại");
    }
  };

  // Hàm kiểm tra đồng ý điều khoản
  const handleAgreeChange = () => {
    setIsAgree(!isAgree);
    console.log("Checkbox checked:", !isAgree);
  };

  return {
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
  };
};

export default useRegister;
