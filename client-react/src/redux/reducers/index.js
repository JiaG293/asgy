// index.js
import { combineReducers } from 'redux';
import chatReducer from './chatReducer';

const rootReducer = combineReducers({
  conversations: chatReducer
});

export default rootReducer;
