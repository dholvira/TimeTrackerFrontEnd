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
  FormGroup,
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
} from '../../actions/user_actions';
import Loader from 'react-loader-spinner';

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

class LeaveLog extends React.Component {
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
      notifyAlert: null,
      loading: false,
      type: '',
      category: '',
    };
    this.handleDate = this.handleDate.bind(this);
  }
  searchHandler = () => {
    this.state.table.destroy();
    this.fetchMyData();
  };
  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };
  fetchMyData() {
    const data = { selected_date: this.state.date };
    if (this.props.User.user.role === 'admin') {
      axios({
        method: 'POST',
        url: `${config.serverUrl}leave/getAll`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
        data: data,
      })
        .then((response) => {
          this.setState({ data: response.data.data });
          // console.log(this.state.allPayments, "allPayments")
          const tbobj = $('#example').DataTable({
            //  lengthMenu: [[10, 25, 50, -1], [20, 30, 50, "All"]],
            pageLength: 20,
            columnDefs: [
              {
                targets: 0,
                orderable: false,
              },
            ],
            pagingType: 'full_numbers',
            responsive: true,
            dom: 'Bfrtip',
            buttons: [
              {
                extend: 'copy',
                title: 'Report',
              },
              {
                extend: 'csv',
                title: 'Report',
              },
            ],
          });
          this.setState({ table: tbobj });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const id = this.props.User.user.uid;
      const data = {
        selected_date: this.props.selectedDate,
        user: id,
      };
      axios({
        method: 'POST',
        url: `${config.serverUrl}leave/getAll`,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
        data: data,
      })
        .then((response) => {
          this.setState({ data: response.data.data });
          // console.log(this.state.allPayments, "allPayments")
          const tbobj = $('#example').DataTable({
            //  lengthMenu: [[10, 25, 50, -1], [20, 30, 50, "All"]],
            pageLength: 20,
            columnDefs: [
              {
                targets: 0,
                orderable: false,
              },
            ],
            pagingType: 'full_numbers',
            responsive: true,
            dom: 'Bfrtip',
            buttons: [
              {
                extend: 'copy',
                title: 'Report',
              },
              {
                extend: 'csv',
                title: 'Report',
              },
            ],
          });
          this.setState({ table: tbobj });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleDate(date) {
    this.setState({ date: moment(date).format('YYYY-MM-DD') });
  }
  handleEndDate = (date) => {
    this.setState({
      endDate: moment(date).format('YYYY-MM-DD'),
    });
  };
  handleStartDate = (date) => {
    this.setState({
      startDate: moment(date).format('YYYY-MM-DD'),
    });
  };
  editLeave = (item) => {
    this.setState({
      type: 'edit',
      id: item._id,
      reason: item.reason,
      endDate: moment(item.end).format('YYYY-MM-DD'),
      startDate: moment(item.start).format('YYYY-MM-DD'),
    });
    this.toggleModal('formModal');
  };

  onChangeHandler = (e) => {
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
      ),
    });
  };
  approveAlert = (id) => {
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
      ),
    });
  };
  approveLeave = (id) => {
    this.props.approveLeave(id).then((res) => {
      if (res.success === 'OK') {
        this.hideAlert();
        this.state.table.destroy();
        this.fetchMyData();
        this.successAlert();
      } else {
      }
    });
  };
  warningAlert = (id) => {
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
      ),
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
      ),
    });
  };
  deleteLeave = (id) => {
    this.props.deleteLeave(id).then((res) => {
      if (res.success === 'OK') {
        this.hideAlert();
        this.state.table.destroy();
        this.fetchMyData();
        this.successAlert();
      }
    });
  };
  newLeave = () => {
    const id = this.props.User.user.uid;
    this.setState({ type: 'add', id: id });
    this.toggleModal('formModal');
  };
  onSubmitHandler = (e) => {
    e.preventDefault();
    if (this.state.type === 'edit') {
      let { reason, startDate, endDate, id, category } = this.state;

      var data = {
        category: category,
        reason: reason,
        end: endDate,
        start: startDate,
      };
      if (category === 'Planned Leave') {
        data = {
          reason: reason,
          category: category,
          end: endDate,
          start: startDate,
          className: 'bg-orange',
        };
        console.log(data.className, 'Planned Leave');
      } else if (category === 'Short Leave') {
        data = {
          reason: reason,
          category: category,
          end: endDate,
          start: startDate,
          className: 'bg-pink',
        };
        console.log(data.className, 'Short Leave');
      } else if (category === 'Sick Leave') {
        data = {
          reason: reason,
          category: category,
          end: endDate,
          start: startDate,
          className: 'bg-purple',
        };
        console.log(data.className, 'Sick Leave');
      } else if (category === 'Half Day') {
        data = {
          reason: reason,
          category: category,
          end: endDate,
          start: startDate,
          className: 'bg-yellow',
        };
        console.log(data.className, 'Half Day');
      }
      this.props.editLeave(data, id).then((res) => {
        // console.log(res, 'user added');
        if (res.success === 'OK') {
          this.setState({
            reason: '',
            id: '',
            endDate: '',
            startDate: '',
            formModal: false,
            category: '',
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
            formModal: false,
          });
          this.failAlert();
        }
      });
    } else if (this.state.type === 'add') {
      let { reason, startDate, endDate, id, category } = this.state;

      data = {
        category: category,
        reason: reason,
        end: endDate,
        start: startDate,
        user: id,
      };
      if (category === 'Planned Leave') {
        data = {
          user: id,
          reason: reason,
          category: category,
          end: endDate,
          start: startDate,
          className: 'bg-orange',
        };
        console.log(data.className, 'Planned Leave');
      } else if (category === 'Short Leave') {
        data = {
          user: id,
          reason: reason,
          category: category,
          end: endDate,
          start: startDate,
          className: 'bg-pink',
        };
        console.log(data.className, 'Short Leave');
      } else if (category === 'Sick Leave') {
        data = {
          user: id,
          reason: reason,
          category: category,
          end: endDate,
          start: startDate,
          className: 'bg-purple',
        };
        console.log(data.className, 'Sick Leave');
      } else if (category === 'Half Day') {
        data = {
          user: id,
          reason: reason,
          category: category,
          end: endDate,
          start: startDate,
          className: 'bg-yellow',
        };
        console.log(data.className, 'Half Day');
      }
      this.props.addLeave(data).then((res) => {
        if (res.success === 'OK') {
          this.setState({
            reason: '',
            id: '',
            endDate: '',
            startDate: '',
            formModal: false,
            category: '',
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
            category: '',
          });
          this.failAlert();
        }
      });
    }
  };

  hideAlert = () => {
    this.setState({
      notifyAlert: null,
    });
  };
  componentDidMount() {
    this.fetchMyData();
  }
  render() {
    const dataSheetList = this.state.data;
    const tblrow = (item, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.user.name}</td>
          <td> {item.category}</td>
          <td>{item.reason}</td>
          <td>{item.status}</td>
          <td>
            <Moment format='YYYY-MM-DD '>{item.start}</Moment>
          </td>
          <td>
            <Moment format='YYYY-MM-DD'>{item.end}</Moment>
          </td>
          <td>
            {item.status === 'Pending' ? (
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
                {this.props.User.user.role === 'admin' ? (
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
                      focused: this.state.focusedEmail,
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
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <ReactDatetime
                        inputProps={{
                          placeholder: 'Start Date Picker',
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
                          placeholder: 'End Date Picker',
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
                          placeholder: 'Date Picker Here',
                        }}
                        onChange={this.handleDate}
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

                  <div className='col'>
                    <Button
                      color='warning'
                      type='button'
                      onClick={() => this.newLeave()}
                    >
                      Add Leave
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
                <table
                  id='example'
                  className='display'
                  width='100%'
                  ref={(el) => (this.el = el)}
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
const mapStateToProps = (state) => {
  return {
    User: state.User,
  };
};
const mapDispatchToProps = {
  addLeave,
  addReason,
  editLeave,
  deleteLeave,
  approveLeave,
};
export default connect(mapStateToProps, mapDispatchToProps)(LeaveLog);
