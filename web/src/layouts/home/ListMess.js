import React, { useEffect, useState } from "react";
import "../homeStyle/ListMess.scss";
import { CiSearch as SearchIcon } from "react-icons/ci";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setChannels, setMessages } from "../../redux/action";
import statusCode from "utils/statusCode";
import { IOaddUser, IOgetListMessages, IOloadMessages } from "socket/socket";
import endpointAPI from "api/endpointAPI";

function ListMess() {
  const dispatch = useDispatch();
  const channelList = useSelector((state) => state.channelList);
  const [profileId, setProfileId] = useState(null);
  const refreshToken = Cookies.get("refreshToken");
  const decodedToken = jwtDecode(refreshToken);
  const clientID = decodedToken.clientId;
  let messagesStorage = [];

  const getListChannels = async () => {
    try {
      const headers = {
        "x-client-id": clientID,
        authorization: refreshToken,
      };

      const response = await axios.get(
        endpointAPI.getListChannels,
        { headers }
      );

      if (response.status === statusCode.OK) {
        const listChannels = response.data.metadata.listChannels;
        const id = response.data.metadata._id;
        setProfileId(id);
        dispatch(setChannels(listChannels));
      } else {
        console.error("Lỗi khi lấy thông tin người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const handleSelectConversation = async (channel) => {
    const channelId = channel._id;
    IOloadMessages(profileId);
    IOgetListMessages(channelId, messagesStorage);
    dispatch(setMessages(messagesStorage));
  };

  useEffect(() => {
    getListChannels();
    if (profileId != undefined && profileId != null) {
      const channelIds = channelList.map((channel) => channel._id);
      IOaddUser(profileId, channelIds);
    }
  }, [profileId]);

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
