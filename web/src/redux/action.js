// actions.js
import { SET_PROFILE, SET_USER, SET_AUTHENTICATED, SET_CHANNEL } from './actionTypes';

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

export const setChannel = (channels) => ({ // Đổi tên thành channels
  type: SET_CHANNEL,
  payload: channels, // Sử dụng channels thay vì channel
});