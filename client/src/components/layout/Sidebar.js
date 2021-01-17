import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { changePage } from '../../actions/pages';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Sidebar extends Component {
  componentDidMount() {
    this.props.changePage(this.props.location.pathname.replace('/', ''));
  }
  getClassName = (name) => {
    const { pathname } = this.props.location;
    let { active } = this.props;

    const path = pathname.split('/');
    const activepath = active.split('/');

    if (activepath[0] === path[1]) {
      active = path[1];
    }

    if (active === name) {
      return 'open';
    } else {
      return '';
    }
  };

  handleClick = (name) => {
    this.props.changePage(name);
  };
  render() {
    const { user } = this.props.auth;

    return (
      <div
        data-active-color='white'
        data-background-color='purple-bliss'
        className='app-sidebar'
      >
        <div className='sidebar-header'>
          <div className='logo'>
            <Link to='/dashboard'>
              <div className='text-center align-middle mt-n4 mb-n4'>
                <img
                  alt={'Sutygon-bot'}
                  src={process.env.PUBLIC_URL + '/assets/img/logo.png'}
                  height={120}
                  width={120}
                />
              </div>
            </Link>
          </div>
        </div>
        <div className='sidebar-content'>
          <div className='nav-container'>
            <ul
              id='main-menu-navigation'
              data-menu='menu-navigation'
              data-scroll-to-active='true'
              className='navigation navigation-main'
            >
              <li className={'nav-item ' + this.getClassName('dashboard')}>
                <Link
                  to='/dashboard'
                  onClick={() => this.handleClick('dashboard')}
                >
                  <i className='ft-home' /> Dashboard
                </Link>
              </li>
              {user && user.systemRole === 'Admin' ? (
                <li className={this.getClassName('user')}>
                  <Link to='/user' onClick={() => this.handleClick('user')}>
                    <i className='ft-users' /> Users
                  </Link>
                </li>
              ) : (
                ''
              )}
            </ul>
          </div>
        </div>
        <div className='sidebar-background'></div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  active: PropTypes.string,
  changePage: PropTypes.func,
  location: PropTypes.object,
  auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
  active: state.pages.active,
  changePage: state.pages.changePage,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  changePage,
})(Sidebar);
