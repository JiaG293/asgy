import React from "react";
import "../homeStyle/Detail.scss";
import { CiCircleInfo as InfoIcon } from "react-icons/ci";
import { useSelector } from "react-redux";
import { MdOutlineGroupAdd as AddMemberIcon } from "react-icons/md";
import { CiSettings as SettingsIcon } from "react-icons/ci";
import { IoMdNotificationsOutline as NotificationIcon } from "react-icons/io";
import { MdOutlinePushPin as PinIcon} from "react-icons/md";

function Detail() {
  const currentChannel = useSelector((state) => state.currentChannel);

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
                <img
                  src={currentChannel.iconGroup}
                  className="detail-avatar"
                />
                <div className="detail-group-name">{currentChannel.name}</div>
              </>
            )}
          </div>
          <div className="detail-group-icon">
            <NotificationIcon className="detail-icon"></NotificationIcon>
            <PinIcon className="detail-icon"></PinIcon>
            <AddMemberIcon className="detail-icon"></AddMemberIcon>
            <SettingsIcon className="detail-icon"></SettingsIcon>
          </div>
          <div className="detail-storage-images">Nơi lưu trữ hình ảnh</div>
          <div className="detail-storage-files">Nơi lưu trữ file</div>
        </>
      ) : (
        <>
          <div className="detail-header">
            <InfoIcon />
            <span> Thông tin chi tiết cuộc hội thoại</span>
          </div>
          <div className="detail-storage-images">Nơi lưu trữ hình ảnh</div>
          <div className="detail-storage-files">Nơi lưu trữ file</div>
        </>
      )}
    </div>
  );
}

export default Detail;
