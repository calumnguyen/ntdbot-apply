import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Loader = ({ auth, userLoading }) => {
  if(auth.loading || userLoading){
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
  authLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  userLoading: state.user.loading,
  auth: state.auth,
});
export default connect(mapStateToProps)(Loader);
