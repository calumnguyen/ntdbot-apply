import React, { Component } from 'react';

class Welcome extends Component {
  state = {
    
  };

  async componentDidMount() {
  }
  async componentDidUpdate(prevProps, prevState) {
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <section className="welcome">
          <b className="text-center">Site is in construction</b>
      </section>
    );
  }
}

export default Welcome;