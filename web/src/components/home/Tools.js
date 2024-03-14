import React, { useState } from "react";
import "../homeStyle/Tools.scss";
import { AiOutlineMessage as MessageIcon } from "react-icons/ai";
import { RiContactsBookFill as ContactIcon } from "react-icons/ri";
import { IoSettingsOutline as SettingsIcon } from "react-icons/io5";
import { GrGroup as GroupIcon } from "react-icons/gr";
import { CiLogout as LogoutIcon } from "react-icons/ci";
import { PiPencilSimpleLineLight as UpdateIcon } from "react-icons/pi";
import axios from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Tools({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const handleAvatarClick = () => {
    setShowForm(!showForm);
  };

  const handleLogout = async () => {
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
      console.error("Refresh token is missing.");
      return;
    }

    const decodedToken = jwtDecode(refreshToken);
    const clientID = decodedToken.clientId;

    const headers = {
      "X-Client-Id": clientID,
      Authorization: refreshToken,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/logout",
        null,
        { headers }
      );

      if (response.status === 200) {
        Cookies.remove("refreshToken");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="tools">
      <img
        src={user.avatar}
        className="avatar"
        onClick={handleAvatarClick}
        alt="Avatar"
      />

      <div className="groupItems">
        <MessageIcon className="item"></MessageIcon>
        <ContactIcon className="item"></ContactIcon>
        <GroupIcon className="item"></GroupIcon>
        <SettingsIcon className="item"></SettingsIcon>
        <LogoutIcon
          className="item"
          onClick={() => setShowLogoutModal(true)}
        ></LogoutIcon>
      </div>

      {showForm && (
        <div className="popup-overlay">
          <div className="popup-content detailedInfoForm">
            <h1 style={{ fontSize: 20, color: '#3cd9b6'  }}>{user.fullName}</h1>
            <div className="form-container">
              <div className="popup-information">
                <p className="popup-information-key">Giới tính</p>
                <p className="popup-information-value">{user.gender}</p>
              </div>
              <div className="popup-information">
                <p className="popup-information-key">Ngày sinh</p>
                <p className="popup-information-value">
                  {formatDate(user.birthday)}
                </p>
              </div>
              <div className="popup-information">
                <p className="popup-information-key">Số điện thoại</p>
                <p className="popup-information-value">{user.phoneNumber}</p>
              </div>
            </div>
            <button className="popup-update-button">
              <span>Cập nhật</span>
              <UpdateIcon></UpdateIcon>
            </button>
          </div>
        </div>
      )}

      {/* form đăng xuất */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Xác nhận đăng xuất</h2>
            <p>Bạn có chắc muốn đăng xuất?</p>
            <div className="modal-buttons">
              <button onClick={() => setShowLogoutModal(false)}>Hủy</button>
              <button
                onClick={() => {
                  handleLogout();
                  setShowLogoutModal(true);
                }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default Tools;
