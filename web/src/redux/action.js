// actions.js
import { SET_PROFILE, SET_USER, SET_AUTHENTICATED } from './actionTypes';

export const setProfile = (profile) => ({
  type: SET_PROFILE,
  payload: profile,
});

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const setAuthenticated = (isAuthenticated) => ({
  type: SET_AUTHENTICATED,
  payload: isAuthenticated,
});
