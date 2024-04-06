import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { publicRoutes, privateRoutes } from "./routes";
import "react-toastify/dist/ReactToastify.css";
import "components/CustomToastify.scss";
import Cookies from "js-cookie";

function App() {
  const navigate = useNavigate();
  //tạm thời chứ không bảo mật
  const isAuthenticated = Cookies.get('refreshToken');
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    else{
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

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
