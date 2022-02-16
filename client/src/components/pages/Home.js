import React, { Component } from 'react';
import Chatbot from '../Chatbot';
import Footer from '../Footer';
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
          <Footer/>
      </section>
    );
  }
}

export default Welcome;