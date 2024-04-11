/* // store.js
import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);

export default store; */


import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './reducers/messageReducer';

const store = configureStore({
  reducer: {
    messages: messageReducer,
  },
});

export default store;