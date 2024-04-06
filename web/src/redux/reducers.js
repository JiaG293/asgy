// reducers.js
import { combineReducers } from "redux";
import {
  SET_PROFILE,
  SET_USER,
  SET_AUTHENTICATED,
  SET_CHANNELS,
  SET_MESSAGES,
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

// const isAuthenticatedReducer = (state = false, action) => {
//   switch (action.type) {
//     case SET_AUTHENTICATED:
//       return action.payload;
//     default:
//       return state;
//   }
// };

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
      return [...action.payload];
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  profile: profileReducer,
  user: userReducer,
  channelList: channelsReducer,
  messagesList: messagesReducer,
  // isAuthenticated: isAuthenticatedReducer,
});

export default rootReducer;
