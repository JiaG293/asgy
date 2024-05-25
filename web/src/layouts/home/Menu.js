// Menu.jsx

import React, { useState } from "react";
import "../homeStyle/Menu.scss";
import { AiOutlineMessage as MessageIcon } from "react-icons/ai";
import { RiContactsBookFill as ContactIcon } from "react-icons/ri";
import { IoSettingsOutline as SettingsIcon } from "react-icons/io5";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import UpdateModal from "./UpdateModal";
import LogoutModal from "./LogoutModal";
import InfoPopup from "./InfoPopup";
import SettingsPopup from "./SettingsPopup";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import socket from "socket/socket";
import statusCode from "utils/statusCode";
import { fetchLogout } from "api/callAPI";

function Menu({ onSelectMenuItem }) {
  const profile = useSelector((state) => state.profile);
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
    fetchLogout().then((data) => {
      if (data.status === statusCode.OK) {
        Cookies.remove("refreshToken");
        Cookies.remove("clientId");
        Cookies.remove("profileId");
        toast.success("Đăng xuất thành công");
        socket.disconnect();
        navigate("/login");
      } else {
        Cookies.remove("refreshToken");
        Cookies.remove("clientId");
        Cookies.remove("profileId");
        socket.disconnect();
        navigate("/login");
      }
    }).catch((err)=>{
      Cookies.remove("refreshToken");
      Cookies.remove("clientId");
      Cookies.remove("profileId");
      socket.disconnect();
      navigate("/login");
    });
  };

  const handleMenuItemClick = (menuItem) => {
    onSelectMenuItem(menuItem);
  };

  return (
    <div className="menu-container">
      <div className="menu-avatar-container">
        <img
          src={profile?.avatar ?? "placeholder_image_url"}
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
        <UpdateModal setShowUpdateModal={setShowUpdateModal} />
      )}
    </div>
  );
}

export default Menu;
