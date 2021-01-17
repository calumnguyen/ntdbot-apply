import React, { Component } from "react";
import { logout } from "../../actions/auth";
import Loader from "../layout/Loader";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as moment from "moment";
import { Redirect } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

class StoreClosed extends Component {
  state = {
    id: "",
    status: "",
    shopStartTime: "",
    logout: false,
  };
  onLogout = async(e) => {
    e.preventDefault();
    await this.props.logout();
   
  };
  async componentDidMount() {
    const { shop } = this.props.location;

    if (shop) {
      this.setState({
        id: shop._id,
        status: shop.status,
        shopStartTime: shop.shopStartTime,
      });
    }
  }

  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/" />;
    }
    if (this.props.saved) {
      return <Redirect to="/user" />;
    }
    if (this.state.logout === true) {
      return <Redirect to="/login" />;
    }
    const momentshopStartTime = this.state.shopStartTime && moment(this.state.shopStartTime)
   
    return (
      <React.Fragment>
        <Loader />
        <div className="wrapper menu-collapsed">
          <div className="main-panel">
            {/* <div className='main-content'> */}
            {/* <div className='content-wrapper'> */}
            <section id="maintenance" className="full-height-vh">
              <div className="container-fluid">
                <div className="row full-height-vh">
                  <div className="col-12 d-flex align-items-center justify-content-center">
                    <div className="row">
                      <div className="col-sm-12 text-center">
                        <img
                          src="assets/img/logo.png"
                          alt=""
                          className="img-fluid maintenance-img mb-n5 mt-n4"
                          height="250"
                          width="300"
                        />
                        <h1 className="text-white font-large-3 text-bold-600">
                          Store is closed!!{" "}
                        </h1>
                        <div className="w-75 mx-auto maintenance-text mt-3">
                          <p className="text-white font-large-1 text-bold-400">
                            The store was closed at{" "}
                            {this.state.shopStartTime &&
                              `${momentshopStartTime.tz("Asia/Vientiane").format(
                                "hh:mm a"
                              )}`}{" "}
                            on{" "}
                            {this.state.shopStartTime &&
                              `${momentshopStartTime.tz("Asia/Vientiane").format(
                                "DD-MMM-YY"
                              )}`}
                            . Take a nap and comeback later!.
                          </p>
                          <p className="text-white">
                            If you believe this is a mistake, ask an admin to
                            open the store .
                          </p>
                        </div>
                        <button
                          className="btn bg-grey btn-outline-primary btn-lg mt-4"
                          type="button"
                          onClick={(e) => this.onLogout(e)}
                        >
                          Logout
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

StoreClosed.propTypes = {
  auth: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(StoreClosed);
