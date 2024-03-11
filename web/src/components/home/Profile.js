import React from "react";
import '../homeStyle/Profile.scss'; // Đảm bảo đường dẫn đúng đến file SCSS của bạn

function Profile() {
  return (
    <div className="profileContainer">
      <div className="profileHeader">
        Thông tin cuộc hội thoại
      </div>

      {/* chinh lai cai nay cho no từ trên xuống và ở chính giữa */}
      <div className="personalInfo">  
        <div className="avatar">
          <img src="path-to-avatar.jpg" alt="Avatar" /> {/* Thay thế "path-to-avatar.jpg" bằng đường dẫn thực của avatar */}
        </div>
        <div className="groupName">Tên nhóm</div>
        <div className="actionButtons">
          <button className="btn">Thông Báo</button>
          <button className="btn">Ghim</button>
          <button className="btn">Tạo Nhóm</button>
        </div>
      </div>
      <div className="storageImages">
        Nơi lưu trữ hình ảnh
        {/* Thêm nội dung về nơi lưu trữ hình ảnh tại đây */}
      </div>
      <div className="storageFiles">
        Nơi lưu trữ file
        {/* Thêm nội dung về nơi lưu trữ file tại đây */}
      </div>
    </div>
  );
}

export default Profile;