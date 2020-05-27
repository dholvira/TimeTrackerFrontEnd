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
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// reactstrap components
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Container,
  Row,
  Col
} from 'reactstrap';
import { connect } from 'react-redux';

class CardsHeader extends React.Component {
  render() {
    // if (this.props.User.breaks.data) {
    //   console.log(this.props.User.breaks.data);
    //   this.props.User.breaks.data.map((item, index) => {
    //     console.log(
    //       'start',
    //       item.break_start,
    //       'end',
    //       item.break_end,
    //       'break durations'
    //     );
    //   });
    // } else {
    // }
    return (
      <>
        <div className='header bg-info pb-6'>
          <Container fluid>
            <div className='header-body'>
              <Row className='align-items-center py-4'>
                <Col lg='6' xs='7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>
                    {this.props.name}
                  </h6>{' '}
                  <Breadcrumb
                    className='d-none d-md-inline-block ml-md-4'
                    listClassName='breadcrumb-links breadcrumb-dark'
                  >
                    <BreadcrumbItem>
                      <a href='#pablo' onClick={e => e.preventDefault()}>
                        <i className='fas fa-home' />
                      </a>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <a href='#pablo' onClick={e => e.preventDefault()}>
                        {this.props.parentName}
                      </a>
                    </BreadcrumbItem>
                    <BreadcrumbItem aria-current='page' className='active'>
                      {this.props.name}
                    </BreadcrumbItem>
                  </Breadcrumb>
                </Col>
                <Col className='text-right' lg='6' xs='5'>
                  <Button
                    className='btn-neutral'
                    color='default'
                    href='#pablo'
                    onClick={e => e.preventDefault()}
                    size='sm'
                  >
                    New
                  </Button>
                  <Button
                    className='btn-neutral'
                    color='default'
                    href='#pablo'
                    onClick={e => e.preventDefault()}
                    size='sm'
                  >
                    Filters
                  </Button>
                </Col>
              </Row>

              <Row>
                {/* <Col md='6' xl='3'>
                  <Card className='card-stats'>
                    <CardBody>
                      <Row>
                        <div className='col'>
                          <CardTitle
                            tag='h5'
                            className='text-uppercase text-muted mb-0'
                          >
                            New users
                          </CardTitle>
                          <span className='h2 font-weight-bold mb-0'>
                            2,356
                          </span>
                        </div>
                        <Col className='col-auto'>
                          <div className='icon icon-shape bg-gradient-orange text-white rounded-circle shadow'>
                            <i className='ni ni-chart-pie-35' />
                          </div>
                        </Col>
                      </Row>
                      <p className='mt-3 mb-0 text-sm'>
                        <span className='text-success mr-2'>
                          <i className='fa fa-arrow-up' /> 3.48%
                        </span>{' '}
                        <span className='text-nowrap'>Since last month</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col md='6' xl='3'>
                  <Card className='card-stats'>
                    <CardBody>
                      <Row>
                        <div className='col'>
                          <CardTitle
                            tag='h5'
                            className='text-uppercase text-muted mb-0'
                          >
                            Sales
                          </CardTitle>
                          <span className='h2 font-weight-bold mb-0'>924</span>
                        </div>
                        <Col className='col-auto'>
                          <div className='icon icon-shape bg-gradient-green text-white rounded-circle shadow'>
                            <i className='ni ni-money-coins' />
                          </div>
                        </Col>
                      </Row>
                      <p className='mt-3 mb-0 text-sm'>
                        <span className='text-success mr-2'>
                          <i className='fa fa-arrow-up' /> 3.48%
                        </span>{' '}
                        <span className='text-nowrap'>Since last month</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col md='6' xl='3'>
                  <Card className='card-stats'>
                    <CardBody>
                      <Row>
                        <div className='col'>
                          <CardTitle
                            tag='h5'
                            className='text-uppercase text-muted mb-0'
                          >
                            Performance
                          </CardTitle>
                          <span className='h2 font-weight-bold mb-0'>
                            49,65%
                          </span>
                        </div>
                        <Col className='col-auto'>
                          <div className='icon icon-shape bg-gradient-primary text-white rounded-circle shadow'>
                            <i className='ni ni-chart-bar-32' />
                          </div>
                        </Col>
                      </Row>
                      <p className='mt-3 mb-0 text-sm'>
                        <span className='text-success mr-2'>
                          <i className='fa fa-arrow-up' /> 3.48%
                        </span>{' '}
                        <span className='text-nowrap'>Since last month</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col> */}
              </Row>
            </div>
          </Container>
        </div>
      </>
    );
  }
}

CardsHeader.propTypes = {
  name: PropTypes.string,
  parentName: PropTypes.string
};
const mapStateToProps = state => {
  return {
    User: state.User
  };
};
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(CardsHeader);
