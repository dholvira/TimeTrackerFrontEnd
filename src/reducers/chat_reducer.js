import { USERS_ONLINE, PRIVATE_MESSAGE, SELF_USER } from '../types/app';

export default function (
  state = {
    conversations: {},
    usersOnline: [],
  },
  action
) {
  switch (action.type) {
    case USERS_ONLINE:
      console.log(action.data, 'bakchodi');
      const conversations = { ...state.conversations };
      const usersOnline = action.data;
      for (let i = 0; i < usersOnline.length; i++) {
        const userId = usersOnline[i].userId;
        if (conversations[userId] === undefined) {
          conversations[userId] = {
            messages: [],
            username: usersOnline[i].username,
          };
        }
      }
      return { ...state, usersOnline, conversations };
    case PRIVATE_MESSAGE:
      const conversationId = action.data.conversationId;

      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...state.conversations[conversationId],
            messages: [
              action.data.message,
              ...state.conversations[conversationId].messages,
            ],
          },
        },
      };
    case SELF_USER:
      // console.log(action.payload.data);
      return { ...state, selfUser: action.data };
    default:
      return state;
  }
}
