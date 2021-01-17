import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Alert from "../layout/Alert";
import Loader from "../layout/Loader";
import { updatePassword, getUser } from "../../actions/user";
import { logout } from "../../actions/auth";

class ActivateAccount extends Component {
  state = {
    id: "",
    username: "",
    accountStatus: "",
    password: "",
    newpassword: "",
    confirmpassword: "",
    logout: false,
  };

 
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.passwordUpdated !== this.props.passwordUpdated) {
      await this.props.getUser(this.state.id);
    }
  }

  onChange = (e) => {
    // let { formData } = this.state;

    this.setState({ [e.target.name]: e.target.value });
  };
  onUpdatePassword = async (e) => {
    e.preventDefault();
    const state = { ...this.state };
    const { user } = this.props.auth;

    const data  = {
      currentpassword: state.password.trim(),
      newpassword: state.newpassword.trim(),
      confirmpassword: state.confirmpassword.trim(),
    };
    await this.props.updatePassword(data, user._id);
  };

  logout = async (e) => {
    e.preventDefault();
    await this.props.logout();
  };
  render() {
    const { user } = this.props.auth;

    if (user && user.type === "Admin") {
      if (this.props.AuthLoading === false && this.props.isAuthenticated) {
        return <Redirect to="/dashboard" />;
      }
    }

    if (this.props.passwordUpdated  && this.props.passwordUpdated === true) {
        return <Redirect to="/dashboard" />;
      
    }
   
    if (this.state.logout === true) {
      return <Redirect to="/login" />;
    }

    return (
      <React.Fragment>
        <Loader />
        <div className="wrapper menu-collapsed">
          <div className="main-panel">
            {/* <div className='main-content'> */}
            {/* <div className='content-wrapper'> */}
            <section id="maintenance" className="full-height-vh">
              <div className="container-fluid">
                <div className="row full-height-vh m-0">
                  <div className="col-12 d-flex align-items-center justify-content-center">
                    <div className="card m-5">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-12 col-md-12 bg-white px-4 pt-0">
                            <div className="logo-img text-center align-middle mt-n3">
                              <img
                                alt={"Sutygon-bot"}
                                src="assets/img/logos/logo.png"
                                height={140}
                                width={150}
                              />
                            </div>
                            <h3 className="card-text mb-1 mt-n0 text-center align-middle">
                              Update Password{" "}
                            </h3>
                            <form onSubmit={(e) => this.onUpdatePassword(e)}>
                              <Alert />

                             
                              <div className="form-group row">
                                <div className="col-md-12">
                                  <input
                                    type="password"
                                    className="form-control border-primary"
                                    placeholder="Current password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={(e) => this.onChange(e)}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <div className="col-md-12">
                                  <input
                                    type="password"
                                    className="form-control border-primary"
                                    placeholder="New password"
                                    name="newpassword"
                                    value={this.state.newpassword}
                                    onChange={(e) => this.onChange(e)}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <div className="col-md-12">
                                  <input
                                    type="password"
                                    className="form-control border-primary"
                                    placeholder="Re-type password"
                                    name="confirmpassword"
                                    value={this.state.confirmpassword}
                                    onChange={(e) => this.onChange(e)}
                                  />
                                </div>
                              </div>
                              <div className="fg-actions justify-content-between">
                                <div className="form-group row">
                                  <div className="col-md-6">
                                    <input
                                      className="btn btn-primary btn-lg btn-block"
                                      type="submit"
                                      value="Update Password"
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <input
                                      className="btn btn-danger btn-lg btn-block"
                                      type="button"
                                      value="        Logout         "
                                      onClick={(e) => this.logout(e)}
                                    />
                                  </div>
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
            </section>
            {/* </div> */}
            {/* </div> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

ActivateAccount.propTypes = {
  auth: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  getUser: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  AuthLoading: state.auth.loading,
  auth: state.auth,
  passwordUpdated: state.user.passwordUpdated,
  user: state.user.profile,
});

export default connect(mapStateToProps, {
  getUser,
  updatePassword,
  logout,
})(ActivateAccount);
