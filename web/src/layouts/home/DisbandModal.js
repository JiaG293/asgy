import React from "react";
import "../homeStyle/LogoutModal.scss";
import socket from "socket/socket";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function DisbandModal({ isOpen, onClose }) {
  const currentChannel = useSelector((state) => state.currentChannel);

  const handleDisband = async () => {
    console.log(currentChannel._id);
    socket.emit("disbandGroup", { channelId: currentChannel._id });
    console.log(socket.emit("disbandGroup", currentChannel));
    onClose(); // Close the modal after disbanding
    toast.success(`Đã giải tán ${currentChannel.name}`);
    window.location.reload();
  };

  return (
    <div className="logout-modal-container">
      <div className="logout-modal-content">
        <h2>Xác nhận giải tán nhóm</h2>
        <p>Giải tán {currentChannel.name}?</p>
        <div className="logout-modal-buttons">
          <button onClick={onClose}>Hủy</button>
          <button
            onClick={handleDisband}
            style={{ backgroundColor: "#FF6961" }}
          >
            Giải tán
          </button>
        </div>
      </div>
    </div>
  );
}

export default DisbandModal;
