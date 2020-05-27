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
  Container,
  Row,
  Col,
  FormGroup
  // UncontrolledTooltip
} from 'reactstrap';
// core components
import SimpleHeader from 'components/Headers/SimpleHeader.jsx';
import { connect } from 'react-redux';
import { getMyBreaks, getBreaksCount } from '../../actions/user_actions';
// import Moment from 'react-moment';
import ReactDatetime from 'react-datetime';
import moment from 'moment';
import { config } from '../../siteDetails';
import axios from 'axios';
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

class Eod extends React.Component {
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
      table: {}
    };
    this.handleDate = this.handleDate.bind(this);
  }
  searchHandler = () => {
    this.state.table.destroy();
    this.fetchMyData();
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
      url: `${config.serverUrl}break/eod`,
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

  handleDate(date) {
    this.setState({ date: moment(date).format('YYYY-MM-DD') });
  }
  componentDidMount() {
    this.fetchMyData();
  }
  render() {
    // console.log(this.props.User, 'date picked');

    const eodList = this.state.data;
    const tblrow = (item, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.user}</td>
          <td>{item.count}</td>
          <td>{Math.round(((item.total_time / 60) * 10) / 10)}</td>
        </tr>
      );
    };

    return (
      <>
        <SimpleHeader name='Tables' parentName='Tables' />
        <Container className='mt--6' fluid>
          {/* {this.props.User.user.role == 'employee' ? ( */}
          <Row>
            <div className='col'>
              <Card>
                <CardHeader className='border-0'>
                  <h3 className='mb-0'>Daily Breaks Logs:</h3>
                </CardHeader>
                <Row style={{ marginLeft: 10 }}>
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
                      color='primary'
                      type='button'
                      onClick={() => this.searchHandler()}
                    >
                      Search
                    </Button>
                  </div>
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
                      <th>Employee</th>
                      <th>Breaks Count</th>
                      <th>Total Time(min)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eodList.map((item, index) => tblrow(item, index))}
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
  getBreaksCount
};
export default connect(mapStateToProps, mapDispatchToProps)(Eod);
