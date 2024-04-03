import React from "react";
import "../homeStyle/ListRequest.scss";
import { LuMailOpen as RequestListIcon } from "react-icons/lu";

function ListRequest() {
  return (
    <div className="listrequests-container">
      <div className="listrequests-header">
        <RequestListIcon className="listrequests-icon" />
        <span className="listrequests-text">Lời mời kết bạn</span>
      </div>
      <div className="listrequests-card"></div>
    </div>
  );
}

export default ListRequest;
