import React, { Component } from 'react'
import Sidebar from '../../layout/Sidebar'
import Header from '../../layout/Header'
import { addNewUser, updateUser, getUser } from '../../../actions/user'
import Alert from '../../layout/Alert'
import Loader from '../../layout/Loader'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import shortid from "shortid";

import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";


class ConfigureSystem extends Component {
    state = {
        id: '',
        fullname: '',
        username: '',
        jobTitle: '',
        contactnumber: '',
        email: '',
        Inventory: false,
        Rentproduct: false,
        Barcode: false,
        Orders: true,
        Customers: false,
        Appointments: false,
        Returnproduct: false,
        Calender: false,
        Report: false,
        sections: [],
        gender: '',
        avatar: '',
        userID: '',
        tempPwd: '',
        systemRole:'',
        saved: false,
        saving: false,

    }

    async componentDidMount() {
        // check form is to Add or Edit

        const { state } = this.props.location;
        const userID = Math.floor(Math.random() * 8999999999 + 1000000000);
        const tempPwd = shortid.generate();
        if (state) {
            this.setState({
                fullname: state.fullname,
                systemRole: state.systemRole,

                username: state.username,
                jobTitle: state.jobTitle,
                gender: state.gender,
                avatar: state.avatar,
                contactnumber: state.contactnumber,
                email: state.email,
                userID: userID,
                tempPwd: tempPwd
            })
            if(state.systemRole==="Admin"){
                this.setState({Orders:false});
            }
        }
    }

    _onChange = (e, id = '') => {
        this.setState({
            [e.target.name]: e.target.files[0],
            imgUpd: true,
            src: URL.createObjectURL(e.target.files[0]),
        })
    }

    selected = async () => {
        const sections = [];
        let value;
        const checkeds = document.getElementsByTagName('input');
        for (let i = 0; i < checkeds.length; i++) {
            if (checkeds[i].checked) {
                sections.push(checkeds[i].name);
            }
        }
        value = sections;
        this.setState({
            sections: sections
        })

    }
    handleChange = (e, name) => {
        this.setState({ [e.target.name]: !this.state[name] })
    }


