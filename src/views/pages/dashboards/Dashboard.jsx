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
// node.js library that concatenates classes (strings)
// import classnames from 'classnames';
// javascipt plugin for creating charts
// import Chart from 'chart.js';
// react plugin used to create charts
// import { Line, Bar } from 'react-chartjs-2';
// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Form,
  // Input,
  // ListGroupItem,
  // ListGroup,
  Media,
  // NavItem,
  // NavLink,
  // Nav,
  Modal,
  // InputGroupAddon,
  // InputGroupText,
  InputGroup,
  FormGroup,
  // Progress,
  Table,
  Container,
  Row,
  Col,
  CardTitle,
  // UncontrolledTooltip,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap';
import ReactDatetime from 'react-datetime';

import { connect } from 'react-redux';
import {
  getBreaks,
  breakStart,
  breakEnd,
  editBreaks,
  setBreaks,
  checkBreaks,
  getEmployeeBreaks,
  getEmployeeBreaksCount,
  getBreaksCount,
  getEmployees,
  logEmployeeBreak,
  deleteEmployeeBreak,
} from '../../../actions/user_actions';
import Select2 from 'react-select2-wrapper';

// core components
import { config } from '../../../siteDetails';
// import CardsHeader from 'components/Headers/CardsHeader.jsx';
import Moment from 'react-moment';
// import { Redirect } from 'react-router-dom';
// import {
//   chartOptions,
//   parseOptions
//   // chartExample1,
//   // chartExample2
// } from 'variables/charts.jsx';
import ReactBSAlert from 'react-bootstrap-sweetalert';
// import { func } from 'prop-types';

// var electron = require('electron');
// var shell = electron.shell;
// // var ipc = electron.ipcRenderer;
// const { ipcRenderer } = window.require('electron');

