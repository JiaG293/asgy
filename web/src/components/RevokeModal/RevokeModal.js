import React from "react";
import "./RevokeModal.scss";

function RevokeModal({ onClose, onConfirm }) {

  return (
    <div className="revoke-modal-container">
      <div className="revoke-modal-content">
        <div className="revoke-modal-header">
          <h5 className="revoke-modal-title">Xác nhận</h5>
        </div>
        <div className="revoke-modal-body">Bạn có chắc chắn muốn thu hồi?</div>
        <div className="revoke-modal-footer">
          <button className="revoke-modal-btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button className="revoke-modal-btn-primary" onClick={onConfirm}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default RevokeModal;
