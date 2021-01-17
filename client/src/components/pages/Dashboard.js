import React, { Component } from 'react';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import Loader from '../layout/Loader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as moment from 'moment';
import '../../login.css';
import '../../dashbaord.css';
import { Redirect } from 'react-router-dom';

class Dashboard extends Component {
  async componentDidMount() {
    // await this.props.getShop();
    return;
  }

  // async changeShopStatus(status) {
  //   await this.props.changeShopStatus(status);
  //   await this.props.getShop();
  // }

  render() {
    // const { shop } = this.props;
    const { user } = this.props.auth;
    // if (user && user.systemRole === 'Employee') {
    //   if (shop) {
    //     let openShop = shop[0];
    //     if (openShop && openShop.status === 'off') {
    //       return (
    //         <Redirect
    //           push
    //           to={{
    //             pathname: '/storeclosed',
    //             shop: shop[0],
    //           }}
    //         />
    //       );
    //     }
    //   }
    // }
    // const startTime =
    //   this.props.shop[0] && moment(this.props.shop[0].shopStartTime);

    return (
      <React.Fragment>
        <Loader />
        <div className='wrapper menu-collapsed'>
          <Sidebar location={this.props.location}></Sidebar>
          <Header></Header>

          <div className='main-panel'>
            <div className='main-content'>
              <div className='content-wrapper'>
                <div className='row'>
                  <h4 className='ml-2 text-bold-400'>
                    Hello {user && user.fullname && `${user.fullname}`}, hope
                    you have a great day!
                  </h4>
                </div>

                {/* {user && user.systemRole === 'Admin' ? (
                  <>
                    <div className='row'>
                      <div className='col-md-12'>
                        <div className='card'>
                          <div className='card-body'>
                            <div className='row'>
                              <div className='col-md-7 txt-sep'>
                                <h2>
                                  Store was{' '}
                                  {this.props.shop[0] &&
                                    (this.props.shop[0].status === 'on'
                                      ? 'Opened'
                                      : 'Closed')}{' '}
                                  at
                                </h2>
                                <h1>
                                  {' '}
                                  <span className='badge badge-info'>
                                    {this.props.shop[0] &&
                                      startTime
                                        .tz('Asia/Vientiane')
                                        .format('hh:mm a')}
                                  </span>
                                </h1>
                                <p>
                                  <span className='badge badge-pill badge-light'>
                                    {this.props.shop[0] &&
                                      startTime
                                        .tz('Asia/Vientiane')
                                        .format('DD-MMM-YY')}
                                  </span>{' '}
                                </p>
                              </div>
                              <div className='col-md-3 txt-sep'>
                                <h3 className='mt-1'>Status</h3>
                                <p className='badge badge-pill badge-light'>
                                  {this.props.shop[0] &&
                                    (this.props.shop[0].status === 'on'
                                      ? 'Open'
                                      : 'Closed')}
                                </p>
                              </div>
                              <div className='col-md-2'>
                                <h3 className='mt-1'>Action</h3>
                                {this.props.shop[0] &&
                                  (this.props.shop[0].status === 'on' ? (
                                    <button
                                      type='button'
                                      onClick={() =>
                                        this.changeShopStatus('off')
                                      }
                                      className='btn btn-link'
                                    >
                                      Close Store
                                    </button>
                                  ) : (
                                    <button
                                      type='button'
                                      onClick={() =>
                                        this.changeShopStatus('on')
                                      }
                                      className='btn btn-link'
                                    >
                                      Open Store
                                    </button>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  ' '
                )} */}
              </div>
            </div>

            <footer className='footer footer-static footer-light'>
              <p className='clearfix text-muted text-sm-center px-2'>
                <span>
                  Copyright &nbsp;{' '}
                  <a
                    href='https://www.sutygon.com'
                    id='pixinventLink'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-bold-800 primary darken-2'
                  >
                    SUTYGON-BOT{' '}
                  </a>
                  , All rights reserved.{' '}
                </span>
              </p>
            </footer>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  changeShopStatus: PropTypes.func.isRequired,
  auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
  users: state.user.users,
  auth: state.auth,
});
export default connect(mapStateToProps, {})(Dashboard);
