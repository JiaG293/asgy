import { createAction } from '@reduxjs/toolkit';
import { GET_MESSAGE, GET_MESSAGES, SEND_MESSAGE } from "../constants/actionsTypes";

// Tạo action creator để thêm tin nhắn mới
export const addMessage = createAction('messages/add', function prepare(text) {
    return {
        payload: {
            id: Date.now(),
            text,
        },
    };
});

// Tạo action creator để xóa tin nhắn
export const deleteMessage = createAction('messages/delete');

export const getMessage = createAction('GET_MESSAGE', function prepare(text) {
    return {
        payload: {
            id: Date.now(),
            text,
        },
    };
});
