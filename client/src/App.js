import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './components/Header';
import Landing from './components/Landing';
import Profile from './components/Profile';
import NearMe from './components/NearMe.js';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <Route exact path="/" component={Landing} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/nearMe/" component={NearMe} />
        </div>
      </BrowserRouter>
    );
  }
};

