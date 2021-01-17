import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import { getUser } from "../../../actions/user";
import Loader from "../../layout/Loader";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class View extends Component {
    async componentDidMount() {
        if (this.props.match.params.id) {
            const id = this.props.match.params.id;
            await this.props.getUser(id);

        }
    }

    render() {
        const { auth } = this.props;
        const { user } = this.props;
        if (user) {

        } if (!auth.loading && !auth.isAuthenticated) {
            return <Redirect to="/" />;
        }

        return (
            <React.Fragment>
                <Loader />
                <div className="wrapper menu-collapsed">
                    <Sidebar location={this.props.location} >
                    </Sidebar>
                    <Header>
                    </Header>

                    <div className="main-panel">
                        <div className="main-content">
                            <div className="content-wrapper">
                                <div className="form-body">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="form-section"><i className="ft-user"></i>
                                              View User
                                            </h4>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="form-group col-md-6 mb-2 text-center">
                                                    {user ?
                                                        <>
                                                            <img alt={"User"}
                                                                id="projectinput8"
                                                                src={`${user.avatar}`}
                                                                height={290} width={250}
                                                            />
                                                        </> : ""}
                                                </div>
                                                <div className="form-group col-md-6 mb-2">
                                                    <div className="row">
                                                        <div className="form-group col-12 mb-2">
                                                            <label htmlFor="projectinput1">User Name</label>
                                                            <input type="text"
                                                                id="projectinput1"
                                                                className="form-control"
                                                                placeholder="User Name"
                                                                name="username"
                                                                value={user ? user.username : ""}
                                                            />
                                                        </div>
                                                        <div className="form-group col-12 mb-2">
                                                            <label htmlFor="projectinput3">E-mail</label>
                                                            <input type="text"
                                                                id="projectinput3"
                                                                className="form-control"
                                                                placeholder="E-mail"
                                                                name="email"
                                                                value={user ? user.email : ""}

                                                            />
                                                        </div>
                                                        <div className="form-group col-12 mb-2">
                                                            <label htmlFor="projectinput4">Contact Number</label>
                                                            <input type="text"
                                                                id="projectinput4"
                                                                className="form-control"
                                                                placeholder="Phone"
                                                                name="contactnumber"
                                                                value={user ? user.contactnumber : ""}
                                                            />

                                                        </div>
                                                        <div className="form-group col-12 mb-2">
                                                            <label htmlFor="projectinput6">Gender</label><br></br>
                                                            <label className="radio-inline">
                                                                <input
                                                                    type="radio"
                                                                    name="gender"
                                                                    checked={user ? user.gender === "male" : ""}
                                                                    value="male"

                                                                /> Male
                       </label>
                                                            <label className="radio-inline">
                                                                <input
                                                                    type="radio"
                                                                    name="gender"
                                                                    value="female"
                                                                    onChange={(e) => this.handleChange(e)}
                                                                    checked={user ? user.gender === "female" : ""}

                                                                /> Female
                         </label>

                                                            <label className="radio-inline">
                                                                <input
                                                                    type="radio"
                                                                    name="gender"
                                                                    value="other"
                                                                    onChange={(e) => this.handleChange(e)}
                                                                    checked={user ? user.gender === "other" : ""}

                                                                /> Others
                       </label>
                                                        </div>


                                                    </div>
                                                </div>

                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <footer className="footer footer-static footer-light">
                            <p className="clearfix text-muted text-sm-center px-2"><span>Quyền sở hữu của &nbsp;{" "}
                            <a href="https://www.sutygon.com" rel="noopener noreferrer"  id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">SUTYGON-BOT </a>, All rights reserved. </span></p>
                        </footer>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

View.propTypes = {
    saved: PropTypes.bool,
    getUser: PropTypes.func.isRequired,
    auth: PropTypes.object,

};

const mapStateToProps = (state) => ({
    saved: state.user.saved,
    auth: state.auth,
    user: state.user.profile,


});
export default connect(mapStateToProps, {
    getUser
})(View);

