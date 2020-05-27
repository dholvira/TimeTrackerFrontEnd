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
/*eslint-disable*/
import React from 'react';

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from 'reactstrap';

class Login extends React.Component {
  render() {
    return (
      <>
        <footer className='py-5' id='footer-main'>
          <Container>
            <Row className='align-items-center justify-content-xl-between'>
              <Col xl='6'>
                <div className='copyright text-center text-xl-left text-muted'>
                  © {new Date().getFullYear()}{' '}
                  <a
                    className='font-weight-bold ml-1'
                    href='http://bigberry.media/'
                    target='_blank'
                  >
                    BigBerry-Books
                  </a>
                </div>
              </Col>
              <Col xl='6'>
                <Nav className='nav-footer justify-content-center justify-content-xl-end'>
                  <NavItem>
                    <NavLink href='http://bigberry.media/' target='_blank'>
                      BigBerry
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href='http://bigberry.media/' target='_blank'>
                      About Us
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href='http://bigberry.media/' target='_blank'>
                      Blog
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href='http://bigberry.media/' target='_blank'>
                      License
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default Login;
