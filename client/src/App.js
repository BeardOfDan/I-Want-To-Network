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
      'user': null
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
          <Route exact path="/" component={() => <Landing user={this.state.user} />} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/nearMe/" component={NearMe} />
        </div>
      </BrowserRouter>
    );
  }
};

