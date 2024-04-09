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
  setMessages,
} from "../../redux/action";
import Conversation from "./Conversation";

function ListMess() {
  const profile = useSelector((state) => state.profile);
  const channelList = useSelector((state) => state.channelList);
  const [channelLoaded, setChannelLoaded] = useState(false);
  const currentChannel = useSelector((state) => state.currentChannel);
  const messagesList = useSelector((state) => state.messagesList);
  const messageStorage = useRef([]);

  const dispatch = useDispatch();

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
      // console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const IOAddUser = () => {
    if (profile?._id && channelLoaded) {
      socket.emit("addUser", { profileId: profile._id, channels: channelList });
      // console.log("profile._id đã sẵn sàng",
      //  {
      //   profileId: profile._id,
      //   channels: channelList,
      // });
    } else {
      // console.log("profile._id chưa sẵn sàng");
    }
  };

  const IOLoadMessages = () => {
    socket.emit("loadMessages", {
      senderId: profile?._id,
    });
  };

  IOAddUser();
  IOLoadMessages();

  const IOTest = () => {
    socket.emit("test");
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (currentChannel?._id) {
      const handleGetMessages = ({ _id, messages }) => {
        const filteredMessages = messages.filter(
          (message) => message.receiverId === currentChannel._id
        );
        console.log(`Received messages from channel ${_id}:`);
        const messageArray = filteredMessages.map((message) => ({
          messageContent: message.messageContent,
          receiverId: message.receiverId,
          senderId: message.senderId._id,
          senderName: message.senderId.fullName,
          typeContent: message.typeContent,
          updatedAt: message.updatedAt,
          __v: message.__v,
          _id: message._id,
        }));
        dispatch(setMessages(messageArray));
      };
      socket.on("getMessages", handleGetMessages);
      return () => {
        socket.off("getMessages", handleGetMessages);
      };
    }
  }, [currentChannel]);

  

  const selectChannel = (channel) => {
    socket.off("getMessages");
    dispatch(setCurrentChannel(channel));
    // console.log(`SELECT CHANNEL: `);
    // console.log(channel);
  };

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
              <img src={otherUser?.avatar}></img>
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
