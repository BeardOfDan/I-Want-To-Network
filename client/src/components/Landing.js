import React, { Component } from 'react';
import axios from 'axios';

import NotLoggedIn from './helpers/notLoggedIn.js';
import makePeopleCards from './helpers/makePeopleCards.js';

export default class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'isLoggedIn': this.props.isLoggedIn,
      'others': []
    };

    // Note: This variable cannot be greater than 12, otherwise the cardRow function will produce an error
    //         as this variable is used to determine the size of the bootstrap column
    this.rowLength = 4; // the number of cards per row
  }

  pageContent() {
    switch (this.state.isLoggedIn) { // handle authentication status
      case false:
        return <NotLoggedIn />;

      case true:
        // The folowing if statement prevents an infinite loop of updating the state / re-rendering this component
        if (this.state.others.length < 1) {
          axios.get('/api/people')
            .then((response) => {
              this.setState({ 'others': response.data });
            });
        }

        if (this.state.others.length < 1) {
          // Do nothing, until the state has loaded the list of people
        } else {
          return makePeopleCards(this.state.others);
        }
        break;

      default: // do nothing until it's known if the user is logged in or not
    }
  }

  render() {
    return (
      <div style={this.props.renderStyles} >
        {
          // TODO: add 'X people have registered'
        }
        {this.pageContent()}
      </div>
    );
  }
};
