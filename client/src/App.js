import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './components/Header';
import Landing from './components/Landing';
import Profile from './components/Profile';
import NearMe from './components/NearMe.js';

import LoggedIn from './components/helpers/LoggedIn.js';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'user': null,
      'isLoggedIn': null
    };
  }

  componentDidMount() {
    LoggedIn(this.setState.bind(this));
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <Route exact path="/" component={() => <Landing isLoggedIn={this.state.isLoggedIn} />} />
          <Route exact path="/profile" component={() => { return <Profile user={this.state.user} isLoggedIn={this.state.isLoggedIn} />; }} />
          <Route path="/nearMe/" component={NearMe} />
        </div>
      </BrowserRouter>
    );
  }
};

