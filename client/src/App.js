import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './components/Header';
import Landing from './components/Landing';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <Route exact path="/" component={Landing} />
          {/* <Route exact path="/mypolls" component={MyPolls} />
          <Route exact path="/newpoll" component={NewPoll} /> */}
          {/* <Route path="/username/poll/' component={Poll}" /> */}
        </div>
      </BrowserRouter>
    );
  }
};

