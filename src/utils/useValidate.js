const regexPatterns = {
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    fullName: /^[^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]*[A-Z][^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]*([a-zA-Z\s]*[A-Z][^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]*)*$/,
    username: /^[a-zA-Z0-9_.]+$/,
    phone: /^\d{10}$/,
  };
  
  const currentDate = new Date();
  const minBirthdate = new Date(
    currentDate.getFullYear() - 16,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  
  const validateEmail = (email) => {
    return !regexPatterns.email.test(email)
      ? "Vui lòng nhập một địa chỉ email hợp lệ"
      : "";
  };
  
  const validateUsername = (username) => {
    return username.length < 6
      ? "Tên tài khoản phải có ít nhất 6 ký tự"
      : !regexPatterns.username.test(username)
      ? "Tên tài khoản không được chứa ký tự đặc biệt (ngoại trừ _ và .)"
      : "";
  };
  
  const validatePhone = (phoneNumber) => {
    return !regexPatterns.phone.test(phoneNumber)
      ? "Số điện thoại phải gồm 10 chữ số"
      : phoneNumber[0] !== "0"
      ? "Số điện thoại phải bắt đầu bằng số 0"
      : "";
  };
  
  const validatePassword = (password) => {
    return password.length < 8 ? "Mật khẩu phải có ít nhất 8 ký tự" : "";
  };
  
  const validateRepassword = (password, repassword) => {
    return password !== repassword ? "Mật khẩu không khớp" : "";
  };
  
  const validateFullname = (fullname) => {
    return fullname.trim() === ""
      ? "Vui lòng nhập họ và tên"
      : !regexPatterns.fullName.test(fullname)
      ? "Họ tên không hợp lệ"
      : "";
  };
  
  const validateBirthdate = (birthdate) => {
    return birthdate.trim() === ""
      ? "Vui lòng chọn ngày sinh"
      : new Date(birthdate) > minBirthdate
      ? "Bạn phải đủ 16 tuổi để đăng ký"
      : "";
  };
  
  const useValidate = {
    validateEmail,
    validateUsername,
    validatePhone,
    validatePassword,
    validateRepassword,
    validateFullname,
    validateBirthdate,
  };
  
  export default useValidate;