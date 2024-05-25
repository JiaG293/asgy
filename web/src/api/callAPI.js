import axios from "axios";
import endpointAPI from "./endpointAPI";
import { clientID, refreshToken } from "env/env";
import statusCode from "utils/statusCode";

//lấy headers
const headers = {
  "x-client-id": clientID,
  authorization: refreshToken,
};

//hàm login lấy thông tin đn và mk
export const fetchLogin = async (usernameOrEmail, password) => {
  try {
    const response = await axios.post(endpointAPI.login, {
      userID: usernameOrEmail,
      password: password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//hàm đăng ký truyền vào object chứa dữ liệu trên form
export const fetchRegister = async (payload) => {
  try {
    const response = await axios.post(endpointAPI.signup, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProfileInfo = async ()=>{
  try {
    if (!headers.authorization || !headers["x-client-id"]) {
      console.log("Có lỗi xảy ra!");
      return;
    }
    const response = await axios.get(endpointAPI.getInfoProfile, {
      headers,
    });

    if (response.status === statusCode.OK) {
      const profile = response.data.metadata;
      const friends = response.data.metadata.friends;
      const friendsRequest = response.data.metadata.friendsRequest;
      return {
        profile,
        friends,
        friendsRequest
      }
    } 
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng");
  }
}

export const fetchLogout = async ()=>{
  try {
    const response = await axios.post(
      endpointAPI.logout,
      null,
      { headers }
    )
    return response
  } catch (error) {
  }
}

