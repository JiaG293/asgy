import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import callAPI from "api/callAPI";
import statusCode from "utils/statusCode";
import useValidate from "utils/useValidate";

const useRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    gender: "Nam",
    birthdate: "",
    password: "",
    repassword: "",
    isAgree: false,
  });

  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [warningMessages, setWarningMessages] = useState({
    username: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    password: "",
    repassword: "",
    birthdate: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errors = {
      username:
        name === "username"
          ? useValidate.validateUsername(value)
          : warningMessages.username,
      email:
        name === "email"
          ? useValidate.validateEmail(value)
          : warningMessages.email,
      fullName:
        name === "fullName"
          ? useValidate.validateFullname(value)
          : warningMessages.fullName,
      phoneNumber:
        name === "phoneNumber"
          ? useValidate.validatePhone(value)
          : warningMessages.phoneNumber,
      password:
        name === "password"
          ? useValidate.validatePassword(value)
          : warningMessages.password,
      repassword:
        name === "repassword"
          ? useValidate.validateRepassword(formData.password, value)
          : warningMessages.repassword,
      birthdate:
        name === "birthdate"
          ? useValidate.validateBirthdate(value)
          : warningMessages.birthdate,
    };
    setWarningMessages(errors);
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, isAgree: e.target.checked });
  };

  const handlePasswordVisibility = () => {
    setVisible(!visible);
  };

  const handlePasswordVisibility2 = () => {
    setVisible2(!visible2);
  };

  const clearForm = () => {
    setFormData({
      username: "",
      email: "",
      fullName: "",
      phoneNumber: "",
      gender: "Nam",
      birthdate: "",
      password: "",
      repassword: "",
      isAgree: false,
    });
    setWarningMessages({
      username: "",
      email: "",
      fullName: "",
      phoneNumber: "",
      password: "",
      repassword: "",
      birthdate: "",
    });
  };

  const errors = {
    username: useValidate.validateUsername(formData.username),
    email: useValidate.validateEmail(formData.email),
    fullName: useValidate.validateFullname(formData.fullName),
    phoneNumber: useValidate.validatePhone(formData.phoneNumber),
    password: useValidate.validatePassword(formData.password),
    repassword: useValidate.validateRepassword(
      formData.password,
      formData.repassword
    ),
    birthdate: useValidate.validateBirthdate(formData.birthdate),
  };

  const handleSubmit = async () => {
    try {
      setWarningMessages(errors);
      if (Object.values(errors).some((error) => error !== "")) {
        toast.error("Vui lòng kiểm tra lại thông tin");
        return;
      }
      const response = await callAPI.register(formData);
      if (response.status === statusCode.CREATED) {
        handleSuccess();
      } else {
        handleFailure();
      }
    } catch (error) {
      handleFailure(error);
    }
  };

  const handleSuccess = () => {
    toast.success("Đăng ký thành công");
    clearForm();
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleFailure = (error) => {
    const errorMessage = error?.response?.data?.error?.message.startsWith(
      "E11000 duplicate key error collection: asgy.Profiles index: phoneNumber_1"
    )
      ? "Số điện thoại đã được sử dụng"
      : error?.response?.data?.error?.message.includes(
          "Username already exists"
        )
      ? "Tên tài khoản đã được sử dụng"
      : error?.response?.data?.error?.message === "Email already exists"
      ? "Email đã được sử dụng"
      : "Có lỗi xảy ra";
    toast.error(errorMessage);
    console.error("Error registering user:", error);
  };

  return {
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
  };
};

export default useRegister;
