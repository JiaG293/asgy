// Home.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import "./Home.scss";
import ListMess from "../../components/home/ListMess";
import Conversation from "../../components/home/Conversation";
import Detail from "../../components/home/Detail";
import Menu from "../../components/home/Menu";
import Contacts from "../../components/home/Contacts";
import ListFriend from "../../components/home/ListFriend";
import ListGroup from "../../components/home/ListGroup";

import { useNavigate } from "react-router-dom";
import ListRequest from "../../components/home/ListRequest";

function Home() {
  const navigate = useNavigate();
  const [getUser, setUser] = useState({});
  const [selectedMenuItem, setSelectedMenuItem] = useState("messages"); // chứa trạng thái menu đang chọn
  const [currentComponent, setCurrentComponent] = useState(null); // chứa component render ra màn hình
  const [selectedMessage, setSelectedMessage] = useState(""); // tin nhắn được chọn

  // Load dữ liệu người dùng
  const fetchData = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        console.error("refreshToken không tồn tại");
        navigate("/login");
        return;
      }

      // Giải mã refreshToken để xem thông tin chứa trong nó
      const decodedToken = jwt_decode(refreshToken);
      const clientID = decodedToken.clientId;
      const headers = {
        "x-client-id": clientID,
        "authorization": refreshToken,
      };
      // Gửi yêu cầu lấy thông tin người dùng sử dụng refreshToken
      const response = await axios.get(
        "http://localhost:5000/api/v1/profile",
        { headers }
      );
      console.log(response.data.metadata);

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

  // Xử lý khi chọn mục trong menu
  useEffect(() => {
    switch (selectedMenuItem) {
      case "messages":
        setCurrentComponent(
          <>
            <ListMess onSelectMessage={setSelectedMessage} />
            <Conversation message={selectedMessage} />
            <Detail />
          </>
        );
        break;
      case "contacts":
        setCurrentComponent(
          <>
            <Contacts onSelectMenuItem={setSelectedMenuItem} />
            <ListFriend />
          </>
        );
        break;
      case "friendList":
        setCurrentComponent(
          <>
            <Contacts onSelectMenuItem={setSelectedMenuItem} />
            <ListFriend />
          </>
        );
        break;
      case "groupList":
        setCurrentComponent(
          <>
            <Contacts onSelectMenuItem={setSelectedMenuItem} />
            <ListGroup />
          </>
        );
        break;
      case "requestList":
        setCurrentComponent(
          <>
            <Contacts onSelectMenuItem={setSelectedMenuItem} />
            <ListRequest />
          </>
        );
        break;
      default:
        break;
    }
  }, [selectedMenuItem, selectedMessage]);

  return (
    <div className="home-container">

      <Menu user={getUser} onSelectMenuItem={setSelectedMenuItem} />
      {currentComponent}
    </div>
  );
}

export default Home;
