import React from 'react';
import { connect } from 'react-redux';
import {
  registerChatUser,
  privateMessage,
} from '../../../actions/chat_actions';
import axios from 'axios';

// reactstrap components
import NotificationAlert from 'react-notification-alert';

import {
  Badge,
  Card,
  CardHeader,
  CardBody,
  Container,
  // Row,
  // Col,
  Modal,
  Button,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
} from 'reactstrap';

// core components
import NavBar from '../components/NavBar';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
// import Modal from 'react-bootstrap/lib/Modal';
import UserList from '../components/UserList';
import ChatBox from '../components/ChatBox';
import ErrorModal from '../components/ErrorModal';
import LoadingModal from '../components/LoadingModal';
import 'react-chat-elements/dist/main.css';
import './index.css';
import io from 'socket.io-client';
import { fetchUsers } from './requests';
// import {
//   NotificationContainer,
//   NotificationManager,
// } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ReactBSAlert from 'react-bootstrap-sweetalert';

import classnames from 'classnames';

import SimpleHeader from 'components/Headers/SimpleHeader.jsx';

const SOCKET_URI = 'http://165.22.212.180:8002';

class Chat extends React.Component {
  socket = null;

  state = {
    signInModalShow: false,
    users: [], // Avaiable users for signing-in
    reduxUser: null,
    userChatData: [], // this contains users from which signed-in user can chat and its message data.
    user: null, // Signed-In User
    selectedUserIndex: null,
    showChatBox: false, // For small devices only
    showChatList: true, // For small devices only
    error: null,
    errorMessage: '',
  };

  hideAlert = () => {
    this.setState({
      error: null,
    });
  };
  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  notify = (type) => {
    let options = {
      place: 'tc',
      message: (
        <div className='alert-text'>
          <span className='alert-title' data-notify='title'>
            {' '}
            {this.state.error}
          </span>
          <span data-notify='message'>{this.state.errorMessage}</span>
        </div>
      ),
      type: type,
      icon: 'ni ni-bell-55',
      autoDismiss: 7,
    };
    this.refs.notificationAlert.notificationAlert(options);
  };
  /**
   *
   * Setups Axios to monitor XHR errors.
   * Initiates and listen to socket.
   * fetches User's list from backend to populate.
   */
  getUserDetails() {
    const chatObj = this.props.User.user;
    chatObj.id = chatObj.uid;
    console.log(chatObj, 'userobject');
    this.setState({ reduxUser: [chatObj] });
  }

  componentDidMount() {
    this.initAxios();
    this.getUserDetails();
    this.initSocketConnection();
    fetchUsers().then((users) =>
      this.setState({ users, signInModalShow: true })
    );

    this.setupSocketListeners();
  }

  initSocketConnection() {
    this.socket = io.connect(SOCKET_URI);
  }

