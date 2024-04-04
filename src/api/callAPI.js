import axios from "axios";
import endpointAPI from "./endpointAPI";

export const login = async (usernameOrEmail, password) => {
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

export const register = async (payload) => {
  try {
    const response = await axios.post(endpointAPI.signup, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const callAPI = {
  login,
  register,
};

export default callAPI;