import React, { useState } from "react";
import { PiPencilSimpleLineLight as UpdateIcon } from "react-icons/pi";
import "../homeStyle/InfoPopup.scss";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import endpointAPI from "api/endpointAPI";
import { clientID, refreshToken } from "env/env";
import statusCode from "utils/statusCode";
import { setProfile } from "../../redux/action";
import { toast } from "react-toastify";

function InfoPopup({ setShowUpdateModal, formatDate }) {
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const handleUpdateAvatar = async (newFile) => {
    try {
      const formData = new FormData();
      formData.append("image", newFile);

      const response = await axios.put(endpointAPI.updateProfile, formData, {
        headers: {
          "X-Client-Id": clientID,
          Authorization: refreshToken,
        },
      });

      if (response.status === statusCode.OK) {
        dispatch(setProfile({ ...profile, avatar: URL.createObjectURL(newFile) }));
        setShowUpdateModal(false);
        toast.success("Cập nhật thành công");
        console.log("Update thành công");
      } else {
        console.error("Lỗi khi cập nhật thông tin cá nhân");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin cá nhân:", error);
    }
  };

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    if (newFile) {
      setFile(newFile);
      handleUpdateAvatar(newFile); // Gọi hàm cập nhật avatar ngay khi chọn tệp mới
    }
  };

  return (
    <div className="info-popup-container">
      <div className="info-popup-content">
        <div className="info-form-container">
          <div className="info-avatar-container">
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="avatarInput"
              onChange={handleFileChange}
            />
            <img
              src={profile?.avatar}
              alt="Avatar"
              onClick={() => document.getElementById('avatarInput').click()}
            />
          </div>
          <br></br>
          <h1 style={{ fontSize: 20, color: "#3cd9b6" }}>
            {profile?.fullName}
          </h1>
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
            <p className="info-popup-information-value">
              {profile?.phoneNumber}
            </p>
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
