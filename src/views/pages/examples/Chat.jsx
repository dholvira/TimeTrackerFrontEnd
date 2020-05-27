// import React from 'react';
// import { connect } from 'react-redux';
// import {
//   registerChatUser,
//   privateMessage,
// } from '../../../actions/chat_actions';

// // reactstrap components
// import {
//   Badge,
//   Card,
//   CardHeader,
//   CardBody,
//   Container,
//   Row,
//   Col,
//   Button,
//   Form,
//   FormGroup,
//   InputGroup,
//   InputGroupAddon,
//   InputGroupText,
//   Input,
// } from 'reactstrap';
// // core components
// import classnames from 'classnames';

// import SimpleHeader from 'components/Headers/SimpleHeader.jsx';

// class Chat extends React.Component {
//   state = {
//     message: '',
//     messages: [],
//     recieverId: '',
//   };

//   setRecieverId = (id) => {
//     this.setState({ recieverId: id });
//   };
//   onChangeHandler = (e) => {
//     let name = e.target.name;
//     this.setState({ [name]: e.target.value });
//   };
//   componentDidMount() {
//     if (this.props.User.user.name) {
//       const username = this.props.User.user.name;
//       this.props.registerChatUser(username);
//     }
//   }
//   onMessageSubmitHandler = () => {
//     this.props.privateMessage(this.state.message, this.state.recieverId);
//   };
//   render() {
//     // console.log(
//     //   this.props.Chat,
//     //   this.state.recieverId,
//     //   this.state.message,
//     //   'user details'
//     // );

//     return (
//       <>
//         <SimpleHeader name='Chat Component' />
//         <Container className='mt--6' fluid>
//           <Row>
//             {this.props.Chat.usersOnline
//               ? this.props.Chat.usersOnline.map((user, index) => {
//                   return (
//                     <Card key={index}>
//                       <CardBody>
//                         <Row className='align-items-center'>
//                           <Col className='col-auto'>
//                             <a
//                               className='avatar avatar-xl rounded-circle'
//                               href='#pablo'
//                               onClick={(e) => e.preventDefault()}
//                             >
//                               <img alt='...' src={user.avatar} />
//                             </a>
//                           </Col>
//                           <div className='col ml--2'>
//                             <h4 className='mb-0'>
//                               <a
//                                 href='#pablo'
//                                 onClick={(e) => e.preventDefault()}
//                               >
//                                 {user.username}
//                               </a>
//                             </h4>
//                             <p className='text-sm text-muted mb-0'>
//                               Working remoteley
//                             </p>
//                             <span className='text-success mr-1'>●</span>
//                             <small>Active</small>
//                           </div>
//                           <Col className='col-auto'>
//                             <Button
//                               color='primary'
//                               size='sm'
//                               type='button'
//                               onClick={() => this.setRecieverId(user.userId)}
//                             >
//                               Chat
//                             </Button>
//                           </Col>
//                         </Row>
//                       </CardBody>
//                     </Card>
//                   );
//                 })
//               : ''}

//             <Col lg='6'>
//               <Card className='bg-secondary border-0 mb-0'>
//                 <CardBody className='px-lg-5 py-lg-5'>
//                   <div className='text-center text-muted mb-4'>
//                     <small>Send Message</small>
//                   </div>
//                   <Form
//                     role='form'
//                     onSubmit={() => this.onMessageSubmitHandler()}
//                   >
//                     <FormGroup
//                       className={classnames('mb-3', {
//                         //   focused: this.state.focusedEmail,
//                       })}
//                     >
//                       <InputGroup className='input-group-merge input-group-alternative'>
//                         <InputGroupAddon addonType='prepend'>
//                           <InputGroupText>
//                             <i className='ni ni-single-02' />
//                           </InputGroupText>
//                         </InputGroupAddon>
//                         <Input
//                           placeholder='Type your message'
//                           type='text'
//                           name='message'
//                           value={this.state.message}
//                           onFocus={() => this.setState({ focusedEmail: true })}
//                           onBlur={() => this.setState({ focusedEmail: false })}
//                           onChange={this.onChangeHandler}
//                         />
//                       </InputGroup>
//                     </FormGroup>
//                     <div className='text-center'>
//                       <Button className='my-4' color='primary' type='submit'>
//                         Send
//                       </Button>
//                     </div>
//                   </Form>
//                 </CardBody>
//               </Card>
//               <Card className='bg-gradient-default shadow'>
//                 <CardHeader className='bg-transparent'>
//                   <h3 className='mb-0 text-white'>Dark timeline</h3>
//                 </CardHeader>

