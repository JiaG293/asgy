import React, { useState, useEffect } from "react";
import "../homeStyle/Detail.scss";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlinePushPin } from "react-icons/md";
import { MdGroupAdd } from "react-icons/md";
import { CiCircleInfo as InfoIcon } from "react-icons/ci";
import { useSelector } from "react-redux";

function Detail() {
  const [othertUser, setOtherUser] = useState(null);
  const profile = useSelector((state) => state.profile);
  const profileID = profile?._id;
  const currentChannel = useSelector((state) => state.currentChannel);

  useEffect(() => {
    if (currentChannel && currentChannel.members) {
      const otherUser = currentChannel.members.find(
        (member) => member.profileId?._id !== profileID
      )?.profileId;
      setOtherUser(otherUser);
    }
  }, [currentChannel, profileID]);

  return (
    <div className="detail-container">
      <div className="detail-header">
        <InfoIcon />
        <span> Thông tin chi tiết cuộc hội thoại</span>
      </div>

      <div className="detail-info">
        {othertUser && (
          <>
            <img src={othertUser.avatar} className="detail-avatar" />
            <div className="detail-group-name">{othertUser.fullName}</div>
            <div className="detail-action-buttons">
              <IoIosNotifications className="detail-item" />
              <MdOutlinePushPin className="detail-item" />
              <MdGroupAdd className="detail-item" />
            </div>
          </>
        )}
      </div>
      <div className="detail-storage-images">Nơi lưu trữ hình ảnh</div>
      <div className="detail-storage-files">Nơi lưu trữ file</div>
    </div>
  );
}

export default Detail;
