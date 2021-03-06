import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './components/Header';
import Landing from './components/Landing';
import Profile from './components/Profile';
import NearMe from './components/NearMe.js';

import LoggedIn from './components/helpers/LoggedIn.js';

const renderStyles = { 'padding': 25 }; // style for div that wraps render function content

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

  updateUser(user) {
    console.log('updateUser: ' + JSON.stringify(user, undefined, 2));
    this.setState({ user });
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="" component={() => <Header isLoggedIn={this.state.isLoggedIn} />} />
          <Route exact path="/" component={() => <Landing isLoggedIn={this.state.isLoggedIn} renderStyles={renderStyles} />} />
          <Route exact path="/profile" component={() => <Profile user={this.state.user} isLoggedIn={this.state.isLoggedIn} renderStyles={renderStyles} updateUser={this.updateUser.bind(this)} />} />
          <Route exact path="/nearMe" component={() => <NearMe isLoggedIn={this.state.isLoggedIn} user={this.state.user} renderStyles={renderStyles} />} />
        </div>
      </BrowserRouter>
    );
  }
};

