import React, { useState, useEffect, useLayoutEffect } from "react";
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
import {
  setFriends,
  setFriendsRequest,
  setProfile,
} from "../../redux/action";
import SplashScreen from "layouts/home/SplashScreen";
import { fetchProfileInfo } from "api/callAPI";

function Home() {
  const dispatch = useDispatch();
  const [selectedMenuItem, setSelectedMenuItem] = useState("messages");
  const [currentComponent, setCurrentComponent] = useState(null);
  const [isSelectMessage, setSelectMessage] = useState(false);

  // gọi fetch API bên api/callAPI
  fetchProfileInfo().then((data)=>{
        dispatch(setProfile(data.profile));
        dispatch(setFriends(data.friends));
        dispatch(setFriendsRequest(data.friendsRequest));
  }).catch((err)=>console.log(err));

  useLayoutEffect(() => {
    fetchProfileInfo();
  }, []);

  //chuyển các component tương ứng khi chọn menu
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
      // case "groupList":
      //   setCurrentComponent(
      //     <>
      //       <Contacts onSelectMenuItem={setSelectedMenuItem} />
      //       <ListGroup />
      //     </>
      //   );
      //   break;
      case "requestList":
        setCurrentComponent(
          <>
            <Contacts onSelectMenuItem={setSelectedMenuItem} />
            <ListRequest />
          </>
        );
        break;
      case "findProfile":
        setCurrentComponent(
          <>
            <Contacts onSelectMenuItem={setSelectedMenuItem} />
            <Conversation />
            <Detail />
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
