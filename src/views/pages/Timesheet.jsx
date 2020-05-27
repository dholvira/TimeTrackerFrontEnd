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

// reactstrap components
import {
  // Badge,
  Button,
  Card,
  CardHeader,
  // CardFooter,
  // DropdownMenu,
  // DropdownItem,
  // DropdownToggle,
  // UncontrolledDropdown,
  // Media,
  // Pagination,
  // PaginationItem,
  // PaginationLink,
  // Progress,
  // Table,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Form,
  Modal,
  CardBody,
  Container,
  Row,
  Col,
  FormGroup
  // UncontrolledTooltip
} from 'reactstrap';
// core components
import SimpleHeader from 'components/Headers/SimpleHeader.jsx';
import { connect } from 'react-redux';
import {
  getMyBreaks,
  getBreaksCount,
  addReason,
  editLogs
} from '../../actions/user_actions';
import Loader from 'react-loader-spinner';
// import moment from 'moment-timezone';

import Moment from 'react-moment';
import ReactDatetime from 'react-datetime';
import moment from 'moment';
import { config } from '../../siteDetails';
import axios from 'axios';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import classnames from 'classnames';

const $ = require('jquery');
require('jszip');
require('pdfmake');
require('pdfmake/build/vfs_fonts.js');
$.DataTable = require('datatables.net-dt');
require('datatables.net-buttons-dt');
require('datatables.net-buttons/js/buttons.flash.js');
require('datatables.net-buttons/js/buttons.html5.js');
require('datatables.net-buttons/js/buttons.print.js');
require('datatables.net-responsive-dt');
require('datatables.net-select-dt');

class TimeSheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNav: 1,
      breaksCount: '',
      toggle: false,
      activePage: 1,
      totalSections: 0,
      activeSection: 0,
      date: '',
      data: [],
      editDateTime: '',
      table: {},
      formModal: false,
      logFormModal: false,
      reason: '',
      id: '',
      notifyAlert: null,
      loading: false,
      type: ''
    };
    this.handleDate = this.handleDate.bind(this);
  }
  searchHandler = () => {
    this.state.table.destroy();
    this.fetchMyData();
  };
  toggleModal = state => {
    this.setState({
      [state]: !this.state[state]
    });
  };
  fetchMyData() {
    const data = {
      selected_date: this.state.date
    };
    if (this.props.User.user.role !== 'admin') {
      data.uid = this.props.User.user.uid;
    }
    axios({
      method: 'POST',
      url: `${config.serverUrl}history/getAll`,
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.authToken
      },
      data: data
    })
      .then(response => {
        this.setState({ data: response.data.data });
        // console.log(this.state.allPayments, "allPayments")
        const tbobj = $('#example').DataTable({
          //  lengthMenu: [[10, 25, 50, -1], [20, 30, 50, "All"]],
          pageLength: 20,
          columnDefs: [
            {
              targets: 0,
              orderable: false
            }
          ],
          pagingType: 'full_numbers',
          responsive: true,
          dom: 'Bfrtip',
          buttons: [
            {
              extend: 'copy',
              title: 'Report'
            },
            // {
            //   extend: 'print',
            //   title: 'Payments'
            // },
            {
              extend: 'csv',
              title: 'Report'
            }
          ]
        });
        this.setState({ table: tbobj });
      })
      .catch(err => {
        console.log(err);
      });
  }
  loginLogout = (id, type) => {
    this.setState({
      id: id,
      type: type
    });
    this.toggleModal('logFormModal');
  };
  handleDate(date) {
    this.setState({ date: moment(date).format('YYYY-MM-DD') });
  }
  addReason = id => {
    this.setState({ id: id });
    this.toggleModal('formModal');
  };

  onChangeHandler = e => {
    let name = e.target.name;
    this.setState({ [name]: e.target.value });
  };
  onLogChangeHandler = e => {
    this.setState({
      editDateTime: e.format()
    });
    // console.log(this.state.editDateTime, 'dfsdf');
  };
  successAlert = () => {
    this.setState({
      notifyAlert: (
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
      )
    });
  };
  warningAlert = () => {
    this.setState({
      notifyAlert: (
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
      )
    });
  };
  sendMyMail = () =>
    axios({
      method: 'GET',
      url: `${config.serverUrl}history/mail2`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        this.setState({ loading: false });
        this.successAlert();
      })
      .catch(err => console.log(err, 'error sending mai222l'));
  sendReport = () => {
    const data = {
      selected_date: this.state.date
    };

    axios({
      method: 'POST',
      url: `${config.serverUrl}history/mail`,
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.authToken
      },
      data: data
    })
      .then(async response => {
        if (response.data.success === 'OK') {
          this.setState({ loading: true });
          await setTimeout(() => {
            this.sendMyMail();
            // Timeout Logic
          }, 5000);
          console.log('fdsdfsdfsd');
        } else {
          this.warningAlert();
        }
      })
      .catch(err => console.log(err, 'error sending mail'));
  };
  onSubmitHandler = e => {
    e.preventDefault();
    let { reason, id } = this.state;
    // console.log(email, password, 'input');
    const data = {
      reason: reason,
      id: id
    };
    this.props.addReason(data).then(res => {
      // console.log(res, 'user added');
      if (res.success === 'OK') {
        this.setState({
          reason: '',
          id: '',
          formModal: false
        });
        this.successAlert();
        this.state.table.destroy();
        this.fetchMyData();
      } else {
        this.setState({
          reason: '',
          id: '',
          formModal: false
        });
        this.warningAlert();
      }
    });
  };
  onLogSubmitHandler = e => {
    e.preventDefault();
    let { editDateTime, id, type } = this.state;
    // console.log(email, password, 'input');
    const data = {
      selected_time: editDateTime,
      id
    };
    this.props.editLogs(data, type).then(res => {
      // console.log(res, 'user added');
      if (res.success === 'OK') {
        this.successAlert();
        this.state.table.destroy();
        this.fetchMyData();
      } else {
        this.warningAlert();
      }
      this.setState({
        id: '',
        editDateTime: '',
        logFormModal: false,
        type: ''
      });
    });
  };
  hideAlert = () => {
    this.setState({
      notifyAlert: null
    });
  };
  componentDidMount() {
    this.fetchMyData();
  }
  render() {
    const timesheetList = this.state.data;
    const tblrow = (item, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.total_time}</td>
          <td>{item.user.name}</td>
          <td>{item.user.email}</td>
          <td>
            <Moment format='YYYY-MM-DD HH:mm:ss'>{item.logged_in}</Moment>
          </td>
          <td>
            {item.logged_out ? (
              <Moment format='YYYY-MM-DD HH:mm:ss'>{item.logged_out}</Moment>
            ) : (
              'Not Logged Out'
            )}
          </td>
          <td>
            {item.reason ? <p>{item.reason}</p> : ''}
            <Button
              className='btn-icon-only rounded-circle'
              color='warning'
              type='button'
              title='Add Reason'
              onClick={() => {
                this.addReason(item._id);
              }}
            >
              <span className='btn-inner--icon'>
                <i className='ni ni-fat-add' />
              </span>
            </Button>
          </td>
          <td>
            {this.props.User.user.role === 'admin' ? (
              <Row>
                <Button
                  className='btn-icon-only rounded-circle'
                  color='success'
                  title='Login'
                  type='button'
                  onClick={() => {
                    this.loginLogout(item._id, 'login');
                  }}
                >
                  <span className='btn-inner--icon'>
                    <i className='ni ni-button-play' />
                  </span>
                </Button>
                <Button
                  className='btn-icon-only rounded-circle'
                  title='Logout'
                  color='primary'
                  type='button'
                  onClick={() => {
                    this.loginLogout(item._id, 'logout');
                  }}
                >
                  <span className='btn-inner--icon'>
                    <i className='ni ni-button-pause' />
                  </span>
                </Button>
              </Row>
            ) : (
              ''
            )}
          </td>

          {/* <td><Moment format="YYYY-MM-DD HH:mm:ss">{item.user.updatedAt}</Moment></td> */}
        </tr>
      );
    };
    // #7CCA0B
    return (
      <>
        {this.state.notifyAlert}
        <Modal
          className='modal-dialog-centered'
          size='sm'
          isOpen={this.state.logFormModal}
          toggle={() => this.toggleModal('logFormModal')}
        >
          <div className='modal-body p-0'>
            <Card className='bg-secondary border-0 mb-0'>
              <CardBody className='px-lg-5 py-lg-5'>
                <div className='text-center text-muted mb-4'>
                  <small>Logs Edit Form</small>
                </div>
                <Form role='form' onSubmit={this.onLogSubmitHandler}>
                  {/* <FormGroup
                    className={classnames('mb-3', {
                      focused: this.state.focusedEmail
                    })}
                  >
                    <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-single-02' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='Reason'
                        type='text'
                        name='reason'
                        value={this.state.reason}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup> */}
                  <FormGroup>
                    <InputGroup>
                      <ReactDatetime
                        inputProps={{
                          placeholder: 'Start Date Picker'
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
          isOpen={this.state.formModal}
          toggle={() => this.toggleModal('formModal')}
        >
          <div className='modal-body p-0'>
            <Card className='bg-secondary border-0 mb-0'>
              <CardBody className='px-lg-5 py-lg-5'>
                <div className='text-center text-muted mb-4'>
                  <small>Submit Reason</small>
                </div>
                <Form role='form' onSubmit={this.onSubmitHandler}>
                  <FormGroup
                    className={classnames('mb-3', {
                      focused: this.state.focusedEmail
                    })}
                  >
                    <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-single-02' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='Reason'
                        type='text'
                        name='reason'
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>

                  <div className='text-center'>
                    <Button className='my-4' color='primary' type='submit'>
                      Add Reason
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Modal>

        <SimpleHeader name='Tables' parentName='Tables' />
        <Container className='mt--6' fluid>
          {/* {this.props.User.user.role == 'employee' ? ( */}
          <Row>
            <div className='col'>
              <Card>
                <CardHeader className='border-0'>
                  <h3 className='mb-0'>Daily Logs:</h3>
                </CardHeader>
                <Row style={{ marginLeft: 20 }}>
                  <Col md='4'>
                    <FormGroup>
                      <ReactDatetime
                        inputProps={{
                          placeholder: 'Date Picker Here'
                        }}
                        onChange={this.handleDate}
                        timeFormat={false}
                      />
                    </FormGroup>
                  </Col>
                  <div className='col'>
                    <Button
                      color='success'
                      type='button'
                      onClick={() => this.searchHandler()}
                    >
                      Search
                    </Button>
                  </div>
                  {this.props.User.user.role === 'admin' ? (
                    <div className='col'>
                      <Button
                        color='warning'
                        type='button'
                        onClick={() => this.sendReport()}
                      >
                        Send Report
                      </Button>
                      {this.state.loading === true ? (
                        <Loader
                          type='ThreeDots'
                          color='#fb6340'
                          height={80}
                          width={80}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  ) : (
                    ''
                  )}
                </Row>
                <table
                  id='example'
                  className='display'
                  width='100%'
                  ref={el => (this.el = el)}
                >
                  <thead>
                    <tr role='row'>
                      <th>Entries</th>
                      <th>Total Time (hrs)</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Login Time</th>
                      <th>Logout Time</th>
                      <th>Reason</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timesheetList.map((item, index) => tblrow(item, index))}
                  </tbody>
                </table>
              </Card>
            </div>
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
  getMyBreaks,
  getBreaksCount,
  addReason,
  editLogs
};
export default connect(mapStateToProps, mapDispatchToProps)(TimeSheet);
