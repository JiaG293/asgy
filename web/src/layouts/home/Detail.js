import React, { useState } from "react";
import "../homeStyle/Detail.scss";
import { CiCircleInfo as InfoIcon } from "react-icons/ci";
import { useSelector } from "react-redux";
import { MdOutlineGroupAdd as AddMemberIcon } from "react-icons/md";
import { CiSettings as SettingsIcon } from "react-icons/ci";
import { IoMdNotificationsOutline as NotificationIcon } from "react-icons/io";
import { MdOutlinePushPin as PinIcon } from "react-icons/md";
import PerfectScrollbar from "react-perfect-scrollbar";
import socket from "socket/socket";
// import PreviewModal from "react-media-previewer";
import { PiXCircleLight as DeleteIcon } from "react-icons/pi";
import { profileID } from "env/env";
import AddMemberModal from "./AddMemberModal";

function Detail() {
  const currentChannel = useSelector((state) => state.currentChannel);
  console.log(currentChannel);
  const currentMessages = useSelector((state) => state.currentMessages);
  // const [visible, setVisible] = useState(false);
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);

  const handleAddMember = () => {
    setAddMemberModalOpen(true);
  };

  const handleDeleteMember = (id) => {
    console.log("đã click");
    const channelId = currentChannel._id;
    const members = [id];

    socket.emit("deleteMembers", { channelId, members });

    socket.on("deleteMembers", (response) => {
      console.log(response.message);
      console.log(currentChannel);
    });

    window.location.reload();
  };

  return (
    <div className="detail-container">
      {currentChannel ? (
        <>
          <div className="detail-header">
            <InfoIcon />
            <span> Thông tin chi tiết cuộc hội thoại</span>
          </div>

          <div className="detail-info">
            {currentChannel.typeChannel === 101 ? (
              <>
                <img src={currentChannel.icon} className="detail-avatar" />
                <div className="detail-group-name">{currentChannel.name}</div>
              </>
            ) : (
              <>
                <img src={currentChannel.iconGroup} className="detail-avatar" />
                <div className="detail-group-name">{currentChannel.name}</div>
              </>
            )}
          </div>
          <div className="detail-group-icon">
            <NotificationIcon className="detail-icon"></NotificationIcon>
            <PinIcon className="detail-icon"></PinIcon>
            {currentChannel.typeChannel === 202 ? (
              <AddMemberIcon
                className="detail-icon"
                onClick={handleAddMember}
              ></AddMemberIcon>
            ) : null}
            <SettingsIcon className="detail-icon"></SettingsIcon>
          </div>
          {currentChannel.typeChannel === 202 ? (
            <>
              <div className="detail-storage-files">
                Thành viên nhóm ({currentChannel.members.length})
              </div>
              <PerfectScrollbar className="detail-storage-member">
                {currentChannel.members.map((member) => (
                  <div key={member.profileId} className="detail-member-item">
                    <img
                      src={member.avatar}
                      alt={`${member.fullName}'s avatar`}
                    />
                    <p
                      className={
                        currentChannel.owner === member.profileId
                          ? "owner-name"
                          : ""
                      }
                    >
                      {member.fullName}
                    </p>
                    {currentChannel.owner === profileID &&
                      currentChannel.owner !== member.profileId && (
                        <DeleteIcon
                          color="red"
                          className="detail-member-button"
                          onClick={() => handleDeleteMember(member.profileId)}
                        />
                      )}
                  </div>
                ))}
              </PerfectScrollbar>
            </>
          ) : null}
          <>
            <div className="detail-storage-files">Nơi lưu trữ hình ảnh & Video</div>
            <PerfectScrollbar className="detail-storage-image">
              {currentMessages.map((message) =>
                message.typeContent === "IMAGE_FILE" ||
                message.typeContent === "VIDEO_FILE" ? (
                  <div key={message._id} className="detail-image-item">
                    {message.typeContent === "IMAGE_FILE" ? (
                      <img src={message.messageContent} alt="Content" />
                    ) : (
                      <video src={message.messageContent} controls />
                    )}
                  </div>
                ) : null
              )}
            </PerfectScrollbar>
          </>
        </>
      ) : (
        <>
          <div className="detail-header">
            <InfoIcon />
            <span> Thông tin chi tiết cuộc hội thoại</span>
          </div>
          <div className="detail-storage-images">Nơi lưu trữ hình ảnh</div>
        </>
      )}
      {isAddMemberModalOpen && (
        <AddMemberModal
          isOpen={isAddMemberModalOpen}
          onClose={() => setAddMemberModalOpen(false)}
          currentChannel={currentChannel}
        />
      )}
    </div>
  );
}

export default Detail;
