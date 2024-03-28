import React from "react";
import "../homeStyle/LogoutModal.scss";

function LogoutModal({ setShowLogoutModal, handleLogout }) {
  return (
    <div className="logout-modal-container">
      <div className="logout-modal-content">
        <h2>Xác nhận đăng xuất</h2>
        <p>Bạn có chắc muốn đăng xuất?</p>
        <div className="logout-modal-buttons">
          <button onClick={() => setShowLogoutModal(false)}>Hủy</button>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
