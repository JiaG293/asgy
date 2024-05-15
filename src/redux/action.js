import { SET_PROFILE, SET_USER, SET_TOKENS,SET_CLIENT, SET_CHANNELS, SET_MESSAGES, SET_CURRENT_CHANNEL, SET_CURRENT_MESSAGES, SET_FRIENDS, SET_FRIENDS_REQUEST } from './actionTypes';

export const setProfile = (profile) => ({
  type: SET_PROFILE,
  payload: profile,
});

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const setChannels = (channels) => ({
  type: SET_CHANNELS,
  payload: channels,
});

export const setMessages = (messages) => ({
  type: SET_MESSAGES,
  payload: messages,
});

export const setCurrentChannel = (channel) => ({
  type: SET_CURRENT_CHANNEL,
  payload: channel,
});

export const setCurrentMessages = (messages) => ({
  type: SET_CURRENT_MESSAGES,
  payload: messages,
});

export const setFriends = (messages) => ({
  type: SET_FRIENDS,
  payload: messages,
});

export const setFriendsRequest = (messages) => ({
  type: SET_FRIENDS_REQUEST,
  payload: messages,
});

export const setTokens = (refreshTokens) => {
  console.log("Setting refresh tokens:", refreshTokens);
  return {
    type: SET_TOKENS,
    payload: refreshTokens
  };
};

export const setClient = (clientID) => {
  console.log("Setting client ID:", clientID);
  return {
    type: SET_CLIENT,
    payload: clientID
  };
};