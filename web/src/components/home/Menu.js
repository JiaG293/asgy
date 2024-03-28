// Menu.jsx

import React, { useState } from "react";
import "../homeStyle/Menu.scss";
import { AiOutlineMessage as MessageIcon } from "react-icons/ai";
import { RiContactsBookFill as ContactIcon } from "react-icons/ri";
import { IoSettingsOutline as SettingsIcon } from "react-icons/io5";
import axios from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import UpdateModal from "./UpdateModal";
import LogoutModal from "./LogoutModal";
import InfoPopup from "./InfoPopup";
import SettingsPopup from "./SettingsPopup";

function Menu({ user, onSelectMenuItem}) {
  const [showFormInfo, setShowFormInfo] = useState(false);
  const [showFormSettings, setShowFormSettings] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
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
          />
          <ContactIcon
            className="menu-item"
            onClick={() => handleMenuItemClick("contacts")}
          />
        </div>
        <div className="menu-group-bot">
          <SettingsIcon
            className="menu-item"
            onClick={() => setShowFormSettings(!showFormSettings)}
          />
        </div>
      </div>

      {/* Info form */}
      {showFormInfo && (
        <InfoPopup
          user={user}
          formatDate={formatDate}
          setShowUpdateModal={setShowUpdateModal}
        />
      )}

      {/* Form setting */}
      {showFormSettings && (
        <SettingsPopup setShowLogoutModal={setShowLogoutModal} />
      )}

      {/* form logout */}
      {showLogoutModal && (
        <LogoutModal
          setShowLogoutModal={setShowLogoutModal}
          handleLogout={handleLogout}
        />
      )}

      {/* form update */}
      {showUpdateModal && (
        <UpdateModal user={user} setShowUpdateModal={setShowUpdateModal} />
      )}
    </div>
  );
}

export default Menu;
