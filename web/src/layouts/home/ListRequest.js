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
        `http://localhost:5000/api/v1/profile/accept-request`,
        { profileIdSend: profileIdSend },
        {
          headers,
        }
      );
      if (response.status === statusCode.OK) {
        toast.success("Đã chấp nhận lời mời kết bạn");
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
    }
  };

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
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListRequest;
