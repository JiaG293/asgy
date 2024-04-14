import React, { useEffect, useState } from "react";
import "../homeStyle/Conversation.scss";
import Header from "./Header";
import { FiSend as SendIcon } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import socket from "socket/socket";
import { setCurrentMessages, setMessages } from "../../redux/action";
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';
import { convertISOToFullDateTime } from "utils/formatDate";

function Conversation() {
  const profile = useSelector((state) => state.profile);
  const profileID = profile?._id;
  const [messageContent, setMessageContent] = useState("");
  const currentChannel = useSelector((state) => state.currentChannel);
  const dispatch = useDispatch();
  const currentMessages = useSelector((state) => state.currentMessages);
  const messagesList = useSelector((state) => state.messagesList);


  // Render danh sách tin nhắn
  const messages = currentMessages.map((message) => (
    <div key={message?._id} className={message.senderId._id === profileID ? "conversation-item-you" : "conversation-item-others"}>
      <div className="avatar-and-message">
        {message.senderId._id !== profileID && (
          <div className="conversation-message-avatar-container">
            <img src={message.senderId.avatar} alt="Avatar" className="conversation-message-avatar" />
          </div>
        )}
        <div className="conversation-message-content">
          {message.senderId._id !== profileID && (
            <p className="conversation-message-sender-name">{message.senderId.fullName}</p>
          )}
          <div>{message?.messageContent}</div>
          <p className="conversation-message-send-time">{convertISOToFullDateTime(message.createdAt)}</p>
        </div>
      </div>
    </div>
  ));
  
  


  // Xử lý sự kiện nhấn phím Enter để gửi tin nhắn
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      IOSendMessage();
    }
  };

  // Lắng nghe thay đổi trong danh sách tin nhắn và thực hiện các hành động cần thiết
  useEffect(() => {
    socket.on("getMessage", (newMessage) => {
      console.log("Nhận về từ server", newMessage);
      dispatch(setCurrentMessages([...currentMessages, newMessage]));
      console.log(currentMessages);
      setTimeout(() => {
        scrollToBottom(); 

      }, 1);
    });

  }, [currentMessages]);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom(); 

    }, 1);
  }, [currentChannel]);

  // Gửi tin nhắn từ máy khách tới máy chủ
  const IOSendMessage = () => {
    // Kiểm tra xem đã có đủ thông tin để gửi tin nhắn chưa
    if (profile && currentChannel && messageContent) {
      socket.emit("sendMessage", {
        senderId: profile._id,
        receiverId: currentChannel._id,
        typeContent: "text",
        messageContent: messageContent,
      });
      setMessageContent("");
      scrollToBottom()
    }
  };

  // Cuộn xuống dòng mới nhất
  const scrollToBottom = () => {
    const messagesContainer = document.getElementById("conversation-messages-container");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  return (
    <div className="conversation-container">
      <Header />
      <PerfectScrollbar id="conversation-messages-container" className="conversation-messages">
        {messages}
      </PerfectScrollbar>
      <div className="conversation-input-container">
        <div className="conversation-input-with-button">
          <input
            className="conversation-input"
            type="text"
            placeholder="Nhập tin nhắn của bạn..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="conversation-button" onClick={IOSendMessage}>
            <span style={{ marginRight: 10 }}>Gửi</span>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Conversation;