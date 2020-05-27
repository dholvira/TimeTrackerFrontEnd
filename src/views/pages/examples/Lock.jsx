/*!

=========================================================
* Argon Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';
// nodejs library that concatenates classes
// import classnames from 'classnames';
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  // FormGroup,
  // Form,
  // Input,
  // InputGroupAddon,
  // InputGroupText,
  // InputGroup,
  Container,
  Row,
  Col
} from 'reactstrap';
// core components
import { Redirect } from 'react-router-dom';

import AuthHeader from 'components/Headers/AuthHeader.jsx';
import { connect } from 'react-redux';
import { setUser, breakEnd, breakStart } from '../../../actions/user_actions';
import { config } from '../../../siteDetails';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
// import { lockSystem } from 'lock-system';
// const lockSystem = require('lock-system');

class Lock extends React.Component {
  state = {
    timerStarted: false,
    timerStopped: true,
    hours: 0,
    minutes: 0,
    seconds: 0,
    toggle: false
  };
  handleTimerStart() {
    // e.preventDefault();

    window.ipcRenderer.sendSync('breakStart', 'breakStart');
    this.setState({ toggle: true });
    // window.resizeTo(window.availWidth, window.availHeight);
    // var elem = document.getElementById('root');

    /* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen property yet */
    // function openFullscreen() {
    //   if (elem.requestFullscreen) {
    //     elem.requestFullscreen();
    //   } else if (elem.mozRequestFullScreen) {
    //     /* Firefox */
    //     elem.mozRequestFullScreen();
    //   } else if (elem.webkitRequestFullscreen) {
    //     /* Chrome, Safari and Opera */
    //     elem.webkitRequestFullscreen();
    //   } else if (elem.msRequestFullscreen) {
    //     /* IE/Edge */
    //     elem.msRequestFullscreen();
    //   }
    // }
    // openFullscreen();
    // try {
    //   lockSystem();
    // } catch (error) {
    //   console.log(error, 'error');
    // }
    if (this.props.User.user.uid) {
      this.props.breakStart(this.props.User.user.uid).then(res => {
        if (res.success === 'OK') {
          console.log('start break');
          if (this.state.timerStopped) {
            this.timer = setInterval(() => {
              this.setState({ timerStarted: true, timerStopped: false });
              if (this.state.timerStarted) {
                if (this.state.seconds >= 60) {
                  this.setState(prevState => ({
                    minutes: prevState.minutes + 1,
                    seconds: 0
                  }));
                }
                if (this.state.minutes >= 60) {
                  this.setState(prevState => ({
                    hours: prevState.hours + 1,
                    minutes: 0,
                    seconds: 0
                  }));
                }
                this.setState(prevState => ({
                  seconds: prevState.seconds + 1
                }));
              }
            }, 1000);
          } else {
          }
        }
      });
    }
  }
  handleTimerStop() {
    // e.preventDefault();
    window.ipcRenderer.sendSync('breakEnd', 'breakEnd');

    // function closeFullscreen() {
    //   if (document.exitFullscreen) {
    //     console.log('1');
    //     document.exitFullscreen();
    //   } else if (document.mozCancelFullScreen) {
    //     console.log('2');
    //     document.mozCancelFullScreen();
    //   } else if (document.webkitExitFullscreen) {
    //     console.log('3');
    //     document.webkitExitFullscreen();
    //   } else if (document.msExitFullscreen) {
    //     console.log('4');
    //     document.msExitFullscreen();
    //   }
    //   console.log('5');
    // }
    // closeFullscreen();
    if (this.props.User.user.uid) {
      this.props.breakEnd(this.props.User.user.uid).then(res => {
        console.log(res, 'break end');
        if (res.success === 'OK') {
          console.log('end break');

          this.setState(prevState => ({
            seconds: 0,
            minutes: 0,
            hours: 0,
            timerStarted: false,
            timerStopped: true
            // captures: [
            //   ...prevState.captures,
            //   this.state.hours +
            //     ':' +
            //     this.state.minutes +
            //     ':' +
            //     this.state.seconds
            // ]
          }));

          clearInterval(this.timer);
          // this.fetchBreaks();
          // this.checkBreaks();
          this.setState({ toggle: false });
          this.props.history.push('/admin/dashboard');
        }
      });
    }
  }
  handleTimerReset = () => {
    this.setState({
      timerStarted: false,
      timerStopped: true,
      seconds: 0,
      minutes: 0,
      hours: 0
    });
    clearInterval(this.timer);
  };
  authCheck = () => {
    try {
      if (localStorage.authToken) {
        // const axiosConfig = {
        //   headers: {
        //     'x-auth-token': localStorage.authToken
        //   }
        // };
        axios({
          method: 'GET',
          url: `${config.serverUrl}login/validToken`,
          headers: {
            'x-auth-token': localStorage.authToken
          }
        })
          .then(res => {
            console.log(res, 'auth check');
            if (res.data.message === 'valid') {
              this.props.setUser(localStorage.authToken);
              this.setState({ isAuth: true });
            } else {
              this.setState({ isAuth: false });
            }
          })
          .catch(err => {
            this.setState({ isAuth: false });
          });
      } else {
        this.setState({ isAuth: false });
      }
    } catch (err) {
      this.setState({ isAuth: false });
    }
  };

  checkExpiry = () => {
    if (localStorage.authToken) {
      const decoded = jwt_decode(localStorage.authToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem('authToken');
      } else {
        console.log(decoded.user.role, decoded.user.uid, 'token still valid');
      }
    } else {
      console.log('no token found');
    }
  };
  componentDidMount() {
    this.checkExpiry();
    this.authCheck();
    this.handleTimerStart();
  }
  render() {
    if (this.state.isAuth === false) {
      return <Redirect to='/auth/login' />;
    } else
      return (
        <>
          <AuthHeader
            title='Break Panel'
            lead='Stop the timer before heading back to dashboard..'
          />

          <Container className='mt--8 pb-5'>
            <Row className='justify-content-center'>
              <Col lg='5' md='7'>
                <Card className='card-profile bg-secondary mt-5'>
                  <Row className='justify-content-center'>
                    <Col className='order-lg-2' lg='3'>
                      <div className='card-profile-image'>
                        <img
                          alt='...'
                          className='rounded-circle border-secondary'
                          src={
                            this.props.User.user.profile
                              ? config.imageUrl +
                                '/timetracker/profiles/' +
                                this.props.User.user.profile
                              : require('assets/img/theme/team-4.jpg')
                          }
                        />
                      </div>
                    </Col>
                  </Row>
                  <CardBody className='pt-7 px-5'>
                    <div className='text-center mb-4'>
                      <h3>{this.props.User.user.name}</h3>
                    </div>
                    {/* <Form role='form'>
                      <FormGroup
                        className={classnames({
                          focused: this.state.focused
                        })}
                      >
                        <InputGroup className='input-group-merge input-group-alternative'>
                          <InputGroupAddon addonType='prepend'>
                            <InputGroupText>
                              <i className='ni ni-lock-circle-open' />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder='Password'
                            type='password'
                            onFocus={() => this.setState({ focused: true })}
                            onBlur={() => this.setState({ focused: false })}
                          />
                        </InputGroup>
                      </FormGroup>
                      <div className='text-center'>
                        <Button className='mt-2' color='info' type='button'>
                          Unlock
                        </Button>
                      </div>
                    </Form>
                   */}
                    <div
                      className='d-flex justify-content-center'
                      style={{
                        fontSize: 80,
                        color: '#525f7f'
                      }}
                    >
                      {this.state.hours +
                        ':' +
                        this.state.minutes +
                        ':' +
                        this.state.seconds}
                    </div>

                    <div
                      className='d-flex justify-content-center'
                      // style={{ marginTop: 10 }}
                    >
                      <Button
                        disabled={this.state.toggle}
                        color='success'
                        size='lg'
                        type='button'
                        onClick={this.handleTimerStart.bind(this)}
                      >
                        start
                      </Button>
                      <Button
                        disabled={!this.state.toggle}
                        color='warning'
                        size='lg'
                        type='button'
                        onClick={this.handleTimerStop.bind(this)}
                      >
                        stop
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </>
      );
  }
}
const mapStateToProps = state => {
  return {
    User: state.User
  };
};
const mapDispatchToProps = {
  setUser,
  breakEnd,
  breakStart
};
export default connect(mapStateToProps, mapDispatchToProps)(Lock);
