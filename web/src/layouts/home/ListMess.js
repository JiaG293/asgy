import React, { useEffect, useState } from "react";
import "../homeStyle/ListMess.scss";
import { CiSearch as SearchIcon } from "react-icons/ci";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setChannel } from "../../redux/action";
import statusCode from "utils/statusCode";
import { IOaddUser } from "socket/socket";
import io from "socket.io-client";

function ListMess({ onSelectMessage }) {
  const dispatch = useDispatch();
  const channelList = useSelector((state) => state.channelList);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    getListChannels();
    const serverUrl = "http://localhost:5000";
    const socket = io(serverUrl, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });
  }, []);

  const getListChannels = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        console.error("refreshToken không tồn tại");
        return;
      }

      const decodedToken = jwtDecode(refreshToken);
      const clientID = decodedToken.clientId;
      const headers = {
        "x-client-id": clientID,
        authorization: refreshToken,
      };

      const response = await axios.get(
        "http://localhost:5000/api/v1/chats/channels",
        { headers }
      );

      if (response.status === statusCode.OK) {
        const { listChannels, _id: profileId } = response.data.metadata;
        setProfileId(profileId);
        dispatch(setChannel(listChannels));
      } else {
        console.error("Lỗi khi lấy thông tin người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const handleSelectConversation = (channel) => {
    const channelId = channel._id;
    onSelectMessage(channelId);
    IOaddUser(profileId, channelId);
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
      {channelList?.map((channel) => (
        <div
          key={channel._id}
          className="listmess-chat-item"
          onClick={() => handleSelectConversation(channel)}
        >
          <div className="listmess-avatar"></div>
          <div className="listmess-content">
            <div className="listmess-name">{channel.name}</div>
            <div className="listmess-message">hi</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListMess;
