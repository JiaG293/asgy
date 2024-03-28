import React from "react";
import "../homeStyle/Detail.scss";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlinePushPin } from "react-icons/md";
import { MdGroupAdd } from "react-icons/md";
import { CiCircleInfo as InfoIcon } from "react-icons/ci";

function Detail() {
  return (
    <div className="detail-container">
      <div className="detail-header">
        <InfoIcon />
        <span> Thông tin chi tiết cuộc hội thoại</span>
      </div>

      <div className="detail-info">
        <img
          src="https://media.tenor.com/kXWb4lofzQcAAAAe/hiroi-kikuri-hiroi.png"
          className="detail-avatar"
        />
        <div className="detail-group-name">Tên người dùng</div>
        <div className="detail-action-buttons">
          <IoIosNotifications className="detail-item"></IoIosNotifications>
          <MdOutlinePushPin className="detail-item"></MdOutlinePushPin>
          <MdGroupAdd className="detail-item"></MdGroupAdd>
        </div>
      </div>
      <div className="detail-storage-images">Nơi lưu trữ hình ảnh</div>
      <div className="detail-storage-files">Nơi lưu trữ file</div>
    </div>
  );
}

export default Detail;
