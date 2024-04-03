import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import callAPI from "api/callAPI";
import statusCode from "utils/statusCode";
import validateInput from "utils/inputValidation";

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
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);

  const navigate = useNavigate();

  //đặt các trạng thái ràng buộc nhập dữ liệu
  const [warningMessages, setWarningMessages] = useState(initialWarningState);
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

  //hàm hiển thị mật khẩu
  const usePasswordVisibility = () => {
    setVisible(!visible);
  };

  //hàm hiển thị nhập lại mật khẩu
  const usePasswordVisibility2 = () => {
    setVisible2(!visible2);
  };

  // Hàm xóa các giá trị trong form
  const clearForm = () => {
    setFullname("");
    setPhonenumber("");
    setUsername("");
    setEmail("");
    setBirthdate("");
    setGender("");
    setPassword("");
    setRepassword("");
    setIsAgree(false);
  };

  // Hàm xử lý đăng ký
  const handleRegister = async () => {
    try {
      // Kiểm tra hợp lệ dữ liệu nhập vào và nhận các cảnh báo nếu có
      const { isValid, warningMessages } = validateInput({
        getUsername,
        getEmail,
        getFullname,
        getPhonenumber,
        getPassword,
        getRepassword,
        getBirthdate,
      });
      // Cập nhật state cảnh báo
      setWarningMessages(warningMessages);
      // Nếu dữ liệu không hợp lệ, dừng xử lý
      if (!isValid) {
        return;
      }
      // Tiến hành đăng ký người dùng
      await registerUser();
    } catch (error) {
      // Xử lý lỗi nếu có
      handleRegisterFailure(error);
    }
  };

  // Hàm thực hiện đăng ký người dùng
  const registerUser = async () => {
    // Tạo payload từ dữ liệu nhập vào
    const payload = {
      email: getEmail,
      username: getUsername,
      password: getPassword,
      fullName: getFullname,
      gender: getGender,
      birthday: getBirthdate,
      phoneNumber: getPhonenumber,
    };
    // Gọi API để đăng ký người dùng
    const response = await callAPI.register(payload);
    // Xử lý kết quả trả về từ API
    if (response.status === statusCode.CREATED) {
      handleRegisterSuccess();
    } else {
      handleRegisterFailure();
    }
  };

  //hàm đăng ký thành công
  const handleRegisterSuccess = () => {
    toast.success("Đăng ký thành công");
    clearForm();
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  //hàm đăng ký thất bại
  const handleRegisterFailure = (error) => {
    toast.error(error.response.data.error.message);
    console.error("Error registering user:", error);
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
    usePasswordVisibility,
    visible,
    setVisible,
    usePasswordVisibility2,
    visible2,
    setVisible2,
    clearForm,
  };
};

export default useRegister;
