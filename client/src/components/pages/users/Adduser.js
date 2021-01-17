import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import Alert from "../../layout/Alert";
import { addNewUser, updateUser, getUser } from "../../../actions/user";
import Loader from "../../layout/Loader";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import shortid from "shortid";
import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";


class AddUser extends Component {
  state = {
    id: "",
    fullname: "",
    username: "",
    email: "",
    contactnumber: "",
    gender: "",
    avatar: "",
    jobTitle: "",
    saving: false,
    isEdit: false,
    imgUpd: false,
    src: "",
    systemRole: "",
    userID: "",
    usernamesArr: "",
    emailArr: "",
  };

  async componentDidMount() {
    const userID = Math.floor(Math.random() * 8999999999 + 1000000000);
    const tempPwd = shortid.generate();

    this.setState({
      userID: userID,
      tempPwd: tempPwd,
    });
    if (this.props.match.params.id) {
      const id = this.props.match.params.id;
      await this.props.getUser(id);
      const { user } = this.props;
      if (user) {
        this.setState({
          id: id,
          fullname: user.fullname,
          username: user.username,
          avatar: user.avatar,
          tempPwd: tempPwd,
          email: user.email,
          contactnumber: user.contactnumber,
          systemRole: user.systemRole,
          gender: user.gender,
          userID: userID,
          isEdit: true,
        });
      }
    }
    const { state } = this.props.location;
    if (state) {
      this.setState({
        usernamesArr: state.usernamesArr,
        emailArr: state.emailArr,
      });
    }
  }

  _onChange = async(e, id = "") => {
       this.setState({
      [e.target.name]: e.target.files[0],
      imgUpd: true,
      src: URL.createObjectURL(e.target.files[0]),
    });
  };

