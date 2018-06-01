import React, { Component } from 'react';
import { Alert, Button, Grid, Form, FormGroup } from 'react-bootstrap';
import axios from 'axios';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import NotLoggedIn from './helpers/notLoggedIn.js';

import FormStyles from './styles/formStyles.js';

import stateFieldValues from './utility/stateOptions.js';

const { StateOptions } = stateFieldValues;

export default class Profile extends Component {
  constructor(props) {
    super(props);

    console.log('this.props.user: ' + this.props.user + '\n\n');

    this.state = {
      'action': null, // null, 'pending', 'success', or 'error'
      'user': this.props.user,
      'isLoggedIn': this.props.isLoggedIn,
      'updatedUser': null, // this is returned from the api after the update occurs
      'linkedIn': '',
      'state': '',
      'city': '',
      'available': false,
      'changes': [] // changed values, ex: [{'field': 'available', 'previous': 'false', 'current': true}]
    };
  }

  componentDidMount() { // update input fields to user's current values, if they exist
    if (!this.state.user) {
      return;
    }

    const values = {};

    if (this.state.user.linkedin) {
      values.linkedIn = this.state.user.linkedin;
    }

    if (this.state.user.state) {
      values.state = this.state.user.state;

      if (this.state.user.city) {
        values.city = this.state.user.city;
      }
    }

    if (this.state.user.available !== undefined) {
      values.available = this.state.user.available;
    }

    this.setState(values);
  }

  getChangedFields() {
    const updated = this.state.updatedUser;
    const original = this.props.user;

    const changedKeys = [];

    for (let key in updated) {
      if (updated[key].toString() !== original[key].toString()) {
        changedKeys.push(key);
      }
    }

    return changedKeys;
  }

  setChanges() {
    const keys = this.getChangedFields();
    const changes = [];

    for (let i = 0; i < keys.length; i++) {
      changes[i] = {
        'field': keys[i],
        'previous': this.props.user[keys[i]],
        'current': this.state.user[keys[i]]
      };
    }

    this.setState({ changes });
    return changes;
  }

  getChanges() {
    const updated = this.state.updatedUser;
    const original = this.props.user;

    const keys = [];
    const changes = [];

    for (let key in updated) {

      console.log('\nkey: ' + key);
      console.log('updated[key]: ' + updated[key].toString());
      console.log('original[key]: ' + original[key].toString());

      if (updated[key].toString() !== original[key].toString()) {

        console.log('changed key: ' + key);

        keys.push(key);
      }
    }

    for (let i = 0; i < keys.length; i++) {
      changes[i] = {
        'field': keys[i],
        'previous': this.props.user[keys[i]],
        'current': this.state.user[keys[i]]
      };
    }

    // this.setState({ changes });
    return changes;
  }

  getChangeStats() {
    // const fieldStats = this.getChangedFields().map((field, index, fields) => {
    //   console.log('\nfield: ' + field);
    //   console.log('previous: ' + this.props.user[field]);
    //   console.log('current: ' + this.state.updatedUser[field]);
    //   return (
    //     <li key={index}>Hello</li>
    //     // <li key={index}>
    //     //   <h4>{field}</h4>
    //     //   <h6>Previous: {this.props.user[field]}</h6>
    //     //   <h6>Current: {this.state.updatedUser[field]}</h6>
    //     // </li>
    //   );
    // });

    if (this.state.changes.length > 0) {

      console.log('Unnecessary call to getChangeStats');

      return this.state.changes;
    }

    const changedFields = this.getChangedFields();
    const fieldStats = [];

    for (let i = 0; i < changedFields.length; i++) {
      const fieldName = changedFields[i];

      const current = (
        <li key={i}>
          <h4>{fieldName}</h4>
          <h6>Previous: {this.props.user[fieldName]}</h6>
          <h6>Current: {this.state.updatedUser[fieldName]}</h6>
        </li>
      );

      fieldStats.push(current);

      // fieldStats.push(changedFields[i]);
    }

    // console.log('\n\nfieldStats: ' + JSON.stringify(fieldStats, undefined, 2));

    // return [ // simple hardcoded array, so simple hardcoded keys
    //   <li key="0"><p to="/nearMe">Near Me</p></li>,
    //   <li key="1"><p to="/profile">Profile</p></li>,
    //   <li key="2"><a href="/auth/logout">Logout</a></li>
    // ];

    // TODO: change fieldStats from ['fieldName'] to [{'field', 'previous', 'previous'}]

    // this.setState({ 'changes': changedFields });

    return fieldStats;
  }

