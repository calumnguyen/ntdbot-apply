import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login, loadUser } from '../actions/auth';
import { updatePassword, getUser } from '../actions/user';
import { withRouter } from 'react-router-dom';
import Alert from './layout/Alert';
import { OCAlertsProvider } from '@opuscapita/react-alerts';
import { OCAlert } from '@opuscapita/react-alerts';
class Login extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    newpassword: '',
    confirmpassword: '',
    id: '',
    tempPass: '',
    userID: '',
  };

  async componentDidMount() {
    //await this.props.getUser(userID)
  }
  async componentDidUpdate(prevProps, prevState) {
    if (this.props.auth.error !== prevProps.auth.error) {
      const { auth } = this.props;
      const { userInfo } = auth.error;
      if (userInfo) {
        this.setState({
          tempPass: userInfo.tempPass,
          userID: userInfo.userID,
        });
      }
    }
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const { login } = this.props;
    const { username, password } = this.state;
    await login(username, password);
    if (this.props.isAuthenticated) {
      //load the user so that we know that password is changed or not
      await this.props.loadUser();
      let { user } = this.props.auth;
      if (!user) {
        this.props.history.push('/login');
      } else if (!user.isPasswordChanged) {
        this.props.history.push('/ActivateAccount');
      } else {
        this.props.history.push('/dashboard');
      }
    }
  };

  onUpdatePassword = async (e) => {
    e.preventDefault();
    const state = { ...this.state };
    const user = {
      currentpassword: state.password,
      newpassword: state.newpassword,
      confirmpassword: state.confirmpassword,
    };
    await this.props.updatePassword(user, state.userID);
  };

  valideTemppass = (password, e) => {
    e.preventDefault();
    const { tempPass } = this.state;
    if (tempPass !== password) {
      OCAlert.alertError('Wrong Password', { timeOut: 3000 });
      return;
    }
  };
  valideConfrmpass = (password, e) => {
    e.preventDefault();
    const { confirmpassword, newpassword } = this.state;
    if (password !== newpassword) {
      OCAlert.alertError(`Confirm password is wrong`, { timeOut: 3000 });
      return;
    }
  };

  render() {
    const { shop } = this.props;
    const { user } = this.props.auth;
    if (user && user.systemRole === 'Employee') {
      if (shop) {
        let openShop = shop[0];
        if (openShop) {
          if (this.props.AuthLoading === false && this.props.isAuthenticated) {
            if (openShop.status === 'on' && user.isPasswordChanged === true) {
              return <Redirect to='/dashboard' />;
            } else if (
              openShop.status === 'on' &&
              user.isPasswordChanged === false
            ) {
              return <Redirect to='/ActivateAccount' />;
            } else if (openShop.status === 'off') {
              return (
                <Redirect
                  push
                  to={{
                    pathname: '/storeclosed',
                    shop: shop[0],
                  }}
                />
              );
            }
          }
        }
      }
    } else if (user && user.systemRole === 'Admin') {
      if (this.props.AuthLoading === false && this.props.isAuthenticated) {
        if (user.isPasswordChanged === false) {
          return <Redirect to='/ActivateAccount' />;
        } else {
          return <Redirect to='/dashboard' />;
        }
      }
    }

    return (
      <div className='wrapper menu-collapsed'>
        <div className='main-panel'>
          <div className=''>
            <div className=''>
              <section id='login'>
                <div className='container-fluid'>
                  <div className='row full-height-vh m-0'>
                    <div className='col-12 d-flex align-items-center justify-content-center'>
                      <div className='card loginBox'>
                        <div className='card-content'>
                          <div className='card-body login-img'>
                            <div className='row m-0'>
                              {/* <div className='col-lg-6 d-lg-block d-none py-2 text-center align-middle mt-5 mb-n5 img-block'>
                                <img
                                  alt=''
                                  className='img-fluid imglogin'
                                  width='400'
                                  height='230'
                                ></img>
                              </div> */}
                              <div className='col-lg-12 col-md-12 bg-white px-4 pt-3'>
                                <div className='logo-img text-center align-middle'>
                                  <img
                                    alt={'Sutygon-bot'}
                                    src='assets/img/logos/logo.png'
                                    height={100}
                                    width={100}
                                  />
                                </div>
                                <h4
                                  className='mb-2 card-title text-center align-middle'
                                  style={{}}
                                >
                                  WELCOME TO DROPS-BOT
                                </h4>
                                <p className='card-text mb-3 text-center align-middle'>
                                  Please Sign In With Your Account
                                </p>
                                <form onSubmit={(e) => this.onSubmit(e)}>
                                  <Alert />

                                  <input
                                    type='text'
                                    className='form-control mb-3'
                                    placeholder='Username'
                                    required
                                    onChange={(e) => this.onChange(e)}
                                    name='username'
                                  />
                                  <input
                                    type='password'
                                    className='form-control mb-1'
                                    placeholder='Password'
                                    required
                                    onChange={(e) => this.onChange(e)}
                                    name='password'
                                  />
                                  <div className='fg-actions justify-content-between'>
                                    <div className='recover-pass'>
                                      <input
                                        className='btn btn-primary btn-lg btn-block'
                                        type='submit'
                                        value='Get Started'
                                      />
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        <div
          className='modal fade text-center'
          id='default'
          tabIndex='-1'
          role='dialog'
          aria-labelledby='myModalLabel1'
          aria-hidden='true'
        >
          <div className='modal-dialog' role='document'>
            <div className='modal-content' style={{ marginTop: '170px' }}>
              <div className='modal-header  text-center'>
                <h4 className='modal-title' id='myModalLabel1'>
                  Update Password
                </h4>
                <button
                  type='button'
                  className='close'
                  data-dismiss='modal'
                  aria-label='Close'
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <form onSubmit={(e) => this.onUpdatePassword(e)}>
                  <div className='row'>
                    <div className='col-md-12'>
                      {/* <div className="form-group row">
                        <label className="col-md-3 label-control">Username</label>
                        <div className="col-md-9">
                          <input
                            type="text"
                            className="form-control border-primary"
                            placeholder="Enter your username"
                            name="username"
                            value={this.state.username}
                            onChange={(e) => this.onChange(e) }
                          /></div>
                      </div> */}
                      <div className='form-group row'>
                        <label className='col-md-3 label-control'>
                          Current
                        </label>
                        <div className='col-md-9'>
                          <input
                            className='form-control border-primary'
                            placeholder='Current password'
                            name='password'
                            value={this.state.password}
                            onChange={(e) => this.onChange(e)}
                            onBlur={(e) =>
                              this.valideTemppass(this.state.password, e)
                            }
                          />
                        </div>
                      </div>
                      <div className='form-group row'>
                        <label className='col-md-3 label-control'>New</label>
                        <div className='col-md-9'>
                          <input
                            className='form-control border-primary'
                            placeholder='New password'
                            name='newpassword'
                            value={this.state.newpassword}
                            onChange={(e) => this.onChange(e)}
                          />
                        </div>
                      </div>
                      <div className='form-group row'>
                        <label className='col-md-3 label-control'>
                          Re-type New
                        </label>
                        <div className='col-md-9'>
                          <input
                            className='form-control border-primary'
                            placeholder='Re-type password'
                            name='confirmpassword'
                            value={this.state.confirmpassword}
                            onChange={(e) => this.onChange(e)}
                            onBlur={(e) =>
                              this.valideConfrmpass(
                                this.state.confirmpassword,
                                e
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='modal-footer'>
                    <button
                      type='submit'
                      className='btn grey btn-lg btn-outline-success'
                    >
                      Save Changes
                    </button>
                    <button
                      type='button'
                      className='btn btn-outline-danger btn-lg'
                      data-dismiss='modal'
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              <OCAlertsProvider />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.object,
  passwordUpdated: PropTypes.bool,
  userID: PropTypes.object,
  user: PropTypes.object,
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  updatePassword: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  AuthLoading: state.auth.loading,
  userID: state.auth.error,
  auth: state.auth,
  shop: state.dashboard.shop,
  passwordUpdated: state.user.passwordUpdated,
  user: state.user.user,
});

export default withRouter(
  connect(mapStateToProps, {
    login,
    loadUser,
    updatePassword,
    getUser,
  })(Login)
);
