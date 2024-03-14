import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import "./Home.scss";
import ListMess from "../../components/home/ListMess";
import { useNavigate } from "react-router-dom";
import Detail from "../../components/home/Detail";
import Conversation from "../../components/home/Conversation";
import Menu from "../../components/home/Menu";
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
        navigate('/login')
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
 
  useEffect(() => {
    fetchData();
  }, []);

  //render

  return (
    <div className="home-container">
      {console.log(getUser)}
      <Menu user={getUser} />
      <ListMess />
      <Conversation />
      <Detail />
    </div>
  );
}

export default Home;
