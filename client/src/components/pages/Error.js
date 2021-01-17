import React, { Component } from "react";
import Loader from "../layout/Loader";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class Error extends Component {
  state = {
    redirect: false,
  };

  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/" />;
    }
    if (this.state.redirect) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <React.Fragment>
        <Loader />
        <div className="wrapper menu-collapsed">
          <div className="main-panel">
            {/* <div className='main-content'> */}
            {/* <div className='content-wrapper'> */}
            <section id="error">
              <div className="container-fluid forgot-password-bg overflow-hidden">
                <div className="row full-height-vh">
                  <div className="col-12 d-flex align-items-center justify-content-center">
                    <div className="row">
                      <div className="col-sm-12 text-center">
                        <img
                          src="assets/img/logo.png"
                          alt=""
                          className="img-fluid maintenance-img mb-2"
                          height="250"
                          width="300"
                        />
                        <h1 className="text-white mb-5 mt-n5">
                     ACCESS DENIED..
                        </h1>

                        <button className="btn btn-danger btn-lg mt-3">
                          <a
                            href="/dashboard"
                            className="text-decoration-none text-white"
                          >
                    <i className="ft-external-link"></i> Back to dashboard
                          </a>
                        </button>
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

Error.propTypes = {
  auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(Error);
