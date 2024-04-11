import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    deleteMessage(state, action) {
      state.messages = state.messages.filter(message => message.id !== action.payload);
    },
    // Other message-related reducers
  },
});

export const { addMessage, deleteMessage } = messageSlice.actions;

export default messageSlice.reducer;