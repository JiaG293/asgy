import { GET_MESSAGE, GET_MESSAGES, SEND_MESSAGE } from "../constants/actionsTypes"; 




export const sendMessage = (message) => {
  return {
    type: SEND_MESSAGE,
    payload: message
  };
};

export const getMessage = (message) => {
  return {
    type: GET_MESSAGE,
    payload: message
  };
};

export const getMessages = (messages) => {
  return {
    type: GET_MESSAGES,
    payload: messages
  };
};


