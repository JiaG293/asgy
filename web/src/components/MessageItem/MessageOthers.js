import React from "react";
import { convertISOToFullDateTime } from "utils/formatDate";
import "./MessageOthers.scss";

function MessageOthers({ message }) {
  return (
    <div className="message-others-container">
      <div className="message-others-avatar-container">
        <img src={message?.avatar} alt="Avatar" />
      </div>
      <div className="message-others-info">
        <div className="message-others-name">{message?.fullName}</div>
        <div className="message-others-content">
          <p>{message?.messageContent}</p>
          <p className="message-others-time">
            {convertISOToFullDateTime(message?.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MessageOthers;
