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
  CardBody,
  CardImg,
  // CardTitle,
  FormGroup,
  Form,
  Input,
  Modal,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  // ListGroupItem,
  // ListGroup,
  // Progress,
  Container,
  Row,
  Col
} from 'reactstrap';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import Dropzone from 'dropzone';

// core components
import ProfileHeader from 'components/Headers/ProfileHeader.jsx';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { editEmployee } from '../../../actions/user_actions';
import { config } from '../../../siteDetails';
class Profile extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    phone: '',
    editFormModal: false,
    id: '',
    notifyAlert: null
  };

  toggleModal = state => {
    this.setState({
      [state]: !this.state[state]
    });
  };
  onChangeHandler = e => {
    let name = e.target.name;
    this.setState({ [name]: e.target.value });
  };
  onEditSubmitHandler = e => {
    e.preventDefault();
    let { email, password, name, phone, id } = this.state;
    const data = {
      email: email,
      password: password,
      phone: phone,
      name: name
    };
    this.props.editEmployee(data, id).then(res => {
      console.log(res, 'edit response');
      if (res.success === 'OK') {
        this.setState({
          name: '',
          password: '',
          email: '',
          phone: '',
          id: ''
        });
        this.toggleModal('editFormModal');

        this.successAlert();
      } else {
        this.warningAlert();
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
          onConfirm={() => this.deleteEmp(id)}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle='warning'
          cancelBtnBsStyle='success'
          confirmBtnText='Ok'
          cancelBtnText='Cancel'
          btnSize=''
        >
          Sorry could'nt process the request something seems to be wrong..
        </ReactBSAlert>
      )
    });
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
  hideAlert = () => {
    this.setState({
      notifyAlert: null
    });
  };
  editEmp = () => {
    this.setState({
      id: this.props.User.user.uid
    });
    this.toggleModal('editFormModal');
  };
  componentDidMount() {
    let currentSingleFile = undefined;

    // single dropzone file - accepts only images
    new Dropzone(document.getElementById('dropzone-single'), {
      url: `${config.serverUrl}user/profile/${this.props.User.user.uid}`,
      thumbnailWidth: null,
      thumbnailHeight: null,
      previewsContainer: document.getElementsByClassName(
        'dz-preview-single'
      )[0],
      previewTemplate: document.getElementsByClassName('dz-preview-single')[0]
        .innerHTML,
      maxFiles: 1,
      acceptedFiles: 'image/*',
      init: function() {
        this.on('addedfile', function(file) {
          if (currentSingleFile) {
            this.removeFile(currentSingleFile);
          }
          currentSingleFile = file;
        });
      }
    });
    document.getElementsByClassName('dz-preview-single')[0].innerHTML = '';
  }
  render() {
    console.log(this.props, 'profile');
    return (
      <>
        {this.state.notifyAlert}

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
                  <small>Edit Details:</small>
                </div>
                <Form role='form' onSubmit={this.onEditSubmitHandler}>
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
                      focused: this.state.focusedEmail
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
                      focused: this.state.focusedEmail
                    })}
                  >
                    {/* <InputGroup className='input-group-merge input-group-alternative'>
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
                      focused: this.state.focusedPassword
                    })}
                  > */}
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
                        onFocus={() => this.setState({ focusedEmail: true })}
                        onBlur={() =>
                          this.setState({
                            focusedPassword: false
                          })
                        }
                        onChange={this.onChangeHandler}
                      />
                    </InputGroup>
                  </FormGroup>
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

        <ProfileHeader openEdit={this.editEmp} />
        <Container className='mt--6' fluid>
          {/* <Row> */}
          <Col className='order-xl-2' xl='12'>
            <Card className='card-profile'>
              <CardImg
                alt='...'
                src={require('assets/img/theme/img-1-1000x600.jpg')}
                top
              />
              <Row className='justify-content-center'>
                <Col className='order-lg-2' lg='3'>
                  <div className='card-profile-image'>
                    <a href='#pablo' onClick={e => e.preventDefault()}>
                      <img
                        alt='...'
                        className='rounded-circle'
                        src={
                          this.props.User.user.profile
                            ? config.imageUrl +
                              '/timetracker/profiles/' +
                              this.props.User.user.profile
                            : require('assets/img/theme/team-4.jpg')
                        }
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className='text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4'>
                <div className='d-flex justify-content-between'>
                  {/* <Button
                    className='mr-4'
                    color='info'
                    href='#pablo'
                    onClick={e => e.preventDefault()}
                    size='sm'
                  >
                    Connect
                  </Button> */}
                  <Button
                    className='float-right'
                    color='info'
                    // href='#pablo'
                    onClick={() => this.editEmp()}
                    size='sm'
                  >
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <CardBody className='pt-0'>
                {/* <Row>
                  <div className='col'>
                    <div className='card-profile-stats d-flex justify-content-center'>
                      <div>
                        <span className='heading'>22</span>
                        <span className='description'>Friends</span>
                      </div>
                      <div>
                        <span className='heading'>10</span>
                        <span className='description'>Photos</span>
                      </div>
                      <div>
                        <span className='heading'>89</span>
                        <span className='description'>Comments</span>
                      </div>
                    </div>
                  </div>
                </Row> */}
                <div className='text-center'>
                  <h5 className='h3'>
                    {this.props.User.user.name}
                    <span className='font-weight-light'></span>
                  </h5>
                  <div className='h5 font-weight-300'>
                    <i className='ni location_pin mr-2' />
                    {this.props.User.user.role}
                  </div>
                  <div className='h5 mt-4'>
                    <i className='ni business_briefcase-24 mr-2' />
                  </div>
                  <div>
                    <Col lg='6'>
                      <div
                        className='dropzone dropzone-single mb-3'
                        id='dropzone-single'
                      >
                        <div className='fallback'>
                          <div className='custom-file'>
                            <input
                              className='custom-file-input'
                              id='projectCoverUploads'
                              type='file'
                            />
                            <label
                              className='custom-file-label'
                              htmlFor='projectCoverUploads'
                            >
                              Choose file
                            </label>
                          </div>
                        </div>
                        <div className='dz-preview dz-preview-single'>
                          <div className='dz-preview-cover'>
                            <img
                              alt='...'
                              className='dz-preview-img'
                              data-dz-thumbnail=''
                            />
                          </div>
                        </div>
                      </div>
                    </Col>

                    <h4 className='display-4 mb-0'>
                      Select or Drop your profile picture{' '}
                    </h4>
                  </div>
                  <div>
                    <i className='ni education_hat mr-2' />
                    BigBerry Media pvt Ltd.
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* <Col className='order-xl-1' xl='8'> */}
          {/* <Row>
                <Col lg='6'>
                  <Card className='bg-gradient-success border-0'>
                    <CardBody>
                      <Row>
                        <div className='col'>
                          <CardTitle
                            className='text-uppercase text-muted mb-0 text-white'
                            tag='h5'
                          >
                            Total traffic
                          </CardTitle>
                          <span className='h2 font-weight-bold mb-0 text-white'>
                            350,897
                          </span>
                        </div>
                        <Col className='col-auto'>
                          <div className='icon icon-shape bg-white text-dark rounded-circle shadow'>
                            <i className='ni ni-active-40' />
                          </div>
                        </Col>
                      </Row>
                      <p className='mt-3 mb-0 text-sm'>
                        <span className='text-white mr-2'>
                          <i className='fa fa-arrow-up' />
                          3.48%
                        </span>
                        <span className='text-nowrap text-light'>
                          Since last month
                        </span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg='6'>
                  <Card className='bg-gradient-danger border-0' tag='h5'>
                    <CardBody>
                      <Row>
                        <div className='col'>
                          <CardTitle className='text-uppercase text-muted mb-0 text-white'>
                            Performance
                          </CardTitle>
                          <span className='h2 font-weight-bold mb-0 text-white'>
                            49,65%
                          </span>
                        </div>
                        <Col className='col-auto'>
                          <div className='icon icon-shape bg-white text-dark rounded-circle shadow'>
                            <i className='ni ni-spaceship' />
                          </div>
                        </Col>
                      </Row>
                      <p className='mt-3 mb-0 text-sm'>
                        <span className='text-white mr-2'>
                          <i className='fa fa-arrow-up' />
                          3.48%
                        </span>
                        <span className='text-nowrap text-light'>
                          Since last month
                        </span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
               */}
          {/* <Card>
                <CardHeader>
                  <Row className='align-items-center'>
                    <Col xs='8'>
                      <h3 className='mb-0'>Edit profile</h3>
                    </Col>
                    <Col className='text-right' xs='4'>
                      <Button
                        color='primary'
                        href='#pablo'
                        onClick={e => e.preventDefault()}
                        size='sm'
                      >
                        Settings
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>

                <CardBody>
                  <Form>
                    <h6 className='heading-small text-muted mb-4'>
                      User information
                    </h6>
                    <div className='pl-lg-4'>
                      <Row>
                        <Col lg='6'>
                          <FormGroup>
                            <label
                              className='form-control-label'
                              htmlFor='input-username'
                            >
                              Name
                            </label>
                            <Input
                              defaultValue={'lucky.jesse'}
                              id='input-username'
                              placeholder='Username'
                              type='text'
                            />
                          </FormGroup>
                        </Col>
                        <Col lg='6'>
                          <FormGroup>
                            <label
                              className='form-control-label'
                              htmlFor='input-email'
                            >
                              Email address
                            </label>
                            <Input
                              id='input-email'
                              placeholder='abc@example.com'
                              type='email'
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg='6'>
                          <FormGroup>
                            <label
                              className='form-control-label'
                              htmlFor='input-password'
                            >
                              Password
                            </label>
                            <Input
                              defaultValue='***'
                              id='input-password'
                              placeholder='Enter Password'
                              type='password'
                            />
                          </FormGroup>
                        </Col>
                        <Col lg='6'>
                          <FormGroup>
                            <label
                              className='form-control-label'
                              htmlFor='input-last-name'
                            >
                              Phone Number
                            </label>
                            <Input
                              defaultValue={this.props.User.user.phone}
                              id='input-phone'
                              placeholder='Enter phone number'
                              type='text'
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className='my-4' />
                    
                    <h6 className='heading-small text-muted mb-4'>
                      Contact information
                    </h6>
                    <div className='pl-lg-4'>
                      <Row>
                        <Col md='12'>
                          <FormGroup>
                            <label
                              className='form-control-label'
                              htmlFor='input-address'
                            >
                              Address
                            </label>
                            <Input
                              defaultValue='Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09'
                              id='input-address'
                              placeholder='Home Address'
                              type='text'
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg='4'>
                          <FormGroup>
                            <label
                              className='form-control-label'
                              htmlFor='input-city'
                            >
                              City
                            </label>
                            <Input
                              defaultValue='New York'
                              id='input-city'
                              placeholder='City'
                              type='text'
                            />
                          </FormGroup>
                        </Col>
                        <Col lg='4'>
                          <FormGroup>
                            <label
                              className='form-control-label'
                              htmlFor='input-country'
                            >
                              Country
                            </label>
                            <Input
                              defaultValue='United States'
                              id='input-country'
                              placeholder='Country'
                              type='text'
                            />
                          </FormGroup>
                        </Col>
                        <Col lg='4'>
                          <FormGroup>
                            <label
                              className='form-control-label'
                              htmlFor='input-country'
                            >
                              Postal code
                            </label>
                            <Input
                              id='input-postal-code'
                              placeholder='Postal code'
                              type='number'
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className='my-4' />

                    <h6 className='heading-small text-muted mb-4'>About me</h6>
                    <div className='pl-lg-4'>
                      <FormGroup>
                        <label className='form-control-label'>About Me</label>
                        <Input
                          placeholder='A few words about you ...'
                          rows='4'
                          type='textarea'
                          defaultValue='A beautiful premium dashboard for Bootstrap 4.'
                        />
                      </FormGroup>
                    </div>
                  
                  </Form>
                </CardBody>
              </Card>
             */}
          {/* </Col> */}
          {/* </Row> */}
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
  editEmployee
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
