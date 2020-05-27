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
  Badge,
  // Button,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  // Progress,
  Table,
  Container,
  Row,
  // Col,
  // UncontrolledTooltip
} from 'reactstrap';
// core components
import { config } from '../../siteDetails';
import SimpleHeader from 'components/Headers/SimpleHeader.jsx';
import { connect } from 'react-redux';
import { getMyBreaks, getBreaksCount } from '../../actions/user_actions';
import Moment from 'react-moment';
// import { Redirect } from 'react-router-dom';
class EmployeeTimeSheet extends React.Component {
  state = {
    activeNav: 1,
    breaksCount: '',
    toggle: false,
    activePage: 1,
    totalSections: 0,
    activeSection: 0,
  };
  fetchMyData() {
    if (this.props.User.user.uid) {
      this.props.getMyBreaks(this.props.User.user.uid).then((res) => {
        console.log(res, 'employee all breaks');
      });
    } else {
      console.log('you might have reloaded go back to dashboard');
    }
  }
  pageCall = (page) => {
    this.setState({ activePage: page });
    console.log(page, 'page call');
    this.props.getMyBreaks(this.props.User.user.uid, page, 10).then((res) =>
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
  breaksCount() {
    if (this.props.User.user.uid) {
      this.props
        .getBreaksCount(this.props.User.user.uid)
        // .then(res => this.props.setBreaks(res))
        .then((res) => {
          if (res.data) {
            this.setState({ breaksCount: res.data });
            this.setState({ totalSections: Math.ceil(res.data / 50) });
          } else {
            this.setState({ breaksCount: 0 });
            this.setState({ totalSections: 0 });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('error fetching breaks Count');
    }
  }

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
  componentDidMount() {
    this.breaksCount();

    this.fetchMyData();
  }
  render() {
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
        <SimpleHeader name='Tables' parentName='Tables' />
        <Container className='mt--6' fluid>
          {/* {this.props.User.user.role == 'employee' ? ( */}
          <Row>
            <div className='col'>
              <Card>
                <CardHeader className='border-0'>
                  <h3 className='mb-0'>Breaks Records:</h3>
                </CardHeader>

                <Table className='align-items-center table-flush' responsive>
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
                      <th scope='col' />
                    </tr>
                  </thead>
                  <tbody className='list'>
                    {this.props.User.employeeData.map((item, index) => (
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
                            <Media>
                              <span className='name mb-0 text-sm'>
                                {item.user.name}
                              </span>
                            </Media>
                          </Media>
                        </th>
                        <td className='budget'>
                          <Moment format='DD/MM/YYYY  (HH:mm:ss)'>
                            {item.break_start}
                          </Moment>
                        </td>
                        <td className='budget'>
                          {item.break_end ? (
                            <Moment format='DD/MM/YYYY  (HH:mm:ss)'>
                              {item.break_end}
                            </Moment>
                          ) : (
                            '-NA-'
                          )}
                        </td>
                        <td className='budget'>
                          {Math.round(item.total_time / 60)} minutes
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

                        <td className='text-right'>
                          <UncontrolledDropdown>
                            <DropdownToggle
                              color=''
                              size='sm'
                              className='btn-icon-only text-light'
                            >
                              <i className='fas fa-ellipsis-v' />
                            </DropdownToggle>
                            <DropdownMenu className='dropdown-menu-arrow' right>
                              <DropdownItem
                                // href='#pablo'
                                onClick={(e) => e.preventDefault()}
                              >
                                Highlight
                              </DropdownItem>
                              <DropdownItem
                                // href='#pablo'
                                onClick={(e) => e.preventDefault()}
                              >
                                Description
                              </DropdownItem>
                              <DropdownItem
                                // href='#pablo'
                                onClick={(e) => e.preventDefault()}
                              >
                                Tag for error
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
          {/* // ) : ( // '' // )} */}
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
  getMyBreaks,
  getBreaksCount,
};
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeTimeSheet);
