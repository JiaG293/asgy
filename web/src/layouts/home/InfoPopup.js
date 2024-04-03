import React from "react";
import { PiPencilSimpleLineLight as UpdateIcon } from "react-icons/pi";
import "../homeStyle/InfoPopup.scss";
import { useSelector } from 'react-redux';

function InfoPopup({ setShowUpdateModal, formatDate }) {
  const profile = useSelector(state => state.profile);
  const user = useSelector(state => state.user)
  return (
    <div className="info-popup-container">
      <div className="info-popup-content">
        <div className="info-form-container">
          <div className="info-avatar-container">
            <img src={profile?.avatar} alt="Avatar"></img>
          </div>
          <br></br>
          <h1 style={{ fontSize: 20, color: "#3cd9b6" }}>{profile?.fullName}</h1>
          <div className="info-popup-information">
            <p className="info-popup-information-key">Giới tính</p>
            <p className="info-popup-information-value">{profile?.gender}</p>
          </div>
          <div className="info-popup-information">
            <p className="info-popup-information-key">Ngày sinh</p>
            <p className="info-popup-information-value">
              {formatDate(profile?.birthday)}
            </p>
          </div>
          <div className="info-popup-information">
            <p className="info-popup-information-key">Số điện thoại</p>
            <p className="info-popup-information-value">{profile?.phoneNumber}</p>
          </div>
        </div>
        <button
          className="info-popup-update-button"
          onClick={() => {
            setShowUpdateModal(true);
          }}
        >
          <span>Cập nhật</span>
          <UpdateIcon />
        </button>
      </div>
    </div>
  );
}

export default InfoPopup;
