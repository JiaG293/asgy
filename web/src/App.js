import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { publicRoutes, privateRoutes } from "./routes";
import "react-toastify/dist/ReactToastify.css";
import "components/CustomToastify.scss";
import Cookies from "js-cookie";

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const refreshToken = Cookies.get("refreshToken");
    if (refreshToken) {
      // Kiểm tra refreshToken nếu còn hiệu lực
      // Ví dụ: Gửi yêu cầu đến máy chủ để xác thực refreshToken
      // Nếu refreshToken hết hạn hoặc không hợp lệ, xử lý ở đây
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      // Thông báo cho người dùng biết rằng họ cần đăng nhập
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        {publicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={<route.component />} />
        ))}

        {privateRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={isAuthenticated ? <route.component /> : null}
          />
        ))}
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        limit={2}
        pauseOnHover={true}
      />
    </div>
  );
}

export default App;
