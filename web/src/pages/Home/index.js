import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import "./Home.scss";
import ListMess from "../../layouts/home/ListMess";
import Conversation from "../../layouts/home/Conversation";
import Detail from "../../layouts/home/Detail";
import Menu from "../../layouts/home/Menu";
import Contacts from "../../layouts/home/Contacts";
import ListFriend from "../../layouts/home/ListFriend";
import ListGroup from "../../layouts/home/ListGroup";
import ListRequest from "../../layouts/home/ListRequest";
import { useDispatch } from "react-redux";
import { setProfile } from "../../redux/action";

function Home() {
  const dispatch = useDispatch();
  const [selectedMenuItem, setSelectedMenuItem] = useState("messages");
  const [currentComponent, setCurrentComponent] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState("");

  const fetchData = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        console.error("refreshToken không tồn tại");
        return;
      }

      const decodedToken = jwt_decode(refreshToken);
      const clientID = decodedToken.clientId;
      const headers = {
        "x-client-id": clientID,
        authorization: refreshToken,
      };

      const response = await axios.get("http://localhost:5000/api/v1/profile", {
        headers,
      });

      if (response.status === 200) {
        const profile = response.data.metadata;
        dispatch(setProfile(profile));
      } else {
        console.error("Lỗi khi lấy thông tin người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      <Menu onSelectMenuItem={setSelectedMenuItem} />
      {currentComponent}
    </div>
  );
}

export default Home;
