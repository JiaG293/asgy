import React, { useLayoutEffect } from "react";
import "../homeStyle/ListRequest.scss";
import { LuMailOpen as RequestListIcon } from "react-icons/lu";
import { useSelector } from "react-redux";
import { PiXCircleLight as DeclineIcon } from "react-icons/pi";
import { CiCircleCheck as AcceptIcon } from "react-icons/ci";
import { clientID, refreshToken } from "env/env";
import axios from "axios";
import statusCode from "utils/statusCode";
import { toast } from "react-toastify";
import { calculateTimeAgo } from "utils/formatDate";
import socket from "socket/socket";
import endpointAPI from "api/endpointAPI";

function ListRequest() {
  const friendsRequestList = useSelector((state) => state.friendsRequestList);
  console.log(friendsRequestList);

  const acceptFriendRequest = async (profileIdSend) => {
    try {
      const headers = {
        "x-client-id": clientID,
        authorization: refreshToken,
      };

      const response = await axios.post(
        endpointAPI.acceptFriendRequest,
        { profileIdSend: profileIdSend },
        {
          headers,
        }
      );
      if (response.status === statusCode.OK) {
        toast.success("Đã chấp nhận lời mời kết bạn");
        IOCreateSingleChat(profileIdSend,101,'Bạn bè');
        console.log("đã create single chat");
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
    }
  };

  const IOCreateSingleChat = async(receiverId, typeChannel, name)=>{
    socket.emit("createSingleChat", {
      receiverId: receiverId,
      typeChannel: typeChannel,
      name: name
    });
  }

  return (
    <div className="listrequests-container">
      <div className="listrequests-header">
        <RequestListIcon className="listrequests-icon" />
        <span className="listrequests-text">Lời mời kết bạn</span>
      </div>
      {friendsRequestList.map((element) => (
        <div className="listrequests-card" key={element.profileIdRequest}>
          <div className="listrequest-avatar-container">
            <img src={element?.avatar}></img>
          </div>
          <div className="listrequest-information">
            <p className="listrequest-fullname">{element.fullName}</p>
            <p className="listrequest-username">{element.username}</p>

          </div>
          <div className="listrequest-time">
            <p className="listrequest-time">{calculateTimeAgo(element.requestDated)}</p>
          </div>
          <div className="listrequest-group-icon">
            <DeclineIcon className="listrequest-icon decline" />
            <AcceptIcon
              className="listrequest-icon accept"
              onClick={() => {
                acceptFriendRequest(element.profileIdRequest);
                toast.success("Đã trở thành bạn bè")
                setTimeout(() => {
                  window.location.reload();
                }, 1500);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListRequest;
