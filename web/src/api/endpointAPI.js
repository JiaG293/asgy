// URI components
const protocol = 'http';
const IP_Address = 'localhost';
// const client_PORT = 3000;
const server_PORT = 5000;
const version = 'v1';
const tokenEmail = '';

const baseURL = `${protocol}://${IP_Address}:${server_PORT}/api/${version}`;

const endpointAPI = {
  // Access
  signup: `${baseURL}/users/signup/`,
  login: `${baseURL}/users/login/`,
  logout: `${baseURL}/users/logout/`,
  forgotPassword: `${baseURL}/users/forgot-password/`,
  resetPassword: `${baseURL}/users/reset-password/${tokenEmail}`,
  // Profile
  getInfoProfile: `${baseURL}/profile/`,
  updateProfile: `${baseURL}/profile/update/`,
  getListFriendPrivate: `${baseURL}/profile/friends/`,
  sendFriendRequest: `${baseURL}/profile/send-request/`,
  acceptFriendRequest: `${baseURL}/profile/accept-request/`,
  // Chats
  createSingleChat: `${baseURL}/chats/create-single-chat/`,
  createChannelChat: `${baseURL}/chats/create-channel-chat/`,
  findChannel: `${baseURL}/chats/findChannel/`,
  getListChannels: `${baseURL}/chats/channels/`,
};

export default endpointAPI;