  handleChange = (e, type) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  validateEmail = (e) => {
    const {emailArr} = this.state;
    if (e.target.value.length > 0) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      var isInclude = emailArr.includes(e.target.value)
      if ((re.test(e.target.value)) && !isInclude) {
        this.setState({ email: e.target.value });
      } 

     else if((re.test(e.target.value)) && isInclude) {
        OCAlert.alertError("Email Already exists", { timeOut: 3000 });
        this.setState({ email: "" });
        return;     
       } 

       else {
        OCAlert.alertError("Email is not valid", { timeOut: 3000 });
        this.setState({ email: "" });
        return;
      }

    }
  };
  validateUserName = (e)=>{
    const {usernamesArr} = this.state;
    var isUserNameInclude = usernamesArr.includes(e.target.value)
    if (!isUserNameInclude) {
      this.setState({ username: e.target.value });
    } 
    else {
      OCAlert.alertError("Username already exists", { timeOut: 3000 });
      this.setState({ username: "" });
      return;
    }
  }

  handleChangeNumber = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ saving: true });
    const formData = new FormData();
    formData.append("avatar", this.state.avatar);
    formData.append("username", this.state.username);
    formData.append("fullname", this.state.fullname);
    formData.append("contactnumber", this.state.contactnumber);
    formData.append("email", this.state.email);
    formData.append("password", this.state.tempPwd);
    formData.append("systemRole", this.state.systemRole);
    formData.append("gender", this.state.gender);
    formData.append("jobTitle", this.state.jobTitle);
    formData.append("userID", this.state.userID);

    if (this.state.id === "") {
      await this.props.addNewUser(formData);
    } else {
      await this.props.updateUser(formData, this.state.id);
    }
    return;
    // this.setState({ saving: false, saved: true })
  };

  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/" />;
    }
    const { user } = auth;
    if (user && user.systemRole === "Employee") {
      return <Redirect to="/Error" />;
    }
    if (this.props.saved === true) {
      return (
        <Redirect
          push
          to={{
            pathname: "/user/configuresystemuser",
            state: { state: this.state, user: this.props.user },
          }}
        />
      );
    }
    return (
      <React.Fragment>
        <Loader />
        <div className="wrapper menu-collapsed">
          <Sidebar location={this.props.location}></Sidebar>
          <Header></Header>

          <div className="main-panel">
            <div className="main-content">
              <div className="content-wrapper">
                <div className="form-body">
                  <div className="card">
                    <div className="card-header">
                      <h4 className="form-section">
                        <i className="ft-user"></i>
                        {this.state.id === "" ? "Add New User" : "Update User"}
                      </h4>
                    </div>

                    <div className="card-body">
                      <form
                        className="form form-horizontal form-bordered"
                        encType="multipart/form-data"
                        action="/upload"
                        method="POST"
                        // onSubmit={(e) => this.onSubmit(e)}
                      >
                        <Alert />
                        <OCAlertsProvider />

                        <div className="row">
                          <div className="form-group col-md-6 mb-2">
                            <label
                              className="col-md-3 label-control"
                              htmlFor="inputGroupFile01"
                            >
                              Profile Image
                            </label>
                            <div className="custom-file col-md-9">
                              <input
                                name="avatar"
                                type="file"
                                className="custom-file-input border-primary"
                                id="inputGroupFile01"
                                aria-describedby="inputGroupFileAddon01"
                                accept="image/jpeg,image/gif,image/jpg,image/png,image/x-eps"
                                //required
                                onChange={(e) => this._onChange(e)}
                              />
                              <label
                                className="custom-file-label"
                                htmlFor="inputGroupFile01"
                              >
                                Select Profile Image
                              </label>
                            </div>
                          </div>
                          <div className="form-group col-md-6 mb-2 text-center">
                            {this.state.isEdit === true &&
                            this.state.imgUpd === false ? (
                              <img
                                className="media-object round-media"
                                src={this.state.avatar}
                                alt="User"
                                height={100}
                              />
                            ) : (
                              ""
                            )}
                            {this.state.imgUpd === true ? (
                              <img
                                className="media-object round-media"
                                src={`${this.state.src}`}
                                alt="User"
                                height={100}
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-3 label-control"
                                htmlFor="userinput1"
                              >
                                User Name
                              </label>
                              <div className="col-md-9">
                                <input
                                  type="text"
                                  id="userinput1"
                                  className="form-control border-primary"
                                  placeholder="User Name"
                                  required
                                  data-validation-required-message="This field is required"
                                  name="username"
                                  onChange={(e) =>
                                    this.handleChange(e, "username")
                                  }
                                  onBlur={(e) => this.validateUserName(e)}

                                  value={this.state.username}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-3 label-control"
                                htmlFor="userinput1"
                              >
                                Full Name
                              </label>
                              <div className="col-md-9">
                                <input
                                  type="text"
                                  id="userinput1"
                                  className="form-control border-primary"
                                  placeholder="Full Name"
                                  name="fullname"
                                  required
                                  onChange={(e) =>
                                    this.handleChange(e, "fullname")
                                  }
                                  value={this.state.fullname}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-3 label-control"
                                htmlFor="userinput1"
                              >
                                E-mail
                              </label>
                              <div className="col-md-9">
                                <input
                                  type="text"
                                  id="userinput2"
                                  className="form-control border-primary"
                                  placeholder="E-mail"
                                  name="email"
                                  required
                                  onChange={(e) =>
                                    this.handleChange(e, "email")
                                  }
                                  onBlur={(e) => this.validateEmail(e)}
                                  value={this.state.email}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-3 label-control"
                                htmlFor="userinput1"
                              >
                                Contact Number
                              </label>
                              <div className="col-md-9">
                                <input
                                  type="text"
                                  id="userinput2"
                                  className="form-control border-primary"
                                  required
                                  placeholder="Phone"
                                  name="contactnumber"
                                  // onKeyPress={(e)=>this.isNumberKey(e)}
                                  onChange={(e) => this.handleChangeNumber(e)}
                                  minLength={10}
                                  maxLength={10}
                                  value={this.state.contactnumber}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-3 label-control"
                                htmlFor="userinput1"
                              >
                                Job Title
                              </label>
                              <div className="col-md-9">
                                <input
                                  type="text"
                                  id="userinput1"
                                  className="form-control border-primary"
                                  placeholder="Job Title"
                                  name="jobTitle"
                                  required
                                  onChange={(e) =>
                                    this.handleChange(e, "jobTitle")
                                  }
                                  value={this.state.jobTitle}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-3 label-control"
                                htmlFor="userinput1"
                              >
                                Select Type
                              </label>
                              <div className="col-md-9 ">
                                <select
                                  id="type"
                                  name="systemRole"
                                  required
                                  defaultValue="----"
                                  className="form-control border-primary"
                                  onChange={(e) =>
                                    this.handleChange(e, "systemRole")
                                  }
                                >
                                  <option name="systemRole" value="">
                                    {" "}
                                    --- Select ---{" "}
                                  </option>
                                  <option name="systemRole" value="Admin">
                                    {" "}
                                    Admin{" "}
                                  </option>
                                  <option name="systemRole" value="Employee">
                                    {" "}
                                    Employee{" "}
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-3 label-control"
                                htmlFor="userinput1"
                              >
                                Gender
                              </label>
                              <div className="col-md-9">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="gender"
                                    onChange={(e) =>
                                      this.handleChange(e, "gender")
                                    }
                                    // checked={this.state.gender === 'male'}
                                    value="male"
                                    required
                                  />{" "}
                                  Male
                                </label>
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    onChange={(e) =>
                                      this.handleChange(e, "gender")

                                    }
                                    required

                                    // checked={this.state.gender === 'female'}
                                  />{" "}
                                  Female
                                </label>
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="gender"
                                    value="other"
                                    onChange={(e) =>
                                      this.handleChange(e, "gender")
                                    }
                                    required

                                    // checked={this.state.gender === 'other'}
                                  />{" "}

                                  Others
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6"></div>
                        </div>
                        <div className="form-actions top">
                          {
                          this.state.contactnumber === "" ||
                          this.state.email === "" ||
                          this.state.fullname === "" ||
                          this.state.gender === "" ||
                          this.state.systemRole === "" ||
                          this.state.jobTitle === "" ? (
                            <button className="mb-2 mr-2 btn btn-raised btn-primary disabled">
                              <i className="ft-chevron-right" /> Next
                            </button>
                          ) : (
                            <>
                              {this.state.systemRole === "Employee" ? (
                                <Link
                                  to={{
                                    pathname: "/user/configuresystem",
                                    state: this.state,
                                  }}
                                  className="mb-2 mr-2 btn btn-raised btn-primary"
                                >
                                  <i className="ft-chevron-right" /> Next
                                </Link>
                              ) : (
                                <button
                                  type="submit"
                                  onClick={(e) => this.onSubmit(e)}
                                  className="mb-2 mr-2 btn btn-raised btn-primary"
                                >
                                  <i className="ft-chevron-right" /> Next
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer className="footer footer-static footer-light">
              <p className="clearfix text-muted text-sm-center px-2">
                <span>
                  Quyền sở hữu của &nbsp;{" "}
                  <a
                    href="https://www.sutygon.com"
                    id="pixinventLink"
                    target="_blank"
                    className="text-bold-800 primary darken-2"
                  >
                    SUTYGON-BOT{" "}
                  </a>
                  , All rights reserved.{" "}
                </span>
              </p>
            </footer>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

AddUser.propTypes = {
  getUser: PropTypes.func.isRequired,
  auth: PropTypes.object,
  saved: PropTypes.bool,
  updateUser: PropTypes.func.isRequired,
  addNewUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  saved: state.user.saved,
  user: state.user.profile,
});
export default connect(mapStateToProps, {
  updateUser,
  addNewUser,

  getUser,
})(AddUser);
