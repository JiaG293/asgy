import React, { useState } from "react";
import "../homeStyle/Menu.scss";
import { AiOutlineMessage as MessageIcon } from "react-icons/ai";
import { RiContactsBookFill as ContactIcon } from "react-icons/ri";
import { IoSettingsOutline as SettingsIcon } from "react-icons/io5";
import { CiLogout as LogoutIcon } from "react-icons/ci";
import { PiPencilSimpleLineLight as UpdateIcon } from "react-icons/pi";
import axios from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Menu({ user, onSelectMenuItem }) {
  const [showFormInfo, setShowFormInfo] = useState(false);
  const [showFormSettings, setShowFormSettings] = useState(false);

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
    setShowFormInfo(!showFormInfo);
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

  const handleMenuItemClick = (menuItem) => {
    onSelectMenuItem(menuItem);
  };

  return (
    <div className="menu-container">
      <div className="menu-avatar-container">
        <img
          src={user.avatar}
          className="menu-avatar"
          onClick={handleAvatarClick}
          alt="Avatar"
        />
      </div>

      <div className="menu-group-items">
        <div className="menu-group-top">
          <MessageIcon
            className="menu-item"
            onClick={() => handleMenuItemClick("messages")}
          ></MessageIcon>
          <ContactIcon
            className="menu-item"
            onClick={() => handleMenuItemClick("contacts")}
          ></ContactIcon>
        </div>
        <div className="menu-group-bot">
          <SettingsIcon
            className="menu-item"
            onClick={() => setShowFormSettings(!showFormSettings)}
          />
        </div>

        {/* <LogoutIcon
          className="menu-item"
          onClick={() => setShowLogoutModal(true)}
        ></LogoutIcon> */}
      </div>

      {/* show form thông tin */}
      {showFormInfo && (
        <div className="info-popup-overlay">
          <div className="info-popup-content">
            <h1 style={{ fontSize: 20, color: "#3cd9b6" }}>{user.fullName}</h1>
            <div className="info-form-container">
              <div className="info-popup-information">
                <p className="info-popup-information-key">Giới tính</p>
                <p className="info-popup-information-value">{user.gender}</p>
              </div>
              <div className="info-popup-information">
                <p className="info-popup-information-key">Ngày sinh</p>
                <p className="info-popup-information-value">
                  {formatDate(user.birthday)}
                </p>
              </div>
              <div className="info-popup-information">
                <p className="info-popup-information-key">Số điện thoại</p>
                <p className="info-popup-information-value">
                  {user.phoneNumber}
                </p>
              </div>
            </div>
            <button className="info-popup-update-button">
              <span>Cập nhật</span>
              <UpdateIcon></UpdateIcon>
            </button>
          </div>
        </div>
      )}

      {showFormSettings && (
        <div className="settings-popup-overlay">
          <div className="settings-popup-content">
            <ul className="settings-popup-list">
              <li>
                <button className="settings-popup-button">
                  Cập nhật thông tin
                </button>
              </li>
              <li>
                <button className="settings-popup-button">
                  Cài đặt tài khoản
                </button>
              </li>
              <li>
                <button className="settings-popup-button">Giới thiệu</button>
              </li>
              <li>
                <button className="settings-popup-button" onClick={()=>{setShowLogoutModal(true)}}>Đăng xuất</button>
              </li>
            </ul>
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

export default Menu;