  addLinkedIn() {
    const URL = document.getElementById('linkedInURL').value;
    this.setState({ 'linkedIn': URL });
  }

  changeState(state) {
    this.setState({ 'state': (state !== null) ? state.value : '' });
  }

  changeCity() {
    const city = document.getElementById('city').value;
    this.setState({ city });
  }

  changeAvailability(available) {
    this.setState({ 'available': available ? available.value : false });
  }

  handleSubmission(e) {
    e.preventDefault();

    this.setState({ 'action': 'pending' });

    const values = {};

    if (this.state.state) {
      values.state = this.state.state.trim();

      if (this.state.city) {
        values.city = this.state.city.trim();
      }
    }

    if (this.state.linkedIn) {
      values.linkedIn = this.state.linkedIn.trim();
    }

    if (this.state.available !== 'undefined') {
      values.available = this.state.available;
    }

    axios.post('/api/updateProfile', values)
      .then(async (res) => {
        const newAction = (res.data.error === undefined) ? 'success' : 'error';

        // Update local React copy of user
        const updatedUser = this.state.user;
        for (let key in values) {
          updatedUser[key] = values[key];
        }

        // await this.setState({ 'user': updatedUser });
        await this.setState({
          'action': newAction,
          'updatedUser': res.data.updatedUser,
          'user': updatedUser
        });

        // await this.setChanges();

        if (newAction === 'error') {
          console.log('\n\naxios error: ' + JSON.stringify(res.data, undefined, 2));
        }
      })
      .catch((e) => {
        this.setState({ 'action': 'error' });
        console.log(`\n\nError! Error Object keys: ${Object.keys(e)}`);
        // console.log('\n\nError!\n' + e); // TODO: Add logging or something to note this event
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

            {/* TODO: use this.state.updatedValues to display what the new values are */}
            {/* on event confirmation button is pressed -> this.props.updateUser(updatedUser) */}

            <Alert bsStyle="success" onDismiss={this.handleDismiss}>
              <h2>You have successfully update your profile information!</h2>

              {/* Your updated user object is {JSON.stringify(this.state.updatedUser, undefined, 2)} */}

              <h4>Changed Fields:</h4>
              <ul>
                {/* {this.getChangeStats()} */}
                {
                  this.state.changes.length
                }

                {
                  this.getChanges().map((change, index, collection) => {
                    return (
                      <li key={index}>
                        <h4>{change.field}</h4>
                        <h6>Previous: {change.previous}</h6>
                        <h6>Current: {change.current}</h6>
                      </li>
                    );
                  })
                }

                {
                  this.state.changes.map((change, index, collection) => {
                    return (
                      <li key={index}>
                        <h4>{change.field}</h4>
                        <h6>Previous: {change.previous}</h6>
                        <h6>Current: {change.current}</h6>
                      </li>
                    );
                  })
                }
                <hr />
                {/* {this.state.changes.map((el, i, col) => {
                  return (
                    <li key={i}><h4>{el}</h4><h6>Previous: {this.props.user[el]}</h6><h6>Current: {this.state.updatedUser[el]}</h6></li>
                    // <li>{`Changed Field: ${el}`}</li>
                  );
                })} */}
                {/* {console.log(JSON.stringify(this.state.changes, undefined, 2))} */}
              </ul>

              <p>
                <Button bsStyle="primary">Take this action</Button>
                <span> or </span>
                <Button onClick={this.handleDismiss}>Hide Alert</Button>
              </p>
            </Alert>

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
            <Form style={FormStyles} onSubmit={this.handleSubmission.bind(this)} >
              <br />
              <FormGroup>
                <h5>Add more personal info:</h5>
              </FormGroup>
              <br />
              <FormGroup>
                <label>LinkedIn URL</label>
                <input type="text" value={this.state.linkedIn} id="linkedInURL" autoFocus onChange={this.addLinkedIn.bind(this)} placeholder="LinkedIn URL" />
              </FormGroup>
              <FormGroup inline="true">
                <label>State:</label>
                <Select name="state" value={this.state.state}
                  onChange={this.changeState.bind(this)}
                  options={StateOptions} />
              </FormGroup>
              <FormGroup inline="true">
                <label>City:</label>
                <input id="city" value={this.state.city} type="text" placeholder="City" onChange={this.changeCity.bind(this)} />
              </FormGroup>
              <FormGroup>
                <label>Available to help on a project:</label>
                <Select name="available" value={this.state.available}
                  onChange={this.changeAvailability.bind(this)}
                  options={[
                    { 'label': 'true', 'value': true },
                    { 'label': 'false', 'value': false }
                  ]} />
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
          </Grid >
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
