import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
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
      setIsAuthenticated(true);
      navigate("/home")
    } else {
      setIsAuthenticated(false);
      const currentPath = window.location.pathname;
      if (!publicRoutes.some((route) => route.path === currentPath)) {
        navigate("/login");
        setIsAuthenticated(false);
      }
    }
  }, [navigate]);

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
            element={
              isAuthenticated ? <route.component /> : <Navigate to="/login" />
            }
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