    onSubmit = async (e) => {
        e.preventDefault();
        await this.selected();
        const sessionsArr = Object.values(this.state.sections);
        this.setState({ saving: true });

        if (this.state.systemRole === "Employee" && sessionsArr.length===0) {
            OCAlert.alertError("Configure User role", { timeOut: 3000 });
            this.setState({ saving: false });
            return;
        }
        const formData = new FormData()
        formData.append('avatar', this.state.avatar)
        formData.append('username', this.state.username)
        formData.append('fullname', this.state.fullname)
        formData.append('contactnumber', this.state.contactnumber)
        formData.append('email', this.state.email)
        formData.append('password', this.state.tempPwd)
        formData.append('systemRole', this.state.systemRole)
        formData.append('gender', this.state.gender)
        formData.append('sections', sessionsArr)
        formData.append('jobTitle', this.state.jobTitle)
        formData.append('userID', this.state.userID)


        if (this.state.id === '') {
            await this.props.addNewUser(formData)
        } else {
            await this.props.updateUser(formData, this.state.id)
        }
        return;
        
    }
    render() {
        const { auth } = this.props
        if (this.props.location.state == undefined) {
            return <Redirect to='/user/adduser' />
        }
        if (!auth.loading && !auth.isAuthenticated) {
            return <Redirect to='/' />
        }
        const { user } = auth;
        if (user && user.systemRole === "Employee") {
          return <Redirect to="/Error" />;
        }
        if (this.props.saved == true) {
            return <Redirect push to={{
                pathname: "/user/configuresystemuser",
                state: { state: this.state, user: this.props.user },

            }}
            />
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
                                            <h4 className='form-section'>
                                                {`${'Configure system for'} ${this.state.fullname} ${','} ${this.state.jobTitle}`}
                                            </h4>
                                        </div>

                                        <div className='card-body'>
                                            <Alert />
                                           <OCAlertsProvider />
                                            <form
                                                encType='multipart/form-data'
                                                action='/upload'
                                                method='POST'
                                                onSubmit={(e) => this.onSubmit(e)}
                                            >
                                                {/* <div className="row ml-3">

                                                    <div className='form-group col-md-3 mb-2'>
                                                        <br></br>
                                                        <label className='radio-inline'>
                                                            <input
                                                                type='checkbox'
                                                                name='Inventory'
                                                                onChange={(e) => this.handleChange(e, 'Inventory')}
                                                                checked={this.state.Inventory === true}
                                                                value={this.state.Inventory}
                                                            />{' '}
                                                        Inventory
                                                        </label>
                                                    </div>

                                                    <div className='form-group col-md-3 mb-2'>
                                                        <br></br>
                                                        <label className='radio-inline'>
                                                            <input
                                                                type='checkbox'
                                                                name='Returnproduct'
                                                                onChange={(e) => this.handleChange(e, 'Returnproduct')}
                                                                checked={this.state.Returnproduct === true}
                                                                value={this.state.Returnproduct}
                                                            />{' '}
                                                        Return Product
                                                        </label>

                                                    </div>
                                                    <div className='form-group col-md-5 mb-2'></div>

                                                </div> */}


                                                <div className="row ml-3">

                                                {/* <div className='form-group col-md-3 mb-2'>
                                                    <br></br>
                                                    <label className='radio-inline'>
                                                        <input
                                                            type='checkbox'
                                                            name='Barcode'
                                                            onChange={(e) => this.handleChange(e, 'Barcode')}
                                                            checked={this.state.Barcode === true}
                                                            value={this.state.Barcode}
                                                        />{' '}
                                                    Barcode
                                                    </label>

                                                </div> */}

                                                    <div className='form-group col-md-3 mb-2'>
                                                        <br></br>
                                                        <label className='radio-inline'>
                                                            <input
                                                                type='checkbox'
                                                                name='Orders'
                                                                onChange={(e) => this.handleChange(e, 'Orders')}
                                                                checked={this.state.Orders === true}
                                                                value={this.state.Orders}
                                                            />{' '}
                                                        Orders
                                                        </label>

                                                    </div>
                                                    <div className='form-group col-md-5 mb-2'></div>

                                                </div>

                                                {/* <div className="row ml-3">

                                                <div className='form-group col-md-3 mb-2'>
                                                    <br></br>
                                                    <label className='radio-inline'>
                                                        <input
                                                            type='checkbox'
                                                            name='Customers'
                                                            onChange={(e) => this.handleChange(e, 'Customers')}
                                                            checked={this.state.Customers === true}
                                                            value={this.state.Customers}
                                                        />{' '}
                                                    Customers
                                                    </label>

                                                </div>

                                                <div className='form-group col-md-3 mb-2'>
                                                    <br></br>
                                                    <label className='radio-inline'>
                                                        <input
                                                            type='checkbox'
                                                            name='Appointments'
                                                            onChange={(e) => this.handleChange(e, 'Appointments')}
                                                            checked={this.state.Appointments === true}
                                                            value={this.state.Appointments}
                                                        />{' '}
                                                    Appointments
                                                    </label>

                                                </div>
                                                <div className='form-group col-md-5 mb-2'></div>

                                                </div> */}

                                                {/* <div className="row ml-3">

                                                <div className='form-group col-md-3 mb-2'>
                                                    <br></br>
                                                    <label className='radio-inline'>
                                                        <input
                                                            type='checkbox'
                                                            name='Rentproduct'
                                                            onChange={(e) => this.handleChange(e, 'Rentproduct')}
                                                            checked={this.state.Rentproduct === true}
                                                            value={this.state.Rentproduct}
                                                        />{' '}
                                                    Rent a product
                                                    </label>

                                                </div>

                                                <div className='form-group col-md-3 mb-2'>
                                                    <br></br>
                                                    <label className='radio-inline'>
                                                        <input
                                                            type='checkbox'
                                                            name='Calender'
                                                            onChange={(e) => this.handleChange(e, 'Calender')}
                                                            checked={this.state.Calender === true}
                                                            value={this.state.Calender}
                                                        />{' '}
                                                    Calender
                                                    </label>

                                                </div>
                                                <div className='form-group col-md-5 mb-2'></div>

                                                </div> */}
                                                {/* <div className="row ml-3">

                                                <div className='form-group col-md-3 mb-2'>
                                                    <br></br>
                                                    <label className='radio-inline'>
                                                        <input
                                                            type='checkbox'
                                                            name='Report'
                                                            onChange={(e) => this.handleChange(e)}
                                                            checked={this.state.Report === true}
                                                            value={this.state.Report}
                                                        />{' '}
                                                    Report
                                                    </label>

                                                </div>

                                                <div className='form-group col-md-5 mb-2'></div>

                                                </div> */}

                                                <div className='form-actions top'>
                                                    {this.state.saving ? (
                                                        <button
                                                            type="button"
                                                            className="mb-2 mr-2 btn btn-raised btn-primary" >
                                                            <div
                                                                className="spinner-grow spinner-grow-sm "
                                                                role="status"></div>  &nbsp; Adding </button>
                                                    ) : (
                                                            <button
                                                                type="submit"
                                                                className="mb-2 mr-2 btn btn-raised btn-primary">
                                                                <i className="ft-check" /> Add User </button>
                                                        )}
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
        )
    }
}

ConfigureSystem.propTypes = {
    saved: PropTypes.bool,
    addNewUser: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    auth: PropTypes.object,
    updateUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    saved: state.user.saved,
    auth: state.auth,
})
export default connect(mapStateToProps, {
    addNewUser,
    updateUser,
    getUser,
})(ConfigureSystem)