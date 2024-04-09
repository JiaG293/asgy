import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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

function ListMess() {
  const profile = useSelector((state) => state.profile);
  const channelList = useSelector((state) => state.channelList);
  const [channelLoaded, setChannelLoaded] = useState(false);
  const currentChannel = useSelector((state) => state.currentChannel);
  const messagesList = useSelector((state) => state.messagesList);
  const dispatch = useDispatch();
  const [profileUpdated, setProfileUpdated] = useState(false); // Biến cờ để theo dõi trạng thái cập nhật hồ sơ

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

  const IOAddUser = () => {
    if (profile?._id && channelLoaded) {
      socket.emit("addUser", { profileId: profile._id, channels: channelList });
    }
  };

  const selectChannel = (channel) => {
    dispatch(setCurrentChannel(channel));
    console.log(channel?._id);
    console.log(messagesList[0]._id._id);

    messagesList.forEach((item) => {
      if (item._id._id === channel._id) {
        dispatch(setCurrentMessages(item.messages));
        console.log("Đã add current messages vào redux");
        console.log(item.messages);
      }
    });
  };

  const IOloadMessages = (senderId) => {
    socket.emit("loadMessages", {
      senderId: senderId,
    });
  };

  if (profile?._id && !profileUpdated) {
    IOloadMessages(profile._id);
    // console.log("Profile đã được cập nhật", profile._id);
    setProfileUpdated(true);
  } else {
  }

  useEffect(() => {
    fetchData();
    IOAddUser();
    socket.on("getMessages", (data) => {
      console.log("data là::::: ");
      console.log(data);
      dispatch(setMessages(data));
    });
    return () => {
      socket.off("getMessages");
    };
  }, []);

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
          (member) => member.profileId?._id !== profile?._id
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
