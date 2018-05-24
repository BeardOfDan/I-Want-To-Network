import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'isLoggedIn': this.props.isLoggedIn
    }
  }

  renderLogAction() { // Log in or out
    switch (this.state.isLoggedIn) {
      case false: // not logged in
        return (
          <li key="0"><a href="/auth/github">Login With Github</a></li>
        );

      case true:
        return [ // simple hardcoded array, so simple hardcoded keys
          <li key="0"><Link to="/nearMe">Near Me</Link></li>,
          <li key="1"><Link to="/profile">Profile</Link></li>,
          <li key="2"><a href="/auth/logout">Logout</a></li>
        ];

      default: // pending
        return undefined;
    }
  }

  render() {
    return (
      <nav style={{ 'paddingLeft': 25, 'paddingRight': 25 }}>
        <div className="nav-wrapper">
          <Link to="/" className="left brand-logo">
            Dev Net
          </Link>
          <ul className="right">
            {this.renderLogAction()}
          </ul>
        </div>
      </nav>
    );
  }
};
