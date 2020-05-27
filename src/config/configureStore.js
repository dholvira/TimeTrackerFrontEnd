// "socket.io-client": "^2.3.0",
//     "redux-socket.io": "^1.4.0"
import reducers from '../reducers';

// import { createStore, applyMiddleware, compose } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';

// import createSocketIoMiddleware from 'redux-socket.io';
// import io from 'socket.io-client';
import thunk from 'redux-thunk';

// const socket = io('http://192.168.43.93:5001');
// const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

// const middleware = [thunk, socketIoMiddleware];
const middleware = [thunk];

if (process.env.NODE_ENV === 'development') {
  middleware.push(createLogger());
}
// const Store = createStore(reducers, compose(applyMiddleware(...middleware), window.devToolsExtension ? window.devToolsExtension() : f => f));

const Store = createStore(reducers, applyMiddleware(...middleware));

export default Store;
