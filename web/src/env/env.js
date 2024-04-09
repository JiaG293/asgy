import Cookies from "js-cookie";

export const refreshToken = Cookies.get("refreshToken");
export const clientID = Cookies.get("clientId")