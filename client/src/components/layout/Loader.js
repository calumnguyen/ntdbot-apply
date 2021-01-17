import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Loader = ({ auth, userLoading, customerLoading, ordersLoading, receiptsLoading }) => {
  if(auth.loading || userLoading || customerLoading || ordersLoading || receiptsLoading){
    return (
      <div className='loaderContainer'>
        <div className='loader'>
          <img
            src='/assets/logo-icon.gif'
            alt='Loader'
            className='loader-img'
            width='100'
          />
          <div className='ball-grid-pulse'>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  } else{
    return null;
  }
}
  // if page is loading show loader
  


Loader.propTypes = {
  courseLoading: PropTypes.bool,
  authLoading: PropTypes.bool,
  batchLoading: PropTypes.bool,
  teachersLoading: PropTypes.bool,
  programLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  userLoading: state.user.loading,
  customerLoading: state.customer.loading,
  ordersLoading: state.orders.loading,
  receiptsLoading: state.receipts.loading,
  auth: state.auth,
});
export default connect(mapStateToProps)(Loader);
