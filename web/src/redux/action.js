// actions.js
import { SET_PROFILE, SET_USER, SET_AUTHENTICATED, SET_CHANNELS, SET_MESSAGES, SET_CURRENT_CHANNEL } from './actionTypes';

export const setProfile = (profile) => ({
  type: SET_PROFILE,
  payload: profile,
});

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

// export const setAuthenticated = (isAuthenticated) => ({
//   type: SET_AUTHENTICATED,
//   payload: isAuthenticated,
// });

export const setChannels = (channels) => ({ 
  type: SET_CHANNELS,
  payload: channels, 
});

export const setMessages = (messages) => ({ 
  type: SET_MESSAGES,
  payload: messages, 
});

export const setCurrentChannel = (channel)=>({
  type: SET_CURRENT_CHANNEL,
  payload: channel,
});