import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./routes";

function App() {
  const navigate = useNavigate();

  // Kiểm tra nếu đường dẫn không hợp lệ chuyển về trang login
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (!publicRoutes.some(route => route.path === currentPath) &&
        !privateRoutes.some(route => route.path === currentPath)) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
        {publicRoutes.map((route, index) => {
          const Page = route.component;
          return <Route key={index} path={route.path} element={<Page />} />;
        })}

        {privateRoutes.map((route, index) => {
          const Page = route.component;
          return <Route key={index} path={route.path} element={<Page />} />;
        })}
      </Routes>
    </div>
  );
}

export default App;
