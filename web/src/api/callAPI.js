import axios from "axios";
import endpointAPI from "./endpointAPI";

export const login_API = async (usernameOrEmail, password) => {
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

const callAPI = {
  login_API
};

export default callAPI;