  /**
   *
   * Checks if request from axios fails
   * and if it does then shows error modal.
   */
  initAxios() {
    axios.interceptors.request.use(
      (config) => {
        this.setState({ loading: true });
        return config;
      },
      (error) => {
        this.setState({ loading: false });
        this.setState({
          errorMessage: `Couldn't connect to server. try refreshing the page.`,
          error: true,
        });
        this.notify('warning');
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      (response) => {
        this.setState({ loading: false });
        return response;
      },
      (error) => {
        this.setState({ loading: false });
        this.setState({
          errorMessage: `Some error occured. try after sometime`,
          error: true,
        });
        // this.warningAlert();
        this.notify('warning');
        return Promise.reject(error);
      }
    );
  }

  /**
   *
   * Shows error if client gets disconnected.
   */
  onClientDisconnected() {
    this.setState({
      errorMessage: `Connection Lost from server please check your connection`,
      error: `Error!`,
    });
    this.notify('warning');
    // NotificationManager.error(
    //   'Connection Lost from server please check your connection.',
    //   'Error!'
    // );
  }

  /**
   *
   * Established new connection if reconnected.
   */
  onReconnection() {
    if (this.state.user) {
      this.socket.emit('sign-in', this.state.user);
      this.setState({
        errorMessage: `Connection Established.`,
        error: `Reconnected!`,
      });
      this.notify('success');
      // NotificationManager.success('Connection Established.', 'Reconnected!');
    }
  }

  /**
   *
   * Setup all listeners
   */

  setupSocketListeners() {
    this.socket.on('message', this.onMessageRecieved.bind(this));
    this.socket.on('reconnect', this.onReconnection.bind(this));
    this.socket.on('disconnect', this.onClientDisconnected.bind(this));
  }

  /**
   *
   * @param {MessageRecievedFromSocket} message
   *
   * Triggered when message is received.
   * It can be a message from user himself but on different session (Tab).
   * so it decides which is the position of the message "right" or "left".
   *
   * increments unread count and appends in the messages array to maintain Chat History
   */

  onMessageRecieved(message) {
    let userChatData = this.state.userChatData;
    let messageData = message.message;
    let targetId;
    if (message.from === this.state.user.id) {
      messageData.position = 'right';
      targetId = message.to;
    } else {
      messageData.position = 'left';
      targetId = message.from;
    }
    let targetIndex = userChatData.findIndex((u) => u.id === targetId);
    if (!userChatData[targetIndex].messages) {
      userChatData[targetIndex].messages = [];
    }
    if (targetIndex !== this.state.selectedUserIndex) {
      if (!userChatData[targetIndex].unread) {
        userChatData[targetIndex].unread = 0;
      }
      userChatData[targetIndex].unread++;
    }
    userChatData[targetIndex].messages.push(messageData);
    this.setState({ userChatData });
  }

  /**
   *
   * @param {User} e
   *
   * called when user clicks to sign-in
   */
  onUserClicked(e) {
    let user = e.user;
    this.socket.emit('sign-in', user);
    let userChatData = this.state.users.filter((u) => u.id !== user.id);
    this.setState({ user, signInModalShow: false, userChatData });
  }

  signInRedux(name, id) {
    let user = { name, id };

    this.socket.emit('sign-in', user);
    let userChatData = this.state.users.filter((u) => u.id !== user.id);
    this.setState({ user, signInModalShow: false, userChatData });
  }

  /**
   *
   * @param {ChatItem} e
   *
   * handles if user clickes on ChatItem on left.
   */
  onChatClicked(e) {
    this.toggleViews();
    let users = this.state.userChatData;
    for (let index = 0; index < users.length; index++) {
      if (users[index].id === e.user.id) {
        users[index].unread = 0;
        this.setState({ selectedUserIndex: index, userChatData: users });
        return;
      }
    }
  }

  /**
   *
   * @param {messageText} text
   *
   * creates message in a format in which messageList can render.
   * position is purposely omitted and will be appended when message is received.
   */
  createMessage(text) {
    let message = {
      to: this.state.userChatData[this.state.selectedUserIndex].id,
      message: {
        type: 'text',
        text: text,
        date: +new Date(),
        className: 'message',
      },
      from: this.state.user.id,
    };
    this.socket.emit('message', message);
  }

  /**
   * Toggles views from 'ChatList' to 'ChatBox'
   *
   * only on Phone
   */
  toggleViews() {
    this.setState({
      showChatBox: !this.state.showChatBox,
      showChatList: !this.state.showChatList,
    });
  }
  render() {
    let chatBoxProps = this.state.showChatBox
      ? {
          xs: 12,
          sm: 12,
        }
      : {
          xsHidden: true,
          smHidden: true,
        };

    let chatListProps = this.state.showChatList
      ? {
          xs: 12,
          sm: 12,
        }
      : {
          xsHidden: true,
          smHidden: true,
        };

    return (
      <>
        <div className='rna-wrapper'>
          <NotificationAlert ref='notificationAlert' />
        </div>
        {/* <SimpleHeader name='Notifications' parentName='Components' /> */}

        <NavBar bg='light' variant='light' signedInUser={this.state.user} />
        <Grid>
          <Row className='show-grid'>
            <Col {...chatListProps} md={4}>
              <UserList
                userData={this.state.userChatData}
                onChatClicked={this.onChatClicked.bind(this)}
              />
            </Col>
            <Col {...chatBoxProps} md={8}>
              <ChatBox
                signedInUser={this.state.user}
                onSendClicked={this.createMessage.bind(this)}
                onBackPressed={this.toggleViews.bind(this)}
                targetUser={
                  this.state.userChatData[this.state.selectedUserIndex]
                }
              />
            </Col>
          </Row>
        </Grid>
        {/* <Modal show={this.state.signInModalShow}>
          <Modal.Header>
            <Modal.Title>Sign In as:</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            
          </Modal.Body>
        </Modal> */}

        <Modal
          className='modal-dialog-centered'
          size='sm'
          isOpen={this.state.signInModalShow}
          toggle={() => this.toggleModal('signInModalShow')}
        >
          {/* <div className='modal-body p-0'>
            <Card className='bg-secondary border-0 mb-0'>
              <CardBody className='px-lg-5 py-lg-5'>
                <div className='text-center text-muted mb-4'>
                  <small>Sign In as:</small>
                </div> */}
          <UserList
            userData={this.state.reduxUser}
            onUserClicked={this.onUserClicked.bind(this)}
            showSignInList
          />
          {/* </CardBody>
            </Card>
          </div> */}
        </Modal>

        <ErrorModal
          show={this.state.error}
          errorMessage={this.state.errorMessage}
        />
        <LoadingModal show={this.state.loading} />
        {/* <NotificationContainer /> */}
      </>
    );
  }
}
// export default Chat;
const mapStateToProps = (state) => {
  return {
    User: state.User,
  };
};
const mapDispatchToProps = {
  registerChatUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
