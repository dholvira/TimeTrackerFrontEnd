import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';
import { setUser, signInn } from '../../actions/user_actions';
import { config } from '../../siteDetails';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export default function withAuth(ComponentToBeRendered) {
  class Authenticate extends Component {
    authCheck = () => {
      try {
        if (localStorage.authToken) {
          axios({
            method: 'GET',
            url: `${config.serverUrl}login/validToken`,
            headers: {
              'x-auth-token': localStorage.authToken,
            },
          })
            .then((res) => {
              // console.log(res, 'auth check');
              if (res.data.message === 'valid') {
                this.props.setUser(
                  localStorage.authToken,
                  this.state.isChecked
                );

                // this.setState({ isAuth: true });
                window.ipcRenderer.sendSync('logIn', 'login');
              } else {
                // this.setState({ isAuth: false });
                window.ipcRenderer.sendSync('logOut', 'logout');
              }
            })
            .catch((err) => {
              this.setState({ isAuth: false });
              window.ipcRenderer.sendSync('logOut', 'logout');
            });
        } else {
          // this.setState({ isAuth: false });
          window.ipcRenderer.sendSync('logOut', 'logout');
        }
      } catch (err) {
        // this.setState({ isAuth: false });
        window.ipcRenderer.sendSync('logOut', 'logout');
      }
    };
    checkExpiry = () => {
      if (localStorage.authToken) {
        const decoded = jwt_decode(localStorage.authToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem('authToken');
          window.ipcRenderer.sendSync('logOut', 'logout');
          this.props.history.push('/auth/login');
        } else {
          console.log(decoded.user.role, decoded.user.uid, 'token still valid');
        }
      } else {
        console.log('no token found');
        this.props.history.push('/auth/login');
      }
    };

    componentWillMount() {
      if (this.props.User.auth.message === 'invalid') {
        this.props.history.push('/auth/login');
      }
    }
    componentWillUpdate(nextProps) {
      this.checkExpiry();

      //   if (nextProps.User.auth.message === 'invalid') {
      //     this.props.history.push('/auth/login');
      //   }
    }

    render() {
      if (this.props.User.auth.message !== 'valid') {
        console.log('withAuth redirect');
        return <Redirect to='/auth/login' />;
      } else return <ComponentToBeRendered {...this.props} />;
    }
  }

  const mapStateToProps = (state) => {
    return {
      User: state.User,
    };
  };
  const mapDispatchToProps = {
    setUser,
    // signOut,
    signInn,
  };

  return connect(mapStateToProps, mapDispatchToProps)(Authenticate);
}
