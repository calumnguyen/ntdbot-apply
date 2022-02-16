import React, { Component } from 'react';
import Chatbot from '../Chatbot';
import Header from '../Header';

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
          <Header/>
          <Chatbot/>
      </section>
    );
  }
}

export default Welcome;