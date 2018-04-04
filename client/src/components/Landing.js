import React, { Component } from 'react';
import axios from 'axios';

export default class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'isLoggedIn': null
    };
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

    if (!user) {
      return this.setState({
        'isLoggedIn': false
      });
    }

    this.setState({
      'isLoggedIn': true
    });
  }

  pageContent() {
    switch (this.state.isLoggedIn) { // handle authentication status
      case false:
        return (
          <div>
            <p>This is a basic app to help us network</p>
            <hr />
            <p>First, sign in with GitHub by clicking the button in the upper right</p>
            <p>Then you can see who else is here, their email addresses and links to their githubs</p>
          </div>
        );

      case true:
        return (
          <div>
            <p>Here is a listing of people</p>
          </div>
        );

      default: // do nothing until it's known if the user is logged in or not
    }
  }

  render() {
    return (
      <div style={{ 'padding': 25 }}>
        {this.pageContent()}
      </div>
    );
  }
};
