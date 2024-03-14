import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import "./Home.scss";
import Tools from "../../components/home/Tools";
import ListMess from "../../components/home/ListMess";
import Chat from "../../components/home/Chat";
import { useNavigate } from "react-router-dom";

var i = 0;

function Home() {
  const navigate = useNavigate();
  const [getUser, setUser] = useState({});

  //load dữ liệu lên page
  const fetchData = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        console.error("refreshToken không tồn tại");
        //điều hướng về trang login
        //navigate('/login')
        return;
      }
      // Giải mã refreshToken để xem thông tin chứa trong nó
      const decodedToken = jwt_decode(refreshToken);
      const clientID = decodedToken.clientId;
      console.log(clientID);
      console.log(decodedToken);
      const headers = {
        "X-Client-Id": clientID,
        Authorization: refreshToken,
      };
      // Gửi yêu cầu lấy thông tin người dùng sử dụng refreshToken
      const response = await axios.post(
        "http://localhost:5000/api/v1/profile/personal-information",
        { userId: decodedToken.userId },
        { headers }
      );
      // Lấy dữ liệu thông tin người dùng và cập nhật state
      if (response.status === 200) {
        const user = response.data.metadata;
        setUser(user);
      } else {
        console.error("Lỗi khi lấy thông tin người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      if (error.response) {
        console.error("Data request server:", error.response.data);
      }
      if (error.config && error.config.headers) {
        console.error("Headers request:", error.config.headers);
      }
    }
  };
  
  // đăng xuất
  const handleLogout = async () => {
    try {
      // setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/login",
        {
          userID: getUser.userId,
        }
      );
      if (response.status === 200) {
        Cookies.remove();
        navigate('/home');
      } else {
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };  


  useEffect(() => {
    fetchData();
  }, []);

  //render

  return (
    <div className="home-container">
      {console.log(getUser)}
      <Tools user={getUser}/>
      <ListMess/>
      <Chat/>
    </div>
  );
}

export default Home;
