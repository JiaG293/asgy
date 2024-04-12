import React, { useEffect, useState } from "react";
import "../homeStyle/ListMess.scss";
import { CiSearch as SearchIcon } from "react-icons/ci";
import Cookies from "js-cookie";
import axios from "axios";
import statusCode from "utils/statusCode";
import { useSelector, useDispatch } from "react-redux";
import socket from "socket/socket";

import {
  setChannels,
  setCurrentChannel,
  setCurrentMessages,
  setMessages,
} from "../../redux/action";

function ListMess({ setSelectedMessage }) {
  const profile = useSelector((state) => state.profile);
  const profileID = profile?._id;
  const channelList = useSelector((state) => state.channelList);
  const [channelLoaded, setChannelLoaded] = useState(false);
  const currentChannel = useSelector((state) => state.currentChannel);
  const messagesList = useSelector((state) => state.messagesList);
  const dispatch = useDispatch();
  const currentMessages = useSelector((state) => state.currentMessages); // Lấy danh sách tin nhắn hiện tại từ Redux store

  //fecth data api
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
      const response = await axios.get(
        "http://localhost:5000/api/v1/chats/channels",
        {
          headers,
        }
      );
      if (response.status === statusCode.OK) {
        const channelList = response.data.metadata;
        dispatch(setChannels(channelList));
        setChannelLoaded(true);
      } else {
        console.error("Lỗi khi lấy thông tin người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  //hàm add user
  const IOAddUser = async () => {
    const channelsID = await channelList.map((channel) => channel._id);
    if (profileID && channelLoaded && channelList) {
      await socket.emit("addUser", {
        profileId: profileID,
        channels: channelsID,
      });
      console.log("đã add user: ");
      console.log({ profileId: profileID, channels: channelsID });
    } else {
      console.log("chưa add được user");
    }
  };

  //hàm tải tin nhắn ban đầu
  const IOLoadMessages = async () => {
    await socket.emit("loadMessages", {
      senderId: profileID,
    });
    console.log("đã load messages:::");
    console.log(profileID);
  };

  //hàm chọn channel
  const selectChannel = async (channel) => {
    //hàm này để mất giao diện chờ
    await IOLoadMessages();
    await setSelectedMessage(true);
    await dispatch(setCurrentChannel(channel));
    await messagesList.forEach((item) => {
      if (item.channelId === channel._id) {
        dispatch(setCurrentMessages(item.messages));
        console.log("message da chon");
        console.log(item);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const reRender = async () => {
      if (profileID && channelLoaded) {
        await IOAddUser();
        await IOLoadMessages();
        //hàm nhận tất cả tin nhắn từ lúc đầu
        socket.on("getMessages", (data) => {
          dispatch(setMessages(data));
        });
      }
    };

    reRender();
  }, [profileID, channelLoaded]);

  return (
    <div className="listmess-chat-panel">
      <div className="listmess-search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="listmess-search-bar-input"
        />
        <SearchIcon className="listmess-search-icon" />
      </div>
      {channelList?.map((channel) => {
        const otherUser = channel?.members?.find(
          (member) => member.profileId?._id !== profileID
        )?.profileId;
        return (
          <div
            key={channel._id}
            className="listmess-chat-item"
            onClick={() => selectChannel(channel)}
          >
            <div className="listmess-avatar">
              <img src={otherUser?.avatar} alt="Avatar" />
            </div>
            <div className="listmess-content">
              <div className="listmess-name">{otherUser?.fullName}</div>
              <div className="listmess-message">hi</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ListMess;
