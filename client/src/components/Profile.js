import React, { Component } from 'react';
import { Grid, Form, FormGroup } from 'react-bootstrap';
import axios from 'axios';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'user': null,
      'linkedin': null,
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

  pageContent() {
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
            <Form /*onSubmit={this.handleSubmission.bind(this)} */>
              <br />
              <FormGroup>
                <h5>Add more personal info:</h5>
              </FormGroup>
              <br />
              <FormGroup>
                <label>LinkedIn URL</label>
                <input type="text" autoFocus /* onChange={this.addPollName.bind(this)} */ placeholder="LinkedIn URL" />
              </FormGroup>
              <FormGroup inline="true">
                <label>State:</label>
                <input id="newPollOption" type="text" placeholder="State" /* onKeyPress={this.newPollOptionKeyCapture.bind(this)} */ />
              </FormGroup>
              <FormGroup inline="true">
                <label>City:</label>
                <input id="newPollOption" type="text" placeholder="City" /* onKeyPress={this.newPollOptionKeyCapture.bind(this)} */ />
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
