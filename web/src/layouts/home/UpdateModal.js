import React, { useState } from "react";
import "../homeStyle/UpdateModal.scss";
import axios from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../../redux/action";
import { toast } from "react-toastify";
import { clientID, refreshToken } from "env/env";

function UpdateModal({ setShowUpdateModal }) {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);

  const [fullName, setFullName] = useState(profile.fullName);
  const [gender, setGender] = useState(profile.gender);
  const [dob, setDob] = useState(new Date(profile.birthday));

  const handleDayChange = (e) => {
    const newDay = parseInt(e.target.value);
    const newDate = new Date(dob);
    newDate.setDate(newDay);
    setDob(newDate);
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value) - 1;
    const newDate = new Date(dob);
    newDate.setMonth(newMonth);
    setDob(newDate);
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    const newDate = new Date(dob);
    newDate.setFullYear(newYear);
    setDob(newDate);
  };

  const handleSave = async () => {
    try {
      const profileData = {
        fullName: fullName,
        gender: gender,
        birthday: dob.toISOString().split("T")[0],
      };
      console.log(profileData.birthday);
      const response = await handleUpdateProfile(profileData);
      if (response.status === 200) {
        dispatch(setProfile(profileData)); // Cập nhật state trong Redux
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

  const handleUpdateProfile = async (profileData) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/v1/profile/update",
        profileData,
        {
          headers: {
            "X-Client-Id": clientID,
            Authorization: refreshToken,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating profile profile:", error.response);
      throw error;
    }
  };

  return (
    <div className="update-modal-container">
      <div className="update-modal-content">
        <h1>Cập nhật thông tin cá nhân</h1>
        <div className="update-modal-group">
          <b htmlFor="display_name">Tên hiển thị:</b>
          <br /> <br />
          <input
            type="text"
            id="display_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        {/* Giới tính */}
        <b>Giới tính:</b>
        <br /> <br />
        <div className="update-modal-group-radio">
          <div className="update-modal-radio">
            <input
              type="radio"
              name="gender"
              id="male"
              checked={gender === "Nam"}
              onChange={() => setGender("Nam")}
            />
            <label className="update-modal-radio-label">Nam</label>
          </div>
          <div className="update-modal-radio">
            <input
              type="radio"
              name="gender"
              id="female"
              checked={gender === "Nữ"}
              onChange={() => setGender("Nữ")}
            />
            <label className="update-modal-radio-label">Nữ</label>
          </div>
          <div className="update-modal-radio">
            <input
              type="radio"
              name="gender"
              id="secret"
              checked={gender === "Bí mật"}
              onChange={() => setGender("Bí mật")}
            />
            <label className="update-modal-radio-label">Bí mật</label>
          </div>
        </div>
        {/* ngày sinh */}
        <b htmlFor="dob">Ngày sinh:</b>
        <br /> <br />
        <div className="update-modal-group">
          <div className="update-modal-selects">
            <select value={dob.getDate()} onChange={handleDayChange}>
              {[...Array(31).keys()].map((day) => (
                <option key={day + 1} value={day + 1}>
                  {day + 1}
                </option>
              ))}
            </select>
            <select value={dob.getMonth() + 1} onChange={handleMonthChange}>
              {[...Array(12).keys()].map((month) => (
                <option key={month + 1} value={month + 1}>
                  {month + 1}
                </option>
              ))}
            </select>
            <select value={dob.getFullYear()} onChange={handleYearChange}>
              {[...Array(100).keys()].map((year) => (
                <option key={year + 1920} value={year + 1920}>
                  {year + 1920}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-buttons">
          <button
            onClick={() => setShowUpdateModal(false)}
            className="cancel-button"
          >
            Hủy
          </button>
          <button onClick={handleSave}>Lưu</button>
        </div>
      </div>
    </div>
  );
}

export default UpdateModal;
