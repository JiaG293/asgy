import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import "./Home.scss";
import ListMess from "../../layouts/home/ListMess";
import Conversation from "../../layouts/home/Conversation";
import Detail from "../../layouts/home/Detail";
import Menu from "../../layouts/home/Menu";
import Contacts from "../../layouts/home/Contacts";
import ListFriend from "../../layouts/home/ListFriend";
import ListGroup from "../../layouts/home/ListGroup";
import ListRequest from "../../layouts/home/ListRequest";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, setProfile } from "../../redux/action";
import SplashScreen from "layouts/home/SplashScreen";
import io from 'socket.io-client';
import { serverURL } from "api/endpointAPI";
import { clientID, refreshToken } from "env/env";

function Home() {
  const dispatch = useDispatch();
  const [selectedMenuItem, setSelectedMenuItem] = useState("messages");
  const [currentComponent, setCurrentComponent] = useState(null);
  const [isSelectMessage, setSelectMessage] = useState(false);
  const currentMessages = useSelector((state) => state.currentMessages); // Lấy danh sách tin nhắn hiện tại từ Redux store

  const fetchData = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      const clientID = Cookies.get("clientId");
      
      if (!refreshToken) {
        console.error("refreshToken không tồn tại");
        return;
      }
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


  useLayoutEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    switch (selectedMenuItem) {
      case "messages":
        setCurrentComponent(
          <>
            <ListMess setSelectedMessage={setSelectMessage} />
            {isSelectMessage ? (
              <>
                <Conversation />
                <Detail />
              </>
            ) : (
              <SplashScreen />
            )}
          </>
        );
        break;
      case "contacts":
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
  }, [selectedMenuItem, isSelectMessage]);

  return (
    <div className="home-container">
      <Menu onSelectMenuItem={setSelectedMenuItem} />
      {currentComponent}
    </div>
  );
}

export default Home;

