import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'loggedIn': null
    }
  }

  async componentDidMount() {
    const user = (await axios.get('/auth/currentUser')
      .then((response) => {
        return response.data;
      })
      .catch((e) => {
        console.log('error: ' + e);
        return null; // there's an error, so don't show the auth buttons in the header
      }));

    this.setState({
      'loggedIn': user ? true : false
    });
  }

  renderLogAction() { // Log in or out
    switch (this.state.loggedIn) {
      case false: // not logged in
        return (
          <li><a href="/auth/github">Login With Github</a></li>
        );
      case true:
        return [ // simple hardcoded array, so simple hardcoded keys
          <li key="0"><a href="/auth/logout">Logout</a></li>
        ];
      default: // pending
        return undefined;
    }
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Link to='/' className="left brand-logo">
            Network
          </Link>
          <ul className="right">
            {this.renderLogAction()}
          </ul>
        </div>
      </nav>
    );
  }
};