class Dashboard extends React.Component {
  state = {
    activeNav: 1,
    chartExample1Data: 'data1',
    timerStarted: false,
    timerStopped: true,
    hours: 0,
    minutes: 0,
    seconds: 0,
    // captures: [],
    render: [],
    breakCount: '',
    breaksCount: '',
    check: {},
    toggle: false,
    activePage: 1,
    totalSections: 0,
    startBreaK: '',
    employee: '',
    employees: [],
    endBreak: '',
    activeSection: 0,
    alert: null,
    editDateTime: '',
    id: '',
    type: '',
    user: '',
    countDown: 10,
  };

  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data:
        this.state.chartExample1Data === 'data1' ? 'data2' : 'data1',
    });
  };

  warningAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          warning
          style={{ display: 'block', marginTop: '-100px' }}
          title='Warning'
          showCancel={true}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle='warning'
          cancelBtnBsStyle='success'
          confirmBtnText='Ok'
          cancelBtnText='Cancel'
          btnSize=''
        >
          Error processing request.
        </ReactBSAlert>
      ),
    });
  };
  warningIdleAlert = (data) => {
    this.setState({
      alert: (
        <ReactBSAlert
          warning
          timer={5}
          style={{ display: 'block', marginTop: '-100px' }}
          title='Warning'
          onConfirm={() => this.hideAlert()}
          confirmBtnBsStyle='warning'
          confirmBtnText='Ok'
          btnSize=''
        >
          {data}
        </ReactBSAlert>
      ),
    });
  };

  successAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          success
          style={{ display: 'block', marginTop: '-100px' }}
          title='Success'
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle='success'
          confirmBtnText='Ok'
          btnSize=''
        >
          Success..
        </ReactBSAlert>
      ),
    });
  };

  breakWarningAlert = (id) => {
    this.setState({
      alert: (
        <ReactBSAlert
          warning
          style={{ display: 'block', marginTop: '-100px' }}
          title='Warning'
          showCancel={true}
          onConfirm={() => this.deleteBreak(id)}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle='warning'
          cancelBtnBsStyle='success'
          confirmBtnText='Ok'
          cancelBtnText='Cancel'
          btnSize=''
        >
          Are you sure you want to delete record..
        </ReactBSAlert>
      ),
    });
  };
  deleteBreak = (id) => {
    this.props.deleteEmployeeBreak(id).then((res) => {
      if (res.success === 'OK') {
        this.hideAlert();
        this.breaksCount();
        this.fetchBreaks();
        this.checkBreaks();
        this.successAlert();
      }
    });
  };
  handleTimerStart(e) {
    e.preventDefault();
    this.setState({ toggle: true });
    // window.resizeTo(window.availWidth, window.availHeight);
    var elem = document.getElementById('root');

    /* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen property yet */
    function openFullscreen() {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    }
    openFullscreen();
    if (this.props.User.user.uid) {
      this.props.breakStart(this.props.User.user.uid).then((res) => {
        if (res.success === 'OK') {
          // console.log('start break');
          if (this.state.timerStopped) {
            this.timer = setInterval(() => {
              this.setState({ timerStarted: true, timerStopped: false });
              if (this.state.timerStarted) {
                if (this.state.seconds >= 60) {
                  this.setState((prevState) => ({
                    minutes: prevState.minutes + 1,
                    seconds: 0,
                  }));
                }
                if (this.state.minutes >= 60) {
                  this.setState((prevState) => ({
                    hours: prevState.hours + 1,
                    minutes: 0,
                    seconds: 0,
                  }));
                }
                this.setState((prevState) => ({
                  seconds: prevState.seconds + 1,
                }));
              }
            }, 1000);
          } else {
          }
        }
      });
    }
  }
  handleTimerStop(e) {
    e.preventDefault();
    function closeFullscreen() {
      if (document.exitFullscreen) {
        // console.log('1');
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // console.log('2');
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // console.log('3');
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // console.log('4');
        document.msExitFullscreen();
      }
      // console.log('5');
    }
    closeFullscreen();
    if (this.props.User.user.uid) {
      this.props.breakEnd(this.props.User.user.uid).then((res) => {
        // console.log(res, 'break end');
        if (res.success === 'OK') {
          // console.log('end break');

          this.setState((prevState) => ({
            seconds: 0,
            minutes: 0,
            hours: 0,
            timerStarted: false,
            timerStopped: true,
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
          this.fetchBreaks();
          this.checkBreaks();
          this.setState({ toggle: false });
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
      hours: 0,
    });
    clearInterval(this.timer);
  };
  // handleTimerCapture = () => {
  //   this.setState(prevState => ({
  //     captures: [
  //       ...prevState.captures,
  //       this.state.hours + ':' + this.state.minutes + ':' + this.state.seconds
  //     ]
  //   }));
  // };
  fetchBreaks = () => {
    if (this.props.User.user.role === 'employee') {
      this.props
        .getBreaks(this.props.User.user.uid)
        // .then(res => this.props.setBreaks(res))
        .then((res) => {
          if (res.data) {
            this.setState({ render: res.data });
          }
        });
    } else if (this.props.User.user.role === 'admin') {
      // console.log('admin');
      this.props.getEmployeeBreaks(1, 10).then((res) =>
        // res => console.log(res, 'users breaks')
        {
          if (res === true) {
            console.log('emp data saved in redux');
          } else {
            console.log('emp data not saved in redux');
          }
        }
      );
    } else {
      console.log('no such thing as emp');
    }
  };
  checkBreaks = () => {
    if (this.props.User.user.role === 'employee') {
      this.props.checkBreaks(this.props.User.user.uid).then((res) => {
        if (res.data) {
          // console.log(res.data[0], 'check breaks');
          this.setState({ check: res.data[0] });
        }
      });
    } else {
      console.log('cant check ');
    }
  };
  editBreakStart = (id, user, type) => {
    // console.log(type, 'type1');
    this.setState({
      id: id,
      user: user,
      type: type,
    });
    this.toggleModal('breakFormModal');
  };

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };
  // componentWillMount() {
  //   if (window.Chart) {
  //     parseOptions(Chart, chartOptions());
  //   }
  // }
  breaksCount() {
    // if (this.props.User.user.role == 'employee') {
    //   this.props
    //     .getBreaksCount(this.props.User.user.uid)
    //     // .then(res => this.props.setBreaks(res))
    //     .then(res => {
    //       if (res.data) {
    //         this.setState({ breaksCount: res.data });
    //       } else {
    //         this.setState({ breaksCount: 0 });
    //       }
    //     });
    // } else
    if (this.props.User.user.role === 'admin') {
      // console.log('admin');
      this.props
        .getEmployeeBreaksCount()
        .then((res) =>
          // res => console.log(res, 'users breaks')
          {
            // console.log(res, 'count');
            if (res.data) {
              this.setState({ breaksCount: res.data });
              this.setState({ totalSections: Math.ceil(res.data / 50) });

              // console.log('emp data saved in redux');
            } else {
              this.setState({ breaksCount: 0 });
              this.setState({ totalSections: 0 });
            }
          }
        )
        .catch((err) => console.log(err, 'error fetching data'));
    } else {
      console.log('no such thing as emp count');
    }
  }
  pageCall = (page) => {
    this.setState({ activePage: page });
    // console.log(page, 'page call');
    this.props.getEmployeeBreaks(page, 10).then((res) =>
      // res => console.log(res, 'users breaks')
      {
        if (res === true) {
          console.log('emp data saved in redux');
        } else {
          console.log('emp data not saved in redux');
        }
      }
    );
  };
  sectionIncrementCall = () => {
    const pagesSection = this.state.activeSection + 1;
    if (pagesSection < this.state.totalSections) {
      this.setState({
        activeSection: this.state.activeSection + 1,
      });
    }
  };
  sectionDecrementCall = () => {
    if (this.state.activeSection + 1 > 1) {
      this.setState({
        activeSection: this.state.activeSection - 1,
      });
    }
  };
  hideAlert = () => {
    this.setState({
      alert: null,
    });
  };
  onLogChangeHandler = (e) => {
    this.setState({
      editDateTime: e.format(),
    });
    // console.log(this.state.editDateTime, 'dfsdf');
  };
  onStartBreakLogChangeHandler = (e) => {
    this.setState({
      startBreak: e.format(),
    });
  };
  onEndBreakLogChangeHandler = (e) => {
    this.setState({
      endBreak: e.format(),
    });
  };
  onEmployeeSelect = (e) => {
    const id = e.target.value;
    // console.log(id, 'employee id');
    // let name = e.target.name;
    this.setState({ employee: id });
  };
  onBreakSubmitHandler = (e) => {
    e.preventDefault();
    let { editDateTime, id, user, type } = this.state;
    // console.log(id, type, user, editDateTime, 'type2');
    const data = {
      selected_time: editDateTime,
      user,
      type,
      id,
    };

    this.props.editBreaks(data, type).then((res) => {
      // console.log(data.type, 'type3');
      if (res.success === 'OK') {
        this.successAlert();
        this.breaksCount();

        this.fetchBreaks();
        this.checkBreaks();
      } else {
        this.warningAlert();
      }
      this.setState({
        id: '',
        editDateTime: '',
        user: '',
        breakFormModal: false,
        type: '',
      });
    });
  };
  getEmployeesData = () => {
    this.props.getEmployees().then((res) => {
      if (res) {
        const result = res.data.map((elm) => ({ id: elm._id, text: elm.name }));

        // let result = res.data.map(({ name, _id }) => ({text, id}));
        this.setState({ employees: result });
      } else {
        this.setState({ error: 'error fetching employees' });
      }
    });
  };
  onLogBreakSubmitHandler = (e) => {
    e.preventDefault();
    let { employee, endBreak, startBreak } = this.state;
    // console.log(employee, endBreak, startBreak, 'log break setup');
    const data = {
      break_start: startBreak,
      break_end: endBreak,
      user: employee,
    };

    this.props.logEmployeeBreak(data).then((res) => {
      // console.log(data.type, 'type3');
      if (res.success === 'OK') {
        this.successAlert();
        this.breaksCount();

        this.fetchBreaks();
        this.checkBreaks();
      } else {
        this.warningAlert();
      }
      this.setState({
        employee: '',
        endBreak: '',
        startBreak: '',
        logBreakFormModal: false,
      });
    });
  };
  showAddBreak = () => {
    this.getEmployeesData();

    this.toggleModal('logBreakFormModal');
  };
  componentDidMount() {
    this.breaksCount();
    this.fetchBreaks();
    this.checkBreaks();

    const self = this;
    // ipcMain.on(
    //   'fire',
    //   async(...Params...) => {
    //     try {
    //       sc = new Screenshooter(e.url, e.args);
    //       event.sender.send('status', 'preparing');
    //       await sc.prepare();
    //       await win.webContents.send('status', 'ready');
    //     } catch(e) {
    //       console.log(e);
    //     }
    //   }
    // )
    window.ipcRenderer.on('message', async (event, data) => {
      try {
        console.log('Message received', data);
        if (self.props.location.pathname !== '/admin/dashboard') {
          self.props.history.push('/admin/dashboard');
        }
        self.warningIdleAlert(data.alert);
        window.ipcRenderer.sendSync(
          'logOut',
          'stop monitoring counter started'
        );
        window.ipcRenderer.sendSync('counterStart', 'react start counter');
      } catch (e) {
        console.log(e, 'error ipc');
      }
      // When the message is received...
      // ... change the state of this React component.
      // console.log(self.props.location.pathname, data, 'where am i');
      // self.warningAlert(data.alert);

      // self.props.history.push('/admin/dashboard');
      // if (self.props.location.pathname !== '//admin/dashboard') {
      //   self.props.history.push('/admin/dashboard');
      // }
    });

    window.ipcRenderer.on('initiateBreak', function (event, data) {
      console.log(data.alert);
      window.ipcRenderer.sendSync(
        'counterStop',
        'stop counter to start break '
      );
      if (self.props.location.pathname !== '/auth/lock') {
        self.props.history.push('/auth/lock');

        console.log('if');
      } else {
        console.log('else');
      }
    });
    window.ipcRenderer.on('breakAvoided', function (event, data) {
      console.log(data.alert);
      window.ipcRenderer.sendSync('counterStop', 'counter stopped by user');
      window.ipcRenderer.sendSync('logIn', 'start tracking again..');
      self.setState({ alert: null });
    });

    // const self = this;
    // window.ipcRenderer.on('message', function(event, data) {
    //   // When the message is received...
    //   console.log('Message received', data.alert);
    //   // ... change the state of this React component.
    //   // console.log(self.props.location.pathname, 'where am i');
    //   // self.props.history.push('/auth/lock');
    //   // self.warningAlert(data.alert);

    // if (self.props.location.pathname !== '/auth/lock') {
    //   self.props.history.push('/auth/lock');

    //   console.log('if');
    // } else {
    //   console.log('could not be redirected ');
    // }
    //   // console.log(data.alert, 'data log idle');
    //   // if (data.alert !== 'undefined') {
    //   // }

    //   // self.setState({ alert: data.alert });
    // });
  }

  render() {
    const breaks = this.state.render;
    const check = this.state.check;
    const pages = Math.ceil(this.state.breaksCount / 10);

    const pagesFunction = () => {
      let t = [];
      if (this.state.totalSections <= 1) {
        for (let i = 1; i <= pages; i++) {
          if (i === this.state.activePage) {
            t.push(
              <PaginationItem key={i} className='active'>
                <PaginationLink onClick={() => this.pageCall(i)}>
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          } else {
            t.push(
              <PaginationItem key={i}>
                <PaginationLink onClick={() => this.pageCall(i)}>
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      } else if (this.state.activeSection + 1 < this.state.totalSections) {
        const count = this.state.activeSection * 5;
        for (let i = count + 1; i <= count + 5; i++) {
          if (i === this.state.activePage) {
            t.push(
              <PaginationItem key={i} className='active'>
                <PaginationLink onClick={() => this.pageCall(i)}>
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          } else {
            t.push(
              <PaginationItem key={i}>
                <PaginationLink onClick={() => this.pageCall(i)}>
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      } else if (this.state.activeSection + 1 === this.state.totalSections) {
        const count = this.state.activeSection * 5;
        for (let i = count + 1; i <= pages; i++) {
          if (i === this.state.activePage) {
            t.push(
              <PaginationItem key={i} className='active'>
                <PaginationLink onClick={() => this.pageCall(i)}>
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          } else {
            t.push(
              <PaginationItem key={i}>
                <PaginationLink onClick={() => this.pageCall(i)}>
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      return t;
    };
    // if (this.props.User.auth.message !== 'valid') {
    //   // console.log(redirect, 'redirect');
    //   return <Redirect to='/auth/login' />;
    // } else
    return (
      <>
        {this.state.alert}
        <Modal
          className='modal-dialog-centered'
          size='sm'
          isOpen={this.state.breakFormModal}
          toggle={() => this.toggleModal('breakFormModal')}
        >
          <div className='modal-body p-0'>
            <Card className='bg-secondary border-0 mb-0'>
              <CardBody className='px-lg-5 py-lg-5'>
                <div className='text-center text-muted mb-4'>
                  <small>Breaks Edit Form</small>
                </div>
                <Form role='form' onSubmit={this.onBreakSubmitHandler}>
                  <FormGroup>
                    <InputGroup>
                      <ReactDatetime
                        inputProps={{
                          placeholder: 'Date-Time Picker',
                        }}
                        // value={this.state.editDateTime}
                        onChange={this.onLogChangeHandler}
                        timeFormat={true}
                        // closeOnSelect={true}
                      />
                    </InputGroup>
                  </FormGroup>

                  <div className='text-center'>
                    <Button className='my-4' color='primary' type='submit'>
                      Confirm Details
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Modal>

        <Modal
          className='modal-dialog-centered'
          size='sm'
          isOpen={this.state.logBreakFormModal}
          toggle={() => this.toggleModal('logBreakFormModal')}
        >
          <div className='modal-body p-0'>
            <Card className='bg-secondary border-0 mb-0'>
              <CardBody className='px-lg-5 py-lg-5'>
                <div className='text-center text-muted mb-4'>
                  <small>Log Employee Break:</small>
                </div>
                {/* <Form role='form' onSubmit={this.onLogBreakSubmitHandler}> */}
                <Form role='form' onSubmit={this.onLogBreakSubmitHandler}>
                  <FormGroup>
                    <Select2
                      className='form-control'
                      // defaultValue='1'
                      value={this.state.employee}
                      name='employee'
                      options={{
                        placeholder: 'Select Employee',
                      }}
                      data={this.state.employees}
                      onClose={this.onEmployeeSelect}
                    />
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <ReactDatetime
                        inputProps={{
                          placeholder: 'Start Date-Time Picker',
                        }}
                        // value={this.state.editDateTime}
                        onChange={this.onStartBreakLogChangeHandler}
                        timeFormat={true}
                        // closeOnSelect={true}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <ReactDatetime
                        inputProps={{
                          placeholder: 'End Date-Time Picker',
                        }}
                        // value={this.state.editDateTime}
                        onChange={this.onEndBreakLogChangeHandler}
                        timeFormat={true}
                        // closeOnSelect={true}
                      />
                    </InputGroup>
                  </FormGroup>

                  <div className='text-center'>
                    <Button className='my-4' color='primary' type='submit'>
                      Confirm Details
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Modal>
        <div className='header bg-info pb-4'>
          <div className='d-flex justify-content-left'>
            <span
              className='text-nowrap font-weight-200 text-bg'
              style={{ color: 'white', fontSize: 22 }}
            >
              &nbsp;&nbsp;Welcome,&nbsp;{this.props.User.user.name}
            </span>
          </div>
          {/* <div
              className='d-flex justify-content-center'
              style={{
                fontSize: 150,
                color: 'white'
              }}
            >
              {this.state.hours +
                ':' +
                this.state.minutes +
                ':' +
                this.state.seconds}
            </div> */}
          {this.props.User.user.role !== 'admin' ? (
            <div
              className='d-flex justify-content-center'
              // style={{ marginTop: 10 }}
            >
              <video
                // width='800'
                height='400'
                controls={false}
                style={{ borderRadius: '20px' }}
                autoPlay
                loop
              >
                <source
                  src='https://assets.toggl.com/images/videos/signup/signup-f8d7f2302c6a943565f6f5f8bb54f0bf.mp4'
                  type='video/mp4'
                />
              </video>
            </div>
          ) : (
            <div
              className='d-flex justify-content-center'
              // style={{ marginTop: 10 }}
            >
              <video
                // width='800'
                height='400'
                controls={false}
                style={{ borderRadius: '20px' }}
                autoPlay
                loop
              >
                <source
                  src='https://assets.toggl.com/images/videos/home/homepage-037e438fea09159b763706293864d262.mp4'
                  type='video/mp4'
                />
              </video>
            </div>
          )}
          <div
            className='d-flex justify-content-center'
            style={{ marginTop: 10 }}
            // style={{ marginTop: 10 }}
          >
            <Button
              disabled={this.state.toggle}
              color='success'
              size='lg'
              type='button'
              onClick={() => this.props.history.push('/auth/lock')}
            >
              Log your break
            </Button>
          </div>{' '}
          <Container fluid>
            <Row className='align-items-center py-4'>
              {this.props.User.user.role !== 'admin' && check ? (
                <Col md='6' xl='3'>
                  <Card className='card-stats'>
                    <CardBody>
                      <Row>
                        <div className='col'>
                          <CardTitle
                            tag='h5'
                            className='text-uppercase text-muted mb-0'
                          >
                            Breaks Details:
                          </CardTitle>
                          <span className='h4 font-weight-bold mb-0'>
                            You have taken {check.count} breaks total time:{' '}
                            {(check.total_time / 60).toFixed(1)}
                            minutes
                          </span>
                          {check.total_time >= 3600 ? (
                            <span> Your breaks are over..</span>
                          ) : (
                            ''
                          )}
                        </div>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              ) : (
                ''
              )}
            </Row>

            <Row className='align-items-center py-4'>
              {breaks
                ? breaks.map((item, index) => {
                    return (
                      <Col md='6' xl='3' key={index}>
                        <Card className='card-stats'>
                          <CardBody>
                            <Row>
                              <div className='col'>
                                <CardTitle
                                  tag='h5'
                                  className='text-uppercase text-muted mb-0'
                                >
                                  Break Start:
                                </CardTitle>
                                <span className='h4 font-weight-bold mb-0'>
                                  <Moment format='DD/MM/YYYY (HH:mm)'>
                                    {item.break_start}
                                  </Moment>
                                </span>
                                <CardTitle
                                  tag='h5'
                                  className='text-uppercase text-muted mb-0'
                                >
                                  Break End:
                                </CardTitle>
                                <span className='h4 font-weight-bold mb-0'>
                                  {item.break_end ? (
                                    <Moment format='DD/MM/YYYY  (HH:mm)'>
                                      {item.break_end}
                                    </Moment>
                                  ) : (
                                    '-NA-'
                                  )}
                                </span>
                              </div>
                              <Col className='col-auto'>
                                <div className='icon icon-shape bg-gradient-red text-white rounded-circle shadow'>
                                  <i className='ni ni-active-40' />
                                </div>
                              </Col>
                            </Row>
                            <p className='mt-3 mb-0 text-sm'>
                              <span className='text-success mr-2'>
                                <i className='fa fa-arrow-up' />{' '}
                                {Math.round(item.total_time / 60)} minutes
                              </span>{' '}
                              <span className='text-nowrap'>
                                break duration
                              </span>
                            </p>
                          </CardBody>
                        </Card>
                      </Col>
                    );
                  })
                : ''}
            </Row>
          </Container>
          {/* {this.state.captures.map((time, index) => {
            return (
              <div>
                {index + 1}

                {'break duration'}
                {':'}
                {time}
              </div>
            );
          })} */}
          {/* <button type='button' onClick={this.handleTimerCapture.bind(this)}>
            capture time
          </button>
          <button type='button' onClick={this.handleTimerReset.bind(this)}>
            Reset
          </button> */}
        </div>

        {/* <CardsHeader name='BREAK START' parentName='Dashboards' /> */}
        <Container className='mt--6' fluid>
          {this.props.User.user.role === 'admin' ? (
            <Row>
              <Col xl='12'>
                <Row>
                  <div className='col'>
                    <Card>
                      <CardHeader className='border-0'>
                        <h3 className='mb-0'>Employee Breaks Sheet</h3>
                        <Button
                          color='success'
                          size='sm'
                          type='button'
                          className='float-right'
                          onClick={() => {
                            this.showAddBreak();
                          }}
                        >
                          Add Employee Break
                        </Button>
                      </CardHeader>
                      <Table
                        className='align-items-center table-flush'
                        responsive
                      >
                        <thead className='thead-light'>
                          <tr>
                            <th className='sort' data-sort='name' scope='col'>
                              Employee
                            </th>
                            <th className='sort' data-sort='budget' scope='col'>
                              Break-Start
                            </th>
                            <th className='sort' data-sort='budget' scope='col'>
                              Break-End
                            </th>
                            <th className='sort' data-sort='status' scope='col'>
                              Total-time
                            </th>
                            <th scope='col'>Status</th>
                            <th scope='col'></th>
                            {/* <th
                            className='sort'
                            data-sort='completion'
                            scope='col'
                          >
                            Completion
                          </th> */}
                            <th scope='col' />
                          </tr>
                        </thead>
                        <tbody className='list'>
                          {this.props.User.employeesData.map((item, index) => (
                            <tr key={index}>
                              <th scope='row'>
                                <Media className='align-items-center'>
                                  <a
                                    className='avatar rounded-circle mr-3'
                                    href='#pablo'
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <img
                                      alt='...'
                                      src={
                                        item.user.profile
                                          ? config.imageUrl +
                                            '/timetracker/profiles/' +
                                            item.user.profile
                                          : require('assets/img/theme/bootstrap.jpg')
                                      }
                                    />
                                  </a>

                                  <span className='name mb-0 text-sm'>
                                    {item.user.name}
                                  </span>
                                </Media>
                              </th>
                              <td className='budget'>
                                <Moment format='DD/MM/YYYY  (HH:mm)'>
                                  {item.break_start}
                                </Moment>
                              </td>
                              <td className='budget'>
                                {item.break_end ? (
                                  <Moment format='DD/MM/YYYY  (HH:mm)'>
                                    {item.break_end}
                                  </Moment>
                                ) : (
                                  'On a break'
                                )}
                              </td>
                              <td className='budget'>
                                {item.total_time === 0
                                  ? '...'
                                  : Math.round(item.total_time / 60)}
                                min
                              </td>

                              <td>
                                <Badge className='badge-dot mr-4' color=''>
                                  <i
                                    className={
                                      item.status === 'End'
                                        ? 'bg-warning'
                                        : 'bg-success'
                                    }
                                  />
                                  <span className='status'>{item.status}</span>
                                </Badge>
                              </td>
                              {/* <td>
                              <div className='avatar-group'>
                                <a
                                  className='avatar avatar-sm rounded-circle'
                                  href='#pablo'
                                  id='tooltip792717700'
                                  onClick={e => e.preventDefault()}
                                >
                                  <img
                                    alt='...'
                                    src={require('assets/img/theme/team-1.jpg')}
                                  />
                                </a>
                                <UncontrolledTooltip
                                  delay={0}
                                  target='tooltip792717700'
                                >
                                  Ryan Tompson
                                </UncontrolledTooltip>
                                <a
                                  className='avatar avatar-sm rounded-circle'
                                  href='#pablo'
                                  id='tooltip654289872'
                                  onClick={e => e.preventDefault()}
                                >
                                  <img
                                    alt='...'
                                    src={require('assets/img/theme/team-2.jpg')}
                                  />
                                </a>
                                <UncontrolledTooltip
                                  delay={0}
                                  target='tooltip654289872'
                                >
                                  Romina Hadid
                                </UncontrolledTooltip>
                                <a
                                  className='avatar avatar-sm rounded-circle'
                                  href='#pablo'
                                  id='tooltip409131762'
                                  onClick={e => e.preventDefault()}
                                >
                                  <img
                                    alt='...'
                                    src={require('assets/img/theme/team-3.jpg')}
                                  />
                                </a>
                                <UncontrolledTooltip
                                  delay={0}
                                  target='tooltip409131762'
                                >
                                  Alexander Smith
                                </UncontrolledTooltip>
                                <a
                                  className='avatar avatar-sm rounded-circle'
                                  href='#pablo'
                                  id='tooltip50788433'
                                  onClick={e => e.preventDefault()}
                                >
                                  <img
                                    alt='...'
                                    src={require('assets/img/theme/team-4.jpg')}
                                  />
                                </a>
                                <UncontrolledTooltip
                                  delay={0}
                                  target='tooltip50788433'
                                >
                                  Jessica Doe
                                </UncontrolledTooltip>
                              </div>
                            </td>*/}
                              {/* <td>
                              <div className='d-flex align-items-center'>
                                <span className='completion mr-2'>60%</span>
                                <div>
                                  <Progress
                                    max='100'
                                    value='60'
                                    color='warning'
                                  />
                                </div>
                              </div>
                            </td>
                            */}
                              <td className='text-right'>
                                <UncontrolledDropdown>
                                  <DropdownToggle
                                    color=''
                                    size='sm'
                                    className='btn-icon-only text-light'
                                  >
                                    <i className='fas fa-ellipsis-v' />
                                  </DropdownToggle>
                                  <DropdownMenu
                                    className='dropdown-menu-arrow'
                                    right
                                  >
                                    <DropdownItem
                                      // href='#pablo'
                                      onClick={() => {
                                        this.editBreakStart(
                                          item._id,
                                          item.user._id,
                                          'start'
                                        );
                                      }}
                                    >
                                      Break Start
                                    </DropdownItem>

                                    <DropdownItem
                                      // href='#pablo'
                                      onClick={() => {
                                        this.editBreakStart(
                                          item._id,
                                          item.user._id,

                                          'end'
                                        );
                                      }}
                                    >
                                      Break End
                                    </DropdownItem>
                                    <DropdownItem
                                      // href='#pablo'
                                      onClick={() =>
                                        this.breakWarningAlert(item._id)
                                      }
                                    >
                                      Break Delete
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <CardFooter className='py-4'>
                        <nav aria-label='...'>
                          <Pagination
                            className='pagination justify-content-end mb-0'
                            listClassName='justify-content-end mb-0'
                          >
                            <PaginationItem>
                              <PaginationLink
                                // href='#pablo'
                                onClick={() => this.sectionDecrementCall()}
                                // tabIndex='-1'
                              >
                                <i className='fas fa-angle-left' />
                                <span className='sr-only'>Previous</span>
                              </PaginationLink>
                            </PaginationItem>
                            {pagesFunction()}

                            <PaginationItem>
                              <PaginationLink
                                // href='#pablo'
                                onClick={() => this.sectionIncrementCall()}
                              >
                                <i className='fas fa-angle-right' />
                                <span className='sr-only'>Next</span>
                              </PaginationLink>
                            </PaginationItem>
                          </Pagination>
                        </nav>
                      </CardFooter>
                    </Card>
                  </div>
                </Row>
              </Col>
            </Row>
          ) : (
            <CardFooter className='py-4'>
              <Card></Card>
            </CardFooter>
          )}

          {/* <Row style={{ marginTop: 50 }}>
              <Col xl='4'>
                <Card>
                  <CardHeader>
                    <h5 className='h3 mb-0'>Team members</h5>
                  </CardHeader>

                  <CardBody>
                    <ListGroup className='list my--3' flush>
                      <ListGroupItem className='px-0'>
                        <Row className='align-items-center'>
                          <Col className='col-auto'>
                            <a
                              className='avatar rounded-circle'
                              href='#pablo'
                              onClick={e => e.preventDefault()}
                            >
                              <img
                                alt='...'
                                src={require('assets/img/theme/team-1.jpg')}
                              />
                            </a>
                          </Col>
                          <div className='col ml--2'>
                            <h4 className='mb-0'>
                              <a
                                href='#pablo'
                                onClick={e => e.preventDefault()}
                              >
                                John Michael
                              </a>
                            </h4>
                            <span className='text-success'>●</span>{' '}
                            <small>Online</small>
                          </div>
                          <Col className='col-auto'>
                            <Button color='primary' size='sm' type='button'>
                              Add
                            </Button>
                          </Col>
                        </Row>
                      </ListGroupItem>
                      <ListGroupItem className='px-0'>
                        <Row className='align-items-center'>
                          <Col className='col-auto'>
                            <a
                              className='avatar rounded-circle'
                              href='#pablo'
                              onClick={e => e.preventDefault()}
                            >
                              <img
                                alt='...'
                                src={require('assets/img/theme/team-2.jpg')}
                              />
                            </a>
                          </Col>
                          <div className='col ml--2'>
                            <h4 className='mb-0'>
                              <a
                                href='#pablo'
                                onClick={e => e.preventDefault()}
                              >
                                Alex Smith
                              </a>
                            </h4>
                            <span className='text-warning'>●</span>{' '}
                            <small>In a meeting</small>
                          </div>
                          <Col className='col-auto'>
                            <Button color='primary' size='sm' type='button'>
                              Add
                            </Button>
                          </Col>
                        </Row>
                      </ListGroupItem>
                      <ListGroupItem className='px-0'>
                        <Row className='align-items-center'>
                          <Col className='col-auto'>
                            <a
                              className='avatar rounded-circle'
                              href='#pablo'
                              onClick={e => e.preventDefault()}
                            >
                              <img
                                alt='...'
                                src={require('assets/img/theme/team-3.jpg')}
                              />
                            </a>
                          </Col>
                          <div className='col ml--2'>
                            <h4 className='mb-0'>
                              <a
                                href='#pablo'
                                onClick={e => e.preventDefault()}
                              >
                                Samantha Ivy
                              </a>
                            </h4>
                            <span className='text-danger'>●</span>{' '}
                            <small>Offline</small>
                          </div>
                          <Col className='col-auto'>
                            <Button color='primary' size='sm' type='button'>
                              Add
                            </Button>
                          </Col>
                        </Row>
                      </ListGroupItem>
                      <ListGroupItem className='px-0'>
                        <Row className='align-items-center'>
                          <Col className='col-auto'>
                            <a
                              className='avatar rounded-circle'
                              href='#pablo'
                              onClick={e => e.preventDefault()}
                            >
                              <img
                                alt='...'
                                src={require('assets/img/theme/team-4.jpg')}
                              />
                            </a>
                          </Col>
                          <div className='col ml--2'>
                            <h4 className='mb-0'>
                              <a
                                href='#pablo'
                                onClick={e => e.preventDefault()}
                              >
                                John Michael
                              </a>
                            </h4>
                            <span className='text-success'>●</span>{' '}
                            <small>Online</small>
                          </div>
                          <Col className='col-auto'>
                            <Button color='primary' size='sm' type='button'>
                              Add
                            </Button>
                          </Col>
                        </Row>
                      </ListGroupItem>
                    </ListGroup>
                  </CardBody>
                </Card>
              </Col>
              <Col xl='4'>
                <Card>
                  <CardHeader>
                    <h5 className='h3 mb-0'>To do list</h5>
                  </CardHeader>

                  <CardBody className='p-0'>
                    <ListGroup data-toggle='checklist' flush>
                      <ListGroupItem className='checklist-entry flex-column align-items-start py-4 px-4'>
                        <div className='checklist-item checklist-item-success checklist-item-checked'>
                          <div className='checklist-info'>
                            <h5 className='checklist-title mb-0'>
                              Call with Dave
                            </h5>
                            <small>10:30 AM</small>
                          </div>
                          <div>
                            <div className='custom-control custom-checkbox custom-checkbox-success'>
                              <input
                                className='custom-control-input'
                                defaultChecked
                                id='chk-todo-task-1'
                                type='checkbox'
                              />
                              <label
                                className='custom-control-label'
                                htmlFor='chk-todo-task-1'
                              />
                            </div>
                          </div>
                        </div>
                      </ListGroupItem>
                      <ListGroupItem className='checklist-entry flex-column align-items-start py-4 px-4'>
                        <div className='checklist-item checklist-item-warning'>
                          <div className='checklist-info'>
                            <h5 className='checklist-title mb-0'>
                              Lunch meeting
                            </h5>
                            <small>10:30 AM</small>
                          </div>
                          <div>
                            <div className='custom-control custom-checkbox custom-checkbox-warning'>
                              <input
                                className='custom-control-input'
                                id='chk-todo-task-2'
                                type='checkbox'
                              />
                              <label
                                className='custom-control-label'
                                htmlFor='chk-todo-task-2'
                              />
                            </div>
                          </div>
                        </div>
                      </ListGroupItem>
                      <ListGroupItem className='checklist-entry flex-column align-items-start py-4 px-4'>
                        <div className='checklist-item checklist-item-info'>
                          <div className='checklist-info'>
                            <h5 className='checklist-title mb-0'>
                              Argon Dashboard Launch
                            </h5>
                            <small>10:30 AM</small>
                          </div>
                          <div>
                            <div className='custom-control custom-checkbox custom-checkbox-info'>
                              <input
                                className='custom-control-input'
                                id='chk-todo-task-3'
                                type='checkbox'
                              />
                              <label
                                className='custom-control-label'
                                htmlFor='chk-todo-task-3'
                              />
                            </div>
                          </div>
                        </div>
                      </ListGroupItem>
                      <ListGroupItem className='checklist-entry flex-column align-items-start py-4 px-4'>
                        <div className='checklist-item checklist-item-danger checklist-item-checked'>
                          <div className='checklist-info'>
                            <h5 className='checklist-title mb-0'>
                              Winter Hackaton
                            </h5>
                            <small>10:30 AM</small>
                          </div>
                          <div>
                            <div className='custom-control custom-checkbox custom-checkbox-danger'>
                              <input
                                className='custom-control-input'
                                defaultChecked
                                id='chk-todo-task-4'
                                type='checkbox'
                              />
                              <label
                                className='custom-control-label'
                                htmlFor='chk-todo-task-4'
                              />
                            </div>
                          </div>
                        </div>
                      </ListGroupItem>
                    </ListGroup>
                  </CardBody>
                </Card>
              </Col>
              <Col xl='4'>
                <Card>
                  <CardHeader>
                    <h5 className='h3 mb-0'>Progress track</h5>
                  </CardHeader>

                  <CardBody>
                    <ListGroup className='list my--3' flush>
                      <ListGroupItem className='px-0'>
                        <Row className='align-items-center'>
                          <Col className='col-auto'>
                            <a
                              className='avatar rounded-circle'
                              href='#pablo'
                              onClick={e => e.preventDefault()}
                            >
                              <img
                                alt='...'
                                src={require('assets/img/theme/bootstrap.jpg')}
                              />
                            </a>
                          </Col>
                          <div className='col'>
                            <h5>Argon Design System</h5>
                            <Progress
                              className='progress-xs mb-0'
                              color='orange'
                              max='100'
                              value='60'
                            />
                          </div>
                        </Row>
                      </ListGroupItem>
                      <ListGroupItem className='px-0'>
                        <Row className='align-items-center'>
                          <Col className='col-auto'>
                            <a
                              className='avatar rounded-circle'
                              href='#pablo'
                              onClick={e => e.preventDefault()}
                            >
                              <img
                                alt='...'
                                src={require('assets/img/theme/angular.jpg')}
                              />
                            </a>
                          </Col>
                          <div className='col'>
                            <h5>Angular Now UI Kit PRO</h5>
                            <Progress
                              className='progress-xs mb-0'
                              color='success'
                              max='100'
                              value='100'
                            />
                          </div>
                        </Row>
                      </ListGroupItem>
                      <ListGroupItem className='px-0'>
                        <Row className='align-items-center'>
                          <Col className='col-auto'>
                            <a
                              className='avatar rounded-circle'
                              href='#pablo'
                              onClick={e => e.preventDefault()}
                            >
                              <img
                                alt='...'
                                src={require('assets/img/theme/sketch.jpg')}
                              />
                            </a>
                          </Col>
                          <div className='col'>
                            <h5>Black Dashboard</h5>
                            <Progress
                              className='progress-xs mb-0'
                              color='danger'
                              max='100'
                              value='72'
                            />
                          </div>
                        </Row>
                      </ListGroupItem>
                      <ListGroupItem className='px-0'>
                        <Row className='align-items-center'>
                          <Col className='col-auto'>
                            <a
                              className='avatar rounded-circle'
                              href='#pablo'
                              onClick={e => e.preventDefault()}
                            >
                              <img
                                alt='...'
                                src={require('assets/img/theme/react.jpg')}
                              />
                            </a>
                          </Col>
                          <div className='col'>
                            <h5>React Material Dashboard</h5>
                            <Progress
                              className='progress-xs mb-0'
                              color='info'
                              max='100'
                              value='90'
                            />
                          </div>
                        </Row>
                      </ListGroupItem>
                    </ListGroup>
                  </CardBody>
                </Card>
              </Col>
            </Row> */}
        </Container>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    User: state.User,
  };
};
const mapDispatchToProps = {
  getBreaks,
  breakStart,
  breakEnd,
  setBreaks,
  checkBreaks,
  getEmployeeBreaks,
  getEmployeeBreaksCount,
  getBreaksCount,
  editBreaks,
  getEmployees,
  logEmployeeBreak,
  deleteEmployeeBreak,
};
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
