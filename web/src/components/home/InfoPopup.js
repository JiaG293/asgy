import React, { useEffect, useState } from "react";
import { PiPencilSimpleLineLight as UpdateIcon } from "react-icons/pi";
import "../homeStyle/InfoPopup.scss";
import Cookies from "js-cookie";
import axios from "axios";
import jwtDecode from "jwt-decode";

function InfoPopup({ user, setShowUpdateModal, formatDate }) {
  // const [user, setUser] = useState({});
// // Load dữ liệu người dùng
// const fetchData = async () => {
//   try {
//     const refreshToken = Cookies.get("refreshToken");

//     // Giải mã refreshToken để xem thông tin chứa trong nó
//     const decodedToken = jwtDecode(refreshToken);
//     const clientID = decodedToken.clientId;
//     const headers = {
//       "X-Client-Id": clientID,
//       Authorization: refreshToken,
//     };
//     // Gửi yêu cầu lấy thông tin người dùng sử dụng refreshToken
//     const response = await axios.post(
//       "http://localhost:5000/api/v1/profile/personal-information",
//       { userId: decodedToken.userId },
//       { headers }
//     );
//     console.log(response.data.metadata);

//     // Lấy dữ liệu thông tin người dùng và cập nhật state
//     if (response.status === 200) {
//       const user = response.data.metadata;
//       setUser(user);
//     } else {
//       console.error("Lỗi khi lấy thông tin người dùng");
//     }
//   } catch (error) {
//     console.error("Lỗi khi lấy thông tin người dùng:", error);
//     if (error.response) {
//       console.error("Data request server:", error.response.data);
//     }
//     if (error.config && error.config.headers) {
//       console.error("Headers request:", error.config.headers);
//     }
//   }
// };

// useEffect(() => {
//   fetchData();
// }, []);

  return (
    <div className="info-popup-container">
      <div className="info-popup-content">
        <div className="info-form-container">
          <div className="info-avatar-container">
            <img src={user.avatar}></img>
          </div>
          <br></br>
          <h1 style={{ fontSize: 20, color: "#3cd9b6" }}>{user.fullName}</h1>
          <div className="info-popup-information">
            <p className="info-popup-information-key">Giới tính</p>
            <p className="info-popup-information-value">{user.gender}</p>
          </div>
          <div className="info-popup-information">
            <p className="info-popup-information-key">Ngày sinh</p>
            <p className="info-popup-information-value">
              {formatDate(user.birthday)}
            </p>
          </div>
          <div className="info-popup-information">
            <p className="info-popup-information-key">Số điện thoại</p>
            <p className="info-popup-information-value">{user.phoneNumber}</p>
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
