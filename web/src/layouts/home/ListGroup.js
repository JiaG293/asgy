import React from "react";
import "../homeStyle/ListGroup.scss";
import { FaUserGroup as GroupIcon} from "react-icons/fa6";

function ListGroup() {
  // Mảng dữ liệu nhóm ảo
  const groups = [
    { id: 1, name: "Nhóm A" },
    { id: 2, name: "Nhóm B" },
    { id: 3, name: "Nhóm C" },
    { id: 4, name: "Nhóm D" },
    // Thêm các nhóm khác vào đây
  ];

  return (
    <div className="listgroup-container">
      <div className="listgroup-header">
        <GroupIcon className="listgroup-icon" />
        <span className="listgroup-text">Danh sách nhóm</span>
      </div>
      <div className="listgroup-card">
        {/* Render danh sách nhóm */}
        {groups.map((group) => (
          <div key={group.id} className="group-item">
            {group.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListGroup;
