import React, { Component } from 'react';
// import axios from 'axios';

export default class NearMe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'loggedIn': undefined,
      'criteria': 'state', // can be 'state', 'city' (meaning city, state), or distance (set number of miles)
      'matches': []
    };
  }

  // TODO: Have state form be a static list of states (and countries), thereby negating this issue (and spelling error issues)
  // // Case insensitive matching
  // matchState(state) {
  //   const states = {
  //     'California': ['CA', 'California']
  //   };
  // }

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
      default: // undefined
        return (
          <div>
            Temp div to not throw error
          </div>
        );
    }
  }

  render() {
    return this.pageContent();
  }
};
