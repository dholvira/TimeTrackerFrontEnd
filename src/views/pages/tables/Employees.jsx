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
  Button,
  Card,
  CardHeader,
  //   CardFooter,
  //   DropdownMenu,
  //   DropdownItem,
  //   DropdownToggle,
  //   UncontrolledDropdown,
  //   Media,
  //   Pagination,
  //   PaginationItem,
  //   PaginationLink,
  //   Progress,
  Breadcrumb,
  BreadcrumbItem,
  Table,
  Container,
  Row,
  CardBody,
  Form,
  Col,
  UncontrolledTooltip,
  Modal,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  FormGroup,
} from 'reactstrap';
import ReactBSAlert from 'react-bootstrap-sweetalert';

import { connect } from 'react-redux';
import {
  getEmployees,
  addEmployee,
  deleteEmployee,
  editEmployee,
} from '../../../actions/user_actions';
// core components
import Moment from 'react-moment';
import { config } from '../../../siteDetails';
import classnames from 'classnames';

class Employees extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    phone: '',
    defaultModal: false,
    notificationModal: false,
    formModal: false,
    editFormModal: false,
    alert: null,
    notifyAlert: null,
    employees: [],
    id: '',
  };

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };
  getEmployeesData = () => {
    this.props.getEmployees().then((res) => {
      if (res) {
        this.setState({ employees: res.data });
      } else {
        this.setState({ error: 'error fetching employees' });
      }
    });
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

  warningAlert = (id) => {
    this.setState({
      notifyAlert: (
        <ReactBSAlert
          warning
          style={{ display: 'block', marginTop: '-100px' }}
          title='Warning'
          showCancel={true}
          onConfirm={() => this.deleteEmp(id)}
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

  deleteEmp = (id) => {
    this.props.deleteEmployee(id).then((res) => {
      if (res.success === 'OK') {
        this.hideAlert();
        this.getEmployeesData();
        this.successAlert();
      }
    });
  };
  hideAlert = () => {
    this.setState({
      notifyAlert: null,
    });
  };
  editEmp = (item) => {
    // console.log(data, 'emp data edit');
    this.setState({
      name: item.name,
      email: item.email,
      phone: item.phone,
      id: item._id,
    });
    this.toggleModal('editFormModal');
  };
  onEditSubmitHandler = (e) => {
    e.preventDefault();
    let { email, password, name, phone, id } = this.state;
    const data = {
      email: email,
      password: password,
      phone: phone,
      name: name,
    };
    this.props.editEmployee(data, id).then((res) => {
      console.log(res, 'edit response');
      if (res.success === 'OK') {
        this.setState({
          name: '',
          password: '',
          email: '',
          phone: '',
          id: '',
        });
        this.toggleModal('editFormModal');

        this.successAlert();
        this.getEmployeesData();
      }
    });
  };
  onSubmitHandler = (e) => {
    e.preventDefault();
    let { email, password, name, phone } = this.state;
    // console.log(email, password, 'input');
    const data = {
      email: email,
      password: password,
      phone: phone,
      name: name,
    };
    this.props.addEmployee(data).then((res) => {
      console.log(res, 'user added');
      if (res.data) {
        this.setState({
          name: '',
          password: '',
          email: '',
          phone: '',
          formModal: false,
        });
        this.successAlert();
        this.getEmployeesData();
      }
    });
  };

  componentDidMount() {
    this.getEmployeesData();
  }
  render() {
    console.log(this.state.employees, 'employee redux');
    return (
      <>
        {this.state.notifyAlert}
        {/* <Button
          block
          color='default'
          onClick={() => this.toggleModal('formModal')}
        >
          Form
        </Button> */}
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
                  <small>Enter Employee Details</small>
                </div>
                <Form role='form' onSubmit={this.onSubmitHandler}>
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
                        placeholder='Name'
                        type='text'
                        name='name'
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames('mb-3', {
                      focused: this.state.focusedEmail,
                    })}
                  >
                    <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-mobile-button' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='Phone No'
                        type='text'
                        name='phone'
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames('mb-3', {
                      focused: this.state.focusedEmail,
                    })}
                  >
                    <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-email-83' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='Email'
                        type='email'
                        name='email'
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames({
                      focused: this.state.focusedPassword,
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
                        name='password'
                        onFocus={() => this.setState({ focusedPassword: true })}
                        onBlur={() =>
                          this.setState({
                            focusedPassword: false,
                          })
                        }
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* <div className='custom-control custom-control-alternative custom-checkbox'>
                    <input
                      className='custom-control-input'
                      id=' customCheckLogin'
                      type='checkbox'
                    />
                    <label
                      className='custom-control-label'
                      htmlFor=' customCheckLogin'
                    >
                      <span className='text-muted'>Remember me</span>
                    </label>
                  </div> */}
                  <div className='text-center'>
                    <Button className='my-4' color='primary' type='submit'>
                      Add Employee
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
          isOpen={this.state.editFormModal}
          toggle={() => this.toggleModal('editFormModal')}
        >
          <div className='modal-body p-0'>
            <Card className='bg-secondary border-0 mb-0'>
              <CardBody className='px-lg-5 py-lg-5'>
                <div className='text-center text-muted mb-4'>
                  <small>Edit Employee Details:</small>
                </div>
                <Form role='form' onSubmit={this.onEditSubmitHandler}>
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
                        placeholder='Name'
                        type='text'
                        name='name'
                        value={this.state.name}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames('mb-3', {
                      focused: this.state.focusedEmail,
                    })}
                  >
                    <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-mobile-button' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='Phone No'
                        type='text'
                        name='phone'
                        value={this.state.phone}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames('mb-3', {
                      focused: this.state.focusedEmail,
                    })}
                  >
                    <InputGroup className='input-group-merge input-group-alternative'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='ni ni-email-83' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder='Email'
                        type='email'
                        name='email'
                        value={this.state.email}
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() => this.setState({ focusedEmail: false })}
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames({
                      focused: this.state.focusedPassword,
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
                        name='password'
                        onFocus={() => this.setState({ focusedPassword: true })}
                        onBlur={() =>
                          this.setState({
                            focusedPassword: false,
                          })
                        }
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* <div className='custom-control custom-control-alternative custom-checkbox'>
                    <input
                      className='custom-control-input'
                      id=' customCheckLogin'
                      type='checkbox'
                    />
                    <label
                      className='custom-control-label'
                      htmlFor=' customCheckLogin'
                    >
                      <span className='text-muted'>Remember me</span>
                    </label>
                  </div> */}
                  <div className='text-center'>
                    <Button className='my-4' color='primary' type='submit'>
                      Submit
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Modal>

        <div className='header header-dark bg-info pb-6 content__title content__title--calendar'>
          <Container fluid>
            <div className='header-body'>
              <Row className='align-items-center py-4'>
                <Col lg='6' xs='7'>
                  <h6 className='fullcalendar-title h2 text-white d-inline-block mb-0'>
                    Employees
                  </h6>
                  <Breadcrumb
                    className='d-none d-md-inline-block ml-lg-4'
                    listClassName='breadcrumb-links breadcrumb-dark'
                  >
                    <BreadcrumbItem>
                      <a href='#pablo' onClick={(e) => e.preventDefault()}>
                        <i className='fas fa-home' />
                      </a>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <a href='#pablo' onClick={(e) => e.preventDefault()}>
                        Data
                      </a>
                    </BreadcrumbItem>
                    <BreadcrumbItem
                      aria-current='page'
                      className='active'
                    ></BreadcrumbItem>
                  </Breadcrumb>
                </Col>
                {this.props.User.user.role === 'admin' ? (
                  <Col className='mt-3 mt-md-0 text-md-right' lg='6' xs='5'>
                    <Button
                      className='btn-neutral'
                      size='sm'
                      onClick={() => this.toggleModal('formModal')}
                    >
                      Add Employee
                    </Button>
                  </Col>
                ) : (
                  ''
                )}
              </Row>
            </div>
          </Container>
        </div>
        {/* <SimpleHeader name='Tables' parentName='Tables' /> */}
        <Container className='mt--6' fluid>
          <Card>
            <CardHeader className='border-0'>
              <Row>
                <Col xs='6'>
                  <h3 className='mb-0'>Employees List</h3>
                </Col>
                {/* <Col className='text-right' xs='6'>
                  <Button
                    className='btn-neutral btn-round btn-icon'
                    color='default'
                    href='#pablo'
                    id='tooltip969372949'
                    onClick={e => e.preventDefault()}
                    size='sm'
                  >
                    <span className='btn-inner--icon mr-1'>
                      <i className='fas fa-user-edit' />
                    </span>
                    <span className='btn-inner--text'>Export</span>
                  </Button>
                  <UncontrolledTooltip delay={0} target='tooltip969372949'>
                    Edit Employees
                  </UncontrolledTooltip>
                </Col> */}
              </Row>
            </CardHeader>

            <Table className='align-items-center table-flush' responsive>
              <thead className='thead-light'>
                <tr>
                  <th>Employee</th>
                  <th>Created at</th>
                  <th>Profile</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.state.employees.map((item, index) => (
                  <tr key={index}>
                    <td className='table-user'>
                      <img
                        alt='...'
                        className='avatar rounded-circle mr-3'
                        src={
                          item.profile
                            ? config.imageUrl +
                              '/timetracker/profiles/' +
                              item.profile
                            : require('assets/img/theme/team-1.jpg')
                        }
                      />
                      <b>{item.name}</b>
                    </td>
                    <td>
                      <span className='text-muted'>
                        <Moment format='DD/MM/YYYY'>{item.updatedAt}</Moment>
                      </span>
                    </td>
                    <td>
                      <span className='text-muted'>{item.email}</span>
                    </td>
                    <td>
                      <span className='text-muted'>{item.status}</span>
                    </td>
                    {this.props.User.user.role === 'admin' ? (
                      <td className='table-actions'>
                        <Button
                          className='table-action'
                          id='tooltip564981685'
                          color='white'
                          onClick={() => this.editEmp(item)}
                        >
                          <i className='fa fa-user-edit' />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip564981685'
                        >
                          Edit Employee
                        </UncontrolledTooltip>
                        <Button
                          className='table-action table-action-delete'
                          // href='javascript:void(0)'
                          id='tooltip601065234'
                          color='white'
                          onClick={() => this.warningAlert(item._id)}
                        >
                          <i className='fa fa-trash' />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip601065234'
                        >
                          Delete Employee
                        </UncontrolledTooltip>
                      </td>
                    ) : (
                      ''
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
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
  getEmployees,
  addEmployee,
  deleteEmployee,
  editEmployee,
};
export default connect(mapStateToProps, mapDispatchToProps)(Employees);
