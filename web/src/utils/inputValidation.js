const validateInput = ({
  getUsername,
  getEmail,
  getFullname,
  getPhonenumber,
  getPassword,
  getRepassword,
  getBirthdate,
}) => {
  // Biểu thức chính quy cho địa chỉ email
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  // Biểu thức chính quy cho tên đầy đủ
  const fullNameRegex = /^[^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]*[A-Z][^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]*([a-zA-Z\s]*[A-Z][^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]*)*$/;
  // Biểu thức chính quy cho tên tài khoản
  const usernameRegex = /^[a-zA-Z0-9_.]+$/;

  // Ngày hiện tại và ngày sinh tối thiểu
  const currentDate = new Date();
  const minBirthdate = new Date(
    currentDate.getFullYear() - 16,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  // Khởi tạo các thông báo cảnh báo
  const warningMessages = {
    email: !emailRegex.test(getEmail)
      ? "Vui lòng nhập một địa chỉ email hợp lệ"
      : "",
    username:
      getUsername.length < 6
        ? "Tên tài khoản phải có ít nhất 6 ký tự"
        : !usernameRegex.test(getUsername)
        ? "Tên tài khoản không được chứa ký tự đặc biệt (ngoại trừ _ và .)"
        : "",
    phone:
      getPhonenumber.length !== 10
        ? "Số điện thoại 10 kí tự số"
        : !getPhonenumber.startsWith("0")
        ? "Số điện thoại bắt đầu bằng số 0"
        : "",
    password:
      getPassword.length < 8 ? "Mật khẩu phải có ít nhất 8 ký tự" : "",
    repassword: getPassword !== getRepassword ? "Mật khẩu không khớp" : "",
    fullname:
      getFullname.trim() === ""
        ? "Vui lòng nhập họ và tên"
        : !fullNameRegex.test(getFullname)
        ? "Họ tên không hợp lệ"
        : "",
    birthdate:
      getBirthdate.trim() === ""
        ? "Vui lòng chọn ngày sinh"
        : new Date(getBirthdate) > minBirthdate
        ? "Bạn phải đủ 16 tuổi để đăng ký"
        : "",
  };

  // Kiểm tra tính hợp lệ tổng thể
  const isValid =
    emailRegex.test(getEmail) &&
    getUsername.length >= 6 &&
    getPassword.length >= 8 &&
    getPassword === getRepassword &&
    getPhonenumber.length === 10 &&
    getPhonenumber.startsWith("0") &&
    new Date(getBirthdate) <= minBirthdate;

  return { isValid, warningMessages };
};

export default validateInput;
