import React, { Component } from 'react';
import { Grid, Form, FormGroup } from 'react-bootstrap';
import axios from 'axios';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'action': null,
      'user': null,
      'linkedIn': null,
      'state': null,
      'city': null
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

    this.setState({ 'user': (user ? user : false) });
  }

  addLinkedIn() {
    const URL = document.getElementById('linkedInURL').value;

    this.setState({ 'linkedInURL': URL });
  }

  addState() {
    const state = document.getElementById('state').value;

    this.setState({ state });
  }

  addCity() {
    const city = document.getElementById('city').value;

    this.setState({ city });
  }

  handleSubmission(e) {
    e.preventDefault();

    console.log('\nThe state:');
    console.log(JSON.stringify(this.state, undefined, 2) + '\n');

    // Evaluate the state variables

    // send axios.post request to server

    // temp change pageContent to an 'updating user data...' message

    // receive response to request

    // if valid, make success screen
    // also put big button to prompt the user to return to the home page or something

    // else, present error message, prompt the user to try again later
  }

  pageContent() {
    if (this.state.action) { // if submitting/ed change

    }

    switch (this.state.user) { // handle authentication status
      case false: // The user is NOT logged in
        return (
          <div>
            <p>This is a basic app to help us network</p>
            <hr />
            <p>First, sign in with GitHub by clicking the button in the upper right</p>
            <p>Then you can see who else is here, their email addresses and links to their githubs</p>
          </div>
        );

      case null: // do nothing until it's known if the user is logged in or not
        break;

      default: // The user is logged in
        return (
          <Grid>
            <Form onSubmit={this.handleSubmission.bind(this)} >
              <br />
              <FormGroup>
                <h5>Add more personal info:</h5>
              </FormGroup>
              <br />
              <FormGroup>
                <label>LinkedIn URL</label>
                <input type="text" id="linkedInURL" autoFocus onChange={this.addLinkedIn.bind(this)} placeholder="LinkedIn URL" />
              </FormGroup>
              <FormGroup inline="true">
                <label>State:</label>
                <input id="state" type="text" placeholder="State" onKeyPress={this.addState.bind(this)} />
              </FormGroup>
              <FormGroup inline="true">
                <label>City:</label>
                <input id="city" type="text" placeholder="City" onKeyPress={this.addCity.bind(this)} />
              </FormGroup>
              <input type="submit" />

              {/* br tags for formatting */}
              <br />
              <br />
              <br />
              <br />
              <br />
            </Form>
          </Grid>
        );
    }
  }

  render() {
    return (
      <div>
        {this.pageContent()}
      </div>
    );
  }
}
