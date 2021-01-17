import React from 'react'
import PropTypes from 'prop-types'
// Whenever you are interacting with redux whether you are calling an action or getting an action use connect
import { connect } from 'react-redux'

const Alert = ({ alerts }) =>
  alerts
    ? alerts !== null &&
      alerts.length > 0 &&
      alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {alert.msg}
        </div>
      ))
    : ''

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
}

// We want to get the alert state
// Mapping the redux state to props
const mapStateToProps = (state) => ({
  // here alert are equal to state.whatEverWeWantformRootReducer which is index.js
  alerts: state.alert,
})
export default connect(mapStateToProps)(Alert)
