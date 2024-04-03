import React from "react";
import '../homeStyle/Settings.scss'

function SettingsPopup({ setShowLogoutModal }) {
  return (
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
            <button
              className="settings-popup-button"
              onClick={() => {
                setShowLogoutModal(true);
              }}
            >
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SettingsPopup;
