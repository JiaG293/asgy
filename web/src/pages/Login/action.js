// các hàm và sự kiện được viết trong file này
import { useState } from "react";

//hàm hiển thị mật khẩu
export const usePasswordVisibility = () => {
  const [visible, setVisible] = useState(false);
  const togglePasswordVisibility = () => setVisible(!visible);
  return { visible, togglePasswordVisibility };
};
