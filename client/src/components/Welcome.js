import React, { Component } from 'react';

class Welcome extends Component {
  state = {
    
  };

  async componentDidMount() {
    //await this.props.getUser(userID)
  }
  async componentDidUpdate(prevProps, prevState) {
    
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {

    return (
      <section className="welcome">
          <div className="jumbotron text-center font-weight-bolder bg-primary">Site is in construction</div>
      </section>
    );
  }
}

export default Welcome;