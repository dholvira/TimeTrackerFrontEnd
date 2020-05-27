import { combineReducers } from 'redux';
import User from '../reducers/user_reducer';
// import Chat from '../reducers/chat_reducer';

const rootReducer = combineReducers({
  User,
  // Chat,
});
export default rootReducer;
