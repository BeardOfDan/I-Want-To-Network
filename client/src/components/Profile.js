import React, { Component } from 'react';
import { Grid, Form, FormGroup } from 'react-bootstrap';
import axios from 'axios';

import NotLoggedIn from './helpers/notLoggedIn.js';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'action': null, // null, 'pending', 'success', or 'error'
      'user': this.props.user,
      'isLoggedIn': this.props.isLoggedIn,
      'updatedValues': null, // this is returned from the api after the update occurs
      'linkedIn': null,
      'state': null,
      'city': null
    };
  }

  componentDidMount() { // update input fields to user's current values, if they exist
    if (!this.state.user) {
      return;
    }

    if (this.state.user.linkedin) {
      document.getElementById('linkedInURL').value = this.state.user.linkedin;
    }

    if (this.state.user.state) {
      document.getElementById('state').value = this.state.user.state;

      if (this.state.user.city) {
        document.getElementById('city').value = this.state.user.city;
      }
    }
  }

  addLinkedIn() {
    const URL = document.getElementById('linkedInURL').value;

    this.setState({ 'linkedIn': URL });
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

    this.setState({ 'action': 'pending' });

    const values = {};

    if (this.state.state) {
      values.state = this.state.state;

      if (this.state.city) {
        values.city = this.state.city;
      }
    }

    if (this.state.linkedIn) {
      values.linkedIn = this.state.linkedIn;
    }

    axios.post('/api/updateProfile', values)
      .then((res) => {
        const newAction = (res.data.error === undefined) ? 'success' : 'error';
        this.setState({ 'action': newAction, 'updatedValues': res.data.updatedUser });

        // Update local React copy of user
        const updatedUser = this.state.user;
        for (let key in values) {
          updatedUser[key] = values[key];
        }

        this.setState({ 'user': updatedUser });
      })
      .catch((e) => {
        this.setState({ 'action': 'error' });
        console.log('\n\nError!\n' + e); // TODO: Add logging or something to note this event
      });
  }

  pageContent() {
    switch (this.state.action) {
      // TODO: Add nice styling + possibly add an animation of some kind (at least for pending)

      case 'pending':
        return (
          <div>
            <h4>Updating your profile...</h4>
          </div>
        );

      case 'success':
        // TODO: Put big button to prompt the user to return to the home page or something
        return (
          <div>
            <h4>You have successfully update your profile information!</h4>
            {/* TODO: use this.state.updatedValues to display what the new values are */}
          </div>
        );

      case 'error':
        // TODO: Add logging or other notification system
        return (
          <div>
            <h3>There was an error in updating your profile! Please try again later</h3>
          </div>
        );

      case null:
        // do nothing, let the next switch handle it
        break;

      default:
        console.log(`Error! Attempted to change profile, but state.action had an invalid value! state.action=${JSON.stringify(this.state.action, undefined, 2)}`);
    }

    switch (this.state.isLoggedIn) { // handle authentication status
      case false: // The user is NOT logged in
        return <NotLoggedIn />;

      case true: // The user is logged in
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

              {/* br tags for formatting (I hate when there is no padding at the bottom of the page)*/}
              {/* TODO: Refactor from br tags to css padding-bottom */}
              <br />
              <br />
              <br />
              <br />
              <br />
            </Form>
          </Grid>
        );

      default:
      // do nothing until it's known if the user is logged in or not
    }
  }

  render() {
    return (
      <div style={this.props.renderStyles} >
        {this.pageContent()}
      </div>
    );
  }
}
