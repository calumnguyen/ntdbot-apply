import React, { Component } from 'react';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';
import { addNewUser, updateUser, getUser } from '../../../actions/user';
import Alert from '../../layout/Alert';
import Loader from '../../layout/Loader';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class ConfigureSystemUser extends Component {
  state = {
    id: '',
    fullname: '',
    username: '',
    jobTitle: '',
    type: 'Admin',
    userID: '',
  };

  async componentDidMount() {
    // check form is to Add or Edit

    const { user } = this.props;
    const { state } = this.props.location.state;
    if (user) {
      this.setState({
        fullname: user.fullname,
        username: user.username,
        jobTitle: user.jobTitle,
        userID: user.userID,
        tempPwd: state.tempPwd && state.tempPwd,
      });
    }
  }

  handleChange = (e, id = '') => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to='/' />;
    }
    const { user } = auth;
    if (user && user.systemRole === 'Employee') {
      return <Redirect to='/Error' />;
    }
    if (this.props.user === null) {
      return <Redirect push={true} to='/user' />;
    }
    return (
      <React.Fragment>
        <Loader />
        <div className='wrapper menu-collapsed'>
          <Sidebar location={this.props.location}></Sidebar>
          <Header></Header>

          <div className='main-panel'>
            <div className='main-content'>
              <div className='content-wrapper'>
                <div className='form-body'>
                  <div className='card'>
                    <div className='card-header'>
                      <h3 className='form-section'>
                        {`${'Successfully added'} ${
                          this.state.fullname
                        } ${','} ${this.state.jobTitle}`}
                      </h3>
                    </div>

                    <div className='card-body'>
                      <form action='/upload' method='POST'>
                        {/* <div className="row ml-2 mb-2"> */}
                        <dl className='row ml-2 mb-2'>
                          <dt className='col-sm-3'>User Name :</dt>
                          <dd className='col-sm-9'>{this.state.username}</dd>
                        </dl>
                        {/* <label>User Name :</label>
                                                    <label>{this.state.username}</label> */}
                        {/* </div> */}
                        <dl className='row ml-2 mb-2'>
                          <dt className='col-sm-3'>ID# :</dt>
                          <dd className='col-sm-9'>{this.state.userID}</dd>
                        </dl>
                        {/* <div className="row ml-2 mb-2">
                                                    <label>ID# :</label>
                                                    <label>{this.state.userID}</label>
                                                </div> */}
                        <div className='row ml-2'>
                          <p>
                            Here is a temporary password for{' '}
                            <strong>{`${this.state.fullname}`}</strong>. We have
                            sent them an email with the credentials and they
                            must change their password when they log in for the
                            first time.
                          </p>
                        </div>

                        <div className='row ml-2'>
                          <div className='col-md-4'></div>
                          <div
                            className='col-md-4 d-flex align-items-center justify-content-center'
                            style={{
                              height: '10vh',
                              backgroundColor: 'whitesmoke',
                            }}
                          >
                            <h4 className='text-center'>
                              {' '}
                              {this.state.tempPwd}
                            </h4>
                          </div>
                          <div className='col-md-4'></div>
                        </div>

                        <div className='form-actions top'>
                          <Link
                            to='/user'
                            className='mb-2 mr-2 btn btn-raised btn-primary'
                          >
                            <i className='ft-chevron-down' /> Done
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer className='footer footer-static footer-light'>
              <p className='clearfix text-muted text-sm-center px-2'>
                <span>
                  Quyền sở hữu của &nbsp;{' '}
                  <a
                    href='https://www.sutygon.com'
                    id='pixinventLink'
                    target='_blank'
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

ConfigureSystemUser.propTypes = {
  saved: PropTypes.bool,
  addNewUser: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  auth: PropTypes.object,
  updateUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  saved: state.user.saved,
  auth: state.auth,
  user: state.user.user.user,
});
export default connect(mapStateToProps, {
  addNewUser,
  updateUser,
  getUser,
})(ConfigureSystemUser);
