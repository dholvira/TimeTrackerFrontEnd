import { SELF_USER, USERS_ONLINE, PRIVATE_MESSAGE } from '../types/app';

export const registerChatUser = (username) => (dispatch) => {
  dispatch({ type: 'server/join', data: username });
};

export const privateMessage = (messages, userId) => (dispatch) => {
  dispatch({
    type: PRIVATE_MESSAGE,
    data: { message: messages[0], conversationId: userId },
  });
  dispatch({
    type: 'server/private_message',
    data: { message: messages[0], conversationId: userId },
  });
};
