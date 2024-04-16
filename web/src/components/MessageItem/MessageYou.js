import React, { useEffect, useState } from "react";
import { convertISOToFullDateTime } from "utils/formatDate";
import MessageDropdown from "../DropdownMenu/MessageDropdown";
import "./MessageYou.scss";
import socket from "socket/socket";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentMessages, setMessages } from "../../redux/action";

function MessageYou({ message }) {
  const currentMessages = useSelector((state) => state.currentMessages);
  const dispatch = useDispatch();
  const [form, setForm] = useState(false)

  const revokeMessage = () => {
    socket.emit("revokeMessage", { messageId: message._id });
    console.log("đã thu hồi");
  };

  const deleteMessage = () => {
    socket.emit("deleteMessage", { messageId: message._id });
    console.log("đã xóa");
  };

  useEffect(() => {
    const reRender = async () => {
      socket.on("getMessages", (data) => {
        dispatch(setMessages(data));
      });
      socket.on("messageRevoked", (data) => {
        console.log("tin nhắn đã được thu hồi là");
        console.log(
          currentMessages.filter((message) => message._id === data._id)
        );

        const indexMessage = currentMessages.findIndex((message) => {
          return message._id === data._id;
        });

        //fix sau
        if (indexMessage !== -1) {
          console.log(currentMessages.length);
          const newMsg = currentMessages[indexMessage];
          newMsg.messageContent = data.messageContent;
          newMsg.typeContent = data.typeContent;
          dispatch(setCurrentMessages([...currentMessages]));
          console.log(currentMessages);
          setForm(true);
        }
      });

      /////////////////////

      socket.on("messageDeleted", (data) => {
        const indexMessage = currentMessages.findIndex((message) => {
          return message._id === data._id;
        });

        //fix sau
        if (indexMessage !== -1) {
          console.log(currentMessages.length);
          currentMessages.splice(indexMessage, 1)
          dispatch(setCurrentMessages([...currentMessages]));
          console.log(currentMessages);
        }
      });
    };

    reRender();
  }, [currentMessages]);
  console.log(currentMessages.length);
  return (
    <div className="message-you-container">
      <div className="message-you-item">
        <div className="message-you-top">
          <div className="message-you-content">
            <p>{message?.messageContent}</p>
          </div>
          <div className="message-you-more">
            <MessageDropdown
              messageId={message?._id}
              revokeHandler={revokeMessage}
              deleteHandler={deleteMessage}
            />
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
