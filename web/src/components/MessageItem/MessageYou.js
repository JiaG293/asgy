import React from "react";
import { convertISOToFullDateTime } from "utils/formatDate";
import MessageDropdown from "../DropdownMenu/MessageDropdown";
import "./MessageYou.scss";
import socket from "socket/socket";

function MessageYou({ message }) {


  const revokeMessage = ()=>{
    socket.emit("revokeMessage", message._id);
    console.log("đã thu hồi");
  }

  return (
    <div className="message-you-container">
      <div className="message-you-item">
        <div className="message-you-top">
          <div className="message-you-content">
            <p>{message?.messageContent}</p>
          </div>
          <div className="message-you-more">
            <MessageDropdown messageId={message?._id} revokeHandler={revokeMessage}/>
          </div>
        </div>
        <p className="message-you-time">
          {convertISOToFullDateTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

export default MessageYou;
