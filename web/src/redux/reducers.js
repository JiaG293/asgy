// reducers.js
import { combineReducers } from "redux";
import {
  SET_PROFILE,
  SET_USER,
  SET_CHANNELS,
  SET_MESSAGES,
  SET_CURRENT_CHANNEL,
  SET_CURRENT_MESSAGES,
} from "./actionTypes";

const profileReducer = (state = null, action) => {
  switch (action.type) {
    case SET_PROFILE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const userReducer = (state = null, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const channelsReducer = (state = [], action) => {
  switch (action.type) {
    case SET_CHANNELS:
      return [...action.payload];
    default:
      return state;
  }
};

const messagesReducer = (state = [], action) => {
  switch (action.type) {
    case SET_MESSAGES:
      return [...state, action.payload];
    default:
      return state;
  }
};

const currentChannelReducer = (state = null, action) => {
  switch (action.type) {
    case SET_CURRENT_CHANNEL:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const currentMessagesReducer = (state = [], action) => {
  switch (action.type) {
    case SET_CURRENT_MESSAGES:
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  profile: profileReducer,
  user: userReducer,
  channelList: channelsReducer,
  messagesList: messagesReducer,
  currentChannel: currentChannelReducer,
  currentMessages: currentMessagesReducer,

  // isAuthenticated: isAuthenticatedReducer,
});

export default rootReducer;
