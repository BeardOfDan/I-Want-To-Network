import React, { Component } from 'react';

export default class NearMe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'user': this.props.user,
      'loggedIn': this.props.isLoggedIn,
      'criteria': 'state', // can be 'state', 'city' (meaning city, state), or distance (set number of miles)
      'matches': []
    };
  }

  pageContent() {
    switch (this.state.loggedIn) {
      case true:
        return (
          <div>
            You are logged in, and from [blank]. Find out who's near you!
        </div>
        );

      case false:
        return (
          <div>
            You are NOT logged in. Log in to access this page's content!
          </div>
        );

      // do nothing until auth status is confirmed
      default: // null
    }
  }

  render() {
    return (
      <div style={this.props.renderStyles} >
        {this.pageContent()}
      </div>
    );
  }
};
