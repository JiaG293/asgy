import React, { useState } from "react";
import "../homeStyle/Tools.scss";
import { AiOutlineMessage as MessageIcon } from "react-icons/ai";
import { RiContactsBookFill as ContactIcon } from "react-icons/ri";
import { IoSettingsOutline as SettingsIcon } from "react-icons/io5";
import { GrGroup as GroupIcon } from "react-icons/gr";
import { CiLogout as LogoutIcon } from "react-icons/ci";
import { PiPencilSimpleLineLight as UpdateIcon} from "react-icons/pi";


function Tools({ user }) {
  const [showForm, setShowForm] = useState(false);
  const handleAvatarClick = () => {
    setShowForm(!showForm);
  };

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  }

  return (
    <div className="tools">
      <img src={user.avatar} className="avatar" onClick={handleAvatarClick} ảut></img>

      <div className="groupItems">
        <MessageIcon className="item"></MessageIcon>
        <ContactIcon className="item"></ContactIcon>
        <GroupIcon className="item"></GroupIcon>
        <SettingsIcon className="item"></SettingsIcon>
        <LogoutIcon className="item"></LogoutIcon>

      </div>


    {/* Form mở sau khi nhấn vào avatar */}
      {showForm && (
        <div className="popup-overlay">
          <div className="popup-content detailedInfoForm">
            <h1 style={{ fontSize: 20 }}>{user.fullName}</h1>
            <div className="form-container">
              {/* Giới tính */}
              <div className="popup-information">
                <p className="popup-information-key">Giới tính</p>
                <p className="popup-information-value">{user.gender}</p>
              </div>
              {/* Ngày sinh */}
              <div className="popup-information">
                <p className="popup-information-key">Ngày sinh</p>
                <p className="popup-information-value">{formatDate(user.birthday)}</p>
              </div>
              {/* Ngày sinh */}
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

    </div>
  );
}

export default Tools;
