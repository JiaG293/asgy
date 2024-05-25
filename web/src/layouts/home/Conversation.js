import React, { useEffect, useState } from "react";
import "../homeStyle/Conversation.scss";

import Header from "./Header";
import { FiSend as SendIcon } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import socket from "socket/socket";
import { setCurrentMessages, setMessages } from "../../redux/action";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { MdInsertEmoticon as EmotionIcon } from "react-icons/md";
import { ImAttachment as FileIcon } from "react-icons/im";
import { CiImageOn as ImageIcon } from "react-icons/ci";
import { FaPhotoVideo as VideoIcon } from "react-icons/fa";

import MessageYou from "components/MessageItem/MessageYou";
import MessageOthers from "components/MessageItem/MessageOthers";
import axios from "axios";
import { clientID, refreshToken } from "env/env";

import EmojiPicker from "emoji-picker-react";
import endpointAPI from "api/endpointAPI";
import { toast } from "react-toastify";

function Conversation() {
  const profile = useSelector((state) => state.profile);
  const profileID = profile?._id;
  const [messageContent, setMessageContent] = useState("");
  const currentChannel = useSelector((state) => state.currentChannel);
  const dispatch = useDispatch();
  const currentMessages = useSelector((state) => state.currentMessages);
  const messagesList = useSelector((state) => state.messagesList);
  const [selectedFile, setSelectedFile] = useState(null);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  // Render danh sách tin nhắn
  const messages = currentMessages.map((message) =>
    message?.senderId === profileID ? (
      <MessageYou key={message?._id} message={message} />
    ) : (
      <MessageOthers key={message?._id} message={message} />
    )
  );

  //chọn emoji
  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const onEmojiClick = (emojiData, event) => {
    const emoji = emojiData.emoji;
    setMessageContent((prevContent) => prevContent + emoji);
    setChosenEmoji(emojiData);
  };

  // Xử lý sự kiện nhấn phím Enter để gửi tin nhắn
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      IOSendMessage();
    }
  };

  // Lắng nghe thay đổi trong danh sách tin nhắn và thực hiện các hành động cần thiết
  useEffect(() => {
    socket.on("getMessage", (newMessage) => {
      // console.log("Nhận về từ server", newMessage);
      dispatch(setCurrentMessages([...currentMessages, newMessage]));
      // console.log(currentMessages);
      scrollToBottom();
    });
  }, [currentMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChannel, currentMessages]);

  // Gửi tin nhắn text từ máy khách tới máy chủ
  const IOSendMessage = () => {
    // Kiểm tra xem đã có đủ thông tin để gửi tin nhắn chưa
    if (profile && currentChannel && messageContent) {
      socket.emit("sendMessage", {
        senderId: profile._id,
        receiverId: currentChannel._id,
        typeContent: "TEXT_MESSAGE",
        messageContent: messageContent,
      });
      setMessageContent("");
      scrollToBottom();
    }
  };

  //gửi tin nhắn file từ máy khách tới máy chủ
  const sendImageMessage = async (file) => {
    const headers = {
      "x-client-id": clientID,
      authorization: refreshToken,
    };

    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(
        `${endpointAPI.sendImageMessage}${currentChannel._id}`,
        formData,
        { headers }
      );
      const newMessage = response.data.metadata[0];
      dispatch(setCurrentMessages([...currentMessages, newMessage]));
      scrollToBottom();
      return response;
    } catch (error) {
      // console.log(error);
      toast.error("Có lỗi xảy ra")
    }
  };

  //gửi tin nhắn file từ máy khách tới máy chủ
  const sendFileMessage = async (file) => {
    const headers = {
      "x-client-id": clientID,
      authorization: refreshToken,
    };

    const formData = new FormData();
    formData.append("document", file);
    try {
      const response = await axios.post(
        `${endpointAPI.sendDocumentMessage}${currentChannel._id}`,
        formData,
        { headers }
      );
      const newMessage = response.data.metadata[0];
      dispatch(setCurrentMessages([...currentMessages, newMessage]));
      // scrollToBottom();
      return response;
    } catch (error) {
      // console.log(error);
      toast.error("Có lỗi xảy ra")

    }
  };

  //gửi tin nhắn video từ máy khách tới máy chủ
  const sendVideoMessage = async (file) => {
    const headers = {
      "x-client-id": clientID,
      authorization: refreshToken,
    };

    const formData = new FormData();
    formData.append("video", file);
    try {
      const response = await axios.post(
        `${endpointAPI.sendVideoMessage}${currentChannel._id}`,
        formData,
        { headers }
      );
      const newMessage = response.data.metadata[0];
      dispatch(setCurrentMessages([...currentMessages, newMessage]));
      // scrollToBottom();
      return response;
    } catch (error) {
      // console.log(error);
      toast.error("Có lỗi xảy ra")

    }
  };

  // Cuộn xuống dòng mới nhất
  const scrollToBottom = () => {
    const messagesContainer = document.getElementById(
      "conversation-messages-container"
    );
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  //saukhi chọn file xong
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    sendImageMessage(file);
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    sendFileMessage(file);
    setSelectedFile(null);
  };

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    sendVideoMessage(file);
    setSelectedFile(null);
  };

  return (
    <div className="conversation-container">
      <Header />
      <PerfectScrollbar
        id="conversation-messages-container"
        className="conversation-messages"
      >
        {messages}
      </PerfectScrollbar>

      {showPicker && (
        <EmojiPicker style={{ height: "1500px" }} onEmojiClick={onEmojiClick} />
      )}

      <div className="conversation-input-container">
        <div className="conversation-input-with-button">
          <div className="conversation-group-icon-emoji">
            <EmotionIcon className="conversation-icon" onClick={togglePicker} />
          </div>
          <input
            className="conversation-input"
            type="text"
            placeholder="Nhập tin nhắn của bạn..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="conversation-group-icon">
            <input
              type="file"
              id="image-input"
              style={{ display: "none" }}
              accept=".jpg, .jpeg, .png, .gif" // Chấp nhận các định dạng JPG, JPEG, PNG và GIF
              onChange={handleImageChange}
            />

            <input
              type="file"
              id="file-input"
              style={{ display: "none" }}
              accept=".pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .csv, .epub, .mobi, .txt, .bat"
              onChange={handleFileChange}
            />

            <input
              type="file"
              id="video-input"
              style={{ display: "none" }}
              accept=".mp4, .webm"
              onChange={handleVideoChange}
            />

            {/* Nhãn tùy chỉnh cho việc chọn tập tin, khi nhấp vào nó sẽ kích hoạt sự kiện chọn tập tin */}
            <FileIcon
              className="conversation-icon"
              onClick={() => {
                document.getElementById("file-input").click();
              }}
            />
            <ImageIcon
              className="conversation-icon"
              onClick={() => {
                document.getElementById("image-input").click();
              }}
            />
            <VideoIcon className="conversation-icon" 
            onClick={() => {
              document.getElementById("video-input").click();
            }}
            ></VideoIcon>
          </div>
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
