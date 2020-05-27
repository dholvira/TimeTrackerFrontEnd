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
  addReason,
  editLeave,
  deleteLeave,
  addLeave,
  approveLeave,
  getEmployees,
  adminAddLeave
} from '../../actions/user_actions';
import Loader from 'react-loader-spinner';
import Select2 from 'react-select2-wrapper';

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

class LeaveLogs extends React.Component {
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
      endDate: '',
      startDate: '',
      data: [],
      table: {},
      formModal: false,
      reason: '',
      id: '',
      endingDate: '',
      notifyAlert: null,
      loading: false,
      type: '',
      employee: '',
      employees: [],
      category: ''
    };
    this.handleDate = this.handleDate.bind(this);
    this.handleLeaveDate = this.handleLeaveDate.bind(this);
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
      selectedStart_date: this.state.date,
      selectedEnd_date: this.state.endingDate
    };
    if (this.props.User.user.role === 'admin') {
      axios({
        method: 'POST',
        url: `${config.serverUrl}leave/getEmployeesLeaves`,
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
    } else {
      const id = this.props.User.user.uid;
      const data = {
        selectedStart_date: this.state.date,
        user: id,
        selectedEnd_date: this.state.endingDate
      };
      axios({
        method: 'POST',
        url: `${config.serverUrl}leave/getEmployeesLeaves`,
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
  }

  getEmployeesData = () => {
    this.props.getEmployees().then(res => {
      if (res) {
        const result = res.data.map(elm => ({ id: elm._id, text: elm.name }));

        // let result = res.data.map(({ name, _id }) => ({text, id}));
        this.setState({ employees: result });
      } else {
        this.setState({ error: 'error fetching employees' });
      }
    });
  };

  handleDate(date) {
    this.setState({ date: moment(date).format('YYYY-MM-DD') });
  }
  handleLeaveDate(date) {
    this.setState({ endingDate: moment(date).format('YYYY-MM-DD') });
  }
  handleEndDate = date => {
    this.setState({
      endDate: moment(date).format('YYYY-MM-DD')
    });
  };
  handleStartDate = date => {
    this.setState({
      startDate: moment(date).format('YYYY-MM-DD')
    });
  };
  editLeave = item => {
    this.setState({
      type: 'edit',
      id: item._id,
      reason: item.reason,
      endDate: moment(item.end).format('YYYY-MM-DD'),
      startDate: moment(item.start).format('YYYY-MM-DD')
    });
    this.toggleModal('formModal');
  };

  onChangeHandler = e => {
    let name = e.target.name;
    this.setState({ [name]: e.target.value });
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
  onEmployeeSelect = e => {
    const id = e.target.value;
    // console.log(id, 'employee id');
    // let name = e.target.name;
    this.setState({ employee: id });
  };
  onLeaveSelect = e => {
    const leaveType = e.target.value;
    this.setState({ category: leaveType });
  };
  approveAlert = id => {
    this.setState({
      notifyAlert: (
        <ReactBSAlert
          success
          style={{ display: 'block', marginTop: '-100px' }}
          title='Success'
          showCancel={true}
          onConfirm={() => this.approveLeave(id)}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle='warning'
          cancelBtnText='Cancel'
          cancelBtnBsStyle='success'
          confirmBtnText='Ok'
          btnSize=''
        >
          Do you want to approve?
        </ReactBSAlert>
      )
    });
  };
  approveLeave = id => {
    this.props.approveLeave(id).then(res => {
      if (res.success === 'OK') {
        this.hideAlert();
        this.state.table.destroy();
        this.fetchMyData();
        this.successAlert();
      } else {
      }
    });
  };
  warningAlert = id => {
    this.setState({
      notifyAlert: (
        <ReactBSAlert
          warning
          style={{ display: 'block', marginTop: '-100px' }}
          title='Warning'
          showCancel={true}
          onCancel={() => this.hideAlert()}
          onConfirm={() => this.deleteLeave(id)}
          confirmBtnBsStyle='warning'
          cancelBtnBsStyle='success'
          confirmBtnText='Ok'
          cancelBtnText='Cancel'
          btnSize=''
        >
          Are you sure you want to delete?
        </ReactBSAlert>
      )
    });
  };
  failAlert = () => {
    this.setState({
      notifyAlert: (
        <ReactBSAlert
          warning
          style={{ display: 'block', marginTop: '-100px' }}
          title='Warning'
          showCancel={false}
          onCancel={() => this.hideAlert()}
          onConfirm={() => this.hideAlert()}
          confirmBtnBsStyle='warning'
          cancelBtnBsStyle='success'
          confirmBtnText='Ok'
          cancelBtnText='Cancel'
          btnSize=''
        >
          Request Failed..
        </ReactBSAlert>
      )
    });
  };
  deleteLeave = id => {
    this.props.deleteLeave(id).then(res => {
      if (res.success === 'OK') {
        this.hideAlert();
        this.state.table.destroy();
        this.fetchMyData();
        this.successAlert();
      }
    });
  };
  newLeave = () => {
    // const id = this.props.User.user.uid;
    this.getEmployeesData();
    this.setState({ type: 'add' });
    this.toggleModal('formModal');
  };
  onSubmitHandler = e => {
    e.preventDefault();
    if (this.state.type === 'edit') {
      let { reason, startDate, endDate, id, category } = this.state;

      var data = {
        reason: reason,
        category: category,
        end: endDate,
        start: startDate
      };

      if (category === 'Planned Leave') {
        data = {
          reason: reason,
          category: category,
          end: endDate,
          start: startDate,
          className: 'bg-orange'
        };
        console.log(data.className, 'Planned Leave');
      } else if (category === 'Short Leave') {
        data = {
          reason: reason,
          category: category,
          end: endDate,
          start: startDate,
          className: 'bg-pink'
        };
        console.log(data.className, 'Short Leave');
      } else if (category === 'Sick Leave') {
        data = {
          reason: reason,
          category: category,
          end: endDate,
          start: startDate,
          className: 'bg-purple'
        };
        console.log(data.className, 'Sick Leave');
      } else if (category === 'Half Day') {
        data = {
          reason: reason,
          category: category,
          end: endDate,
          start: startDate,
          className: 'bg-yellow'
        };
        console.log(data.className, 'Half Day');
      }
      this.props.editLeave(data, id).then(res => {
        // console.log(res, 'user added');
        if (res.success === 'OK') {
          this.setState({
            reason: '',
            id: '',
            endDate: '',
            startDate: '',
            formModal: false,
            category: ''
          });
          this.successAlert();
          this.state.table.destroy();
          this.fetchMyData();
        } else {
          this.setState({
            reason: '',
            id: '',
            endDate: '',
            startDate: '',
            category: '',
            formModal: false
          });
          this.failAlert();
        }
      });
    } else if (this.state.type === 'add') {
      let { reason, startDate, endDate, employee, category } = this.state;

      data = {
        reason: reason,
        end: endDate,
        start: startDate,
        user: employee,
        status: 'Approved',
        category: category
      };
      if (category === 'Planned Leave') {
        data = {
          user: employee,

          reason: reason,
          category: category,
          status: 'Approved',
          end: endDate,
          start: startDate,
          className: 'bg-orange'
        };
        console.log(data.className, 'Planned Leave');
      } else if (category === 'Short Leave') {
        data = {
          user: employee,

          reason: reason,
          category: category,
          status: 'Approved',

          end: endDate,
          start: startDate,
          className: 'bg-pink'
        };
        console.log(data.className, 'Short Leave');
      } else if (category === 'Sick Leave') {
        data = {
          user: employee,

          reason: reason,
          category: category,
          status: 'Approved',

          end: endDate,
          start: startDate,
          className: 'bg-purple'
        };
        console.log(data.className, 'Sick Leave');
      } else if (category === 'Half Day') {
        data = {
          user: employee,

          reason: reason,
          category: category,
          status: 'Approved',

          end: endDate,
          start: startDate,
          className: 'bg-yellow'
        };
        console.log(data.className, 'Half Day');
      }
      this.props.adminAddLeave(data).then(res => {
        if (res.success === 'OK') {
          this.setState({
            reason: '',
            employee: '',
            endDate: '',
            startDate: '',
            formModal: false,
            category: ''
          });
          this.successAlert();
          this.state.table.destroy();
          this.fetchMyData();
        } else {
          this.setState({
            reason: '',
            id: '',
            endDate: '',
            startDate: '',
            formModal: false,
            category: ''
          });
          this.failAlert();
        }
      });
    }
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
    const dataSheetList = this.state.data;
    console.log(this.state.category, 'category');
    const tblrow = (item, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.user.name}</td>
          <td>{item.category}</td>
          <td>{item.reason}</td>
          <td>{item.status}</td>
          <td>
            <Moment format='YYYY-MM-DD '>{item.start}</Moment>
          </td>
          <td>
            <Moment format='YYYY-MM-DD'>{item.end}</Moment>
          </td>
          <td>
            {Date.parse(item.start) >= Date.parse(this.state.date) &&
            Date.parse(item.end) <= Date.parse(this.state.endingDate)
              ? parseInt(
                  (new Date(item.end).getTime() -
                    new Date(item.start).getTime()) /
                    (1000 * 3600 * 24) +
                    1
                )
              : Date.parse(item.start) < Date.parse(this.state.date) &&
                Date.parse(item.end) < Date.parse(this.state.endingDate)
              ? parseInt(
                  (new Date(item.end).getTime() -
                    new Date(this.state.date).getTime()) /
                    (1000 * 3600 * 24) +
                    1
                )
              : Date.parse(item.start) <= Date.parse(this.state.date) &&
                Date.parse(item.end) >= Date.parse(this.state.endingDate)
              ? parseInt(
                  (new Date(this.state.endingDate).getTime() -
                    new Date(this.state.date).getTime()) /
                    (1000 * 3600 * 24) +
                    1
                )
              : Date.parse(item.start) > Date.parse(this.state.date) &&
                Date.parse(item.end) > Date.parse(this.state.endingDate)
              ? parseInt(
                  (new Date(this.state.endingDate).getTime() -
                    new Date(item.start).getTime()) /
                    (1000 * 3600 * 24) +
                    1
                )
              : ''}
          </td>
          <td>
            {this.props.User.user.role === 'admin' ? (
              <>
                <Button
                  className='btn-icon-only rounded-circle'
                  title='Edit'
                  color='success'
                  type='button'
                  onClick={() => {
                    this.editLeave(item);
                  }}
                >
                  <span className='btn-inner--icon'>
                    <i className='ni ni-active-40' />
                  </span>
                </Button>
                <Button
                  className='btn-icon-only rounded-circle'
                  title='Delete'
                  color='warning'
                  type='button'
                  onClick={() => {
                    this.warningAlert(item._id);
                  }}
                >
                  <span className='btn-inner--icon'>
                    <i className='ni ni-basket' />
                  </span>
                </Button>
                {this.props.User.user.role === 'admin' &&
                item.status === 'Pending' ? (
                  <Button
                    className='btn-icon-only rounded-circle'
                    title='Approve'
                    color='primary'
                    type='button'
                    onClick={() => {
                      this.approveAlert(item._id);
                    }}
                  >
                    <span className='btn-inner--icon'>
                      <i className='ni ni-check-bold' />
                    </span>
                  </Button>
                ) : (
                  ''
                )}
              </>
            ) : (
              ''
            )}
          </td>
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
          isOpen={this.state.formModal}
          toggle={() => this.toggleModal('formModal')}
        >
          <div className='modal-body p-0'>
            <Card className='bg-secondary border-0 mb-0'>
              <CardBody className='px-lg-5 py-lg-5'>
                <div className='text-center text-muted mb-4'>
                  <small>Leave Form</small>
                </div>
                <Form role='form' onSubmit={this.onSubmitHandler}>
                  <FormGroup>
                    <Select2
                      className='form-control'
                      // defaultValue='1'
                      value={this.state.employee}
                      name='employee'
                      options={{
                        placeholder: 'Select Employee'
                      }}
                      data={this.state.employees}
                      onClose={this.onEmployeeSelect}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label
                      className='form-control-label'
                      htmlFor='exampleFormControlSelect1'
                      style={{ color: '#85929E', fontWeight: 'normal' }}
                    >
                      Select Leave Type:
                    </label>
                    <Input
                      id='exampleFormControlSelect1'
                      name='category'
                      type='select'
                      value={this.state.category}
                      onChange={this.onChangeHandler}
                    >
                      <option></option>

                      <option>Planned Leave</option>
                      <option>Short Leave</option>
                      <option>Half Day</option>
                      <option>Sick Leave</option>
                    </Input>
                  </FormGroup>
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
                        placeholder='Add Reason'
                        type='text'
                        name='reason'
                        value={this.state.reason}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <ReactDatetime
                        inputProps={{
                          placeholder: 'Start Date Picker'
                        }}
                        value={this.state.startDate}
                        onChange={this.handleStartDate}
                        timeFormat={false}
                        closeOnSelect={true}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <ReactDatetime
                        inputProps={{
                          placeholder: 'End Date Picker'
                        }}
                        value={this.state.endDate}
                        onChange={this.handleEndDate}
                        timeFormat={false}
                        closeOnSelect={true}
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

        <SimpleHeader name='Tables' parentName='Tables' />
        <Container className='mt--6' fluid>
          {/* {this.props.User.user.role == 'employee' ? ( */}
          <Row>
            <div className='col'>
              <Card>
                <CardHeader className='border-0'>
                  <h3 className='mb-0'>Leaves Logs:</h3>
                </CardHeader>
                <Row style={{ marginLeft: 20 }}>
                  <Col md='4'>
                    <FormGroup>
                      <ReactDatetime
                        inputProps={{
                          placeholder: 'Start Date Picker Here'
                        }}
                        onChange={this.handleDate}
                        timeFormat={false}
                        dateFormat={'YYYY-MM-DD'}
                      />
                    </FormGroup>
                  </Col>
                  <Col md='4'>
                    <FormGroup>
                      <ReactDatetime
                        inputProps={{
                          placeholder: 'End Date Picker Here'
                        }}
                        onChange={this.handleLeaveDate}
                        timeFormat={false}
                        dateFormat={'YYYY-MM-DD'}
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
                  {/* <div className='col'>
                    <Button
                      color='success'
                      type='button'
                      onClick={() => this.searchHandler()}
                    >
                      Search
                    </Button>
                  </div> */}
                </Row>
                {this.props.User.user.role === 'admin' ? (
                  <Row style={{ marginLeft: 20, marginBottom: 20 }}>
                    <div className='col'>
                      <Button
                        color='warning'
                        type='button'
                        onClick={() => this.newLeave()}
                      >
                        Add Employee Leave
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
                  </Row>
                ) : (
                  ''
                )}
                <table
                  id='example'
                  className='display'
                  width='100%'
                  ref={el => (this.el = el)}
                >
                  <thead>
                    <tr role='row'>
                      <th>Entries</th>
                      <th>Name</th>
                      <th>Leave Type</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>
                        Leaves Between <br /> Search Dates:
                      </th>

                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataSheetList.map((item, index) => tblrow(item, index))}
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
  addLeave,
  addReason,
  editLeave,
  deleteLeave,
  approveLeave,
  getEmployees,
  adminAddLeave
};
export default connect(mapStateToProps, mapDispatchToProps)(LeaveLogs);
