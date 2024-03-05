import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

function Home() {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          console.error("refreshToken không tồn tại");
          return;
        }
        // Giải mã refreshToken để xem thông tin chứa trong nó
        const decodedToken = jwt_decode(refreshToken);
        // Lấy clientID từ decodedToken
        const clientID = decodedToken.clientId;
        // Tạo headers chứa thông tin cần thiết
        const headers = {
          "X-Client-Id": clientID,
          'Authorization': refreshToken,
        };
        // Gửi yêu cầu lấy thông tin người dùng sử dụng refreshToken
        const response = await axios.post(
          "http://localhost:5000/api/v1/accounts/information",
          { userId: decodedToken.userId },
          { headers }
        );
        if (response.status === 200) {
          // Lấy tên người dùng từ decodedToken và cập nhật state
          const userName = decodedToken.userID;
          setUserName(userName);
        } else {
          console.error("Lỗi khi lấy thông tin người dùng");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        if (error.response) {
          console.error("Data request server:", error.response.data);
        }
        if (error.config && error.config.headers) {
          console.error("Headers request:", error.config.headers);
        }
      }
    };
    fetchData();
  }, []);

//render
  return (
    <div>
      <h2>User Name: {userName}</h2>
    </div>
  );
}

export default Home;
