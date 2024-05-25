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

        {message.typeContent === "REVOKE_MESSAGE" ? (
          <div className="message-others-item-revoke">
            <p>{message?.messageContent}</p>
            <p className="message-others-time">
              {convertISOToFullDateTime(message?.createdAt)}
            </p>
          </div>
        ) : message.typeContent === "IMAGE_FILE" ? (
          <div className="message-others-item">
            <img src={message?.messageContent} alt="Image" />
            <p className="message-others-time">
              {convertISOToFullDateTime(message?.createdAt)}
            </p>
          </div>
        ) : message.typeContent === "VIDEO_FILE" ? (
          <div className="message-others-item">
            <video src={message?.messageContent} controls />
            <p className="message-others-time">
              {convertISOToFullDateTime(message?.createdAt)}
            </p>
          </div>
        ) : message.typeContent === "DOCUMENT_FILE" ? (
          <div className="message-others-item">
            <a href={message?.messageContent} target="_blank" rel="noopener noreferrer">
              {message?.messageContent}
            </a>
            <p className="message-others-time">
              {convertISOToFullDateTime(message?.createdAt)}
            </p>
          </div>
        ) : (
          <div className="message-others-item">
            <p>{message?.messageContent}</p>
            <p className="message-others-time">
              {convertISOToFullDateTime(message?.createdAt)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageOthers;