//                 <ul></ul>
//                 {/* <CardBody>
//                   <div
//                     className='timeline timeline-one-side'
//                     data-timeline-axis-style='dashed'
//                     data-timeline-content='axis'
//                   >
//                     <div className='timeline-block'>
//                       <span className='timeline-step badge-success'>
//                         <i className='ni ni-bell-55' />
//                       </span>
//                       <div className='timeline-content'>
//                         <small className='text-light font-weight-bold'>
//                           10:30 AM
//                         </small>
//                         <h5 className='text-white mt-3 mb-0'>New message</h5>
//                         <p className='text-light text-sm mt-1 mb-0'>
//                           Nullam id dolor id nibh ultricies vehicula ut id elit.
//                           Cum sociis natoque penatibus et magnis dis parturient
//                           montes, nascetur ridiculus mus.
//                         </p>
//                         <div className='mt-3'>
//                           <Badge color='success' pill>
//                             design
//                           </Badge>
//                           <Badge color='success' pill>
//                             system
//                           </Badge>
//                           <Badge color='success' pill>
//                             creative
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                     <div className='timeline-block'>
//                       <span className='timeline-step badge-danger'>
//                         <i className='ni ni-html5' />
//                       </span>
//                       <div className='timeline-content'>
//                         <small className='text-light font-weight-bold'>
//                           10:30 AM
//                         </small>
//                         <h5 className='text-white mt-3 mb-0'>Product issue</h5>
//                         <p className='text-light text-sm mt-1 mb-0'>
//                           Nullam id dolor id nibh ultricies vehicula ut id elit.
//                           Cum sociis natoque penatibus et magnis dis parturient
//                           montes, nascetur ridiculus mus.
//                         </p>
//                         <div className='mt-3'>
//                           <Badge color='danger' pill>
//                             design
//                           </Badge>
//                           <Badge color='danger' pill>
//                             system
//                           </Badge>
//                           <Badge color='danger' pill>
//                             creative
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                     <div className='timeline-block'>
//                       <span className='timeline-step badge-info'>
//                         <i className='ni ni-like-2' />
//                       </span>
//                       <div className='timeline-content'>
//                         <small className='text-light font-weight-bold'>
//                           10:30 AM
//                         </small>
//                         <h5 className='text-white mt-3 mb-0'>New likes</h5>
//                         <p className='text-light text-sm mt-1 mb-0'>
//                           Nullam id dolor id nibh ultricies vehicula ut id elit.
//                           Cum sociis natoque penatibus et magnis dis parturient
//                           montes, nascetur ridiculus mus.
//                         </p>
//                         <div className='mt-3'>
//                           <Badge color='info' pill>
//                             design
//                           </Badge>
//                           <Badge color='info' pill>
//                             system
//                           </Badge>
//                           <Badge color='info' pill>
//                             creative
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                     <div className='timeline-block'>
//                       <span className='timeline-step badge-success'>
//                         <i className='ni ni-bell-55' />
//                       </span>
//                       <div className='timeline-content'>
//                         <small className='text-light font-weight-bold'>
//                           10:30 AM
//                         </small>
//                         <h5 className='text-white mt-3 mb-0'>New message</h5>
//                         <p className='text-light text-sm mt-1 mb-0'>
//                           Nullam id dolor id nibh ultricies vehicula ut id elit.
//                           Cum sociis natoque penatibus et magnis dis parturient
//                           montes, nascetur ridiculus mus.
//                         </p>
//                         <div className='mt-3'>
//                           <Badge color='success' pill>
//                             design
//                           </Badge>
//                           <Badge color='success' pill>
//                             system
//                           </Badge>
//                           <Badge color='success' pill>
//                             creative
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                     <div className='timeline-block'>
//                       <span className='timeline-step badge-danger'>
//                         <i className='ni ni-html5' />
//                       </span>
//                       <div className='timeline-content'>
//                         <small className='text-light font-weight-bold'>
//                           10:30 AM
//                         </small>
//                         <h5 className='text-white mt-3 mb-0'>Product issue</h5>
//                         <p className='text-light text-sm mt-1 mb-0'>
//                           Nullam id dolor id nibh ultricies vehicula ut id elit.
//                           Cum sociis natoque penatibus et magnis dis parturient
//                           montes, nascetur ridiculus mus.
//                         </p>
//                         <div className='mt-3'>
//                           <Badge color='danger' pill>
//                             design
//                           </Badge>
//                           <Badge color='danger' pill>
//                             system
//                           </Badge>
//                           <Badge color='danger' pill>
//                             creative
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </CardBody>
//                */}
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </>
//     );
//   }
// }

// // export default Chat;
// const mapStateToProps = (state) => {
//   return {
//     Chat: state.Chat,
//     User: state.User,
//   };
// };
// const mapDispatchToProps = {
//   registerChatUser,
//   privateMessage,
// };
// export default connect(mapStateToProps, mapDispatchToProps)(Chat);
