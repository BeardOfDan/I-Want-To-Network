import React, { Component } from 'react';
// import axios from 'axios';

export default class NearMe extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  render() {
    return (
      <div>
        Find people near you!
      </div>
    );
  }
};
