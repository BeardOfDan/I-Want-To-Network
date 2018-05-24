import React, { Component } from 'react';
import { Grid, Form, FormGroup } from 'react-bootstrap';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import axios from 'axios';

import NotLoggedIn from './helpers/notLoggedIn.js';
import makePeopleCards from './helpers/makePeopleCards.js';

import FormStyles from './styles/formStyles.js';

// This is a user to use to display that an error occurred during the search for other users
const errorUser = {
  'email': 'ERROR@ERROR.com',
  'username': 'ERROR',
  'githubURL': 'github.com/ERROR',
  'photoURL': 'https://thumb9.shutterstock.com/display_pic_with_logo/481717/230429635/stock-vector-error-stamp-230429635.jpg'
};

export default class NearMe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'user': this.props.user,
      'loggedIn': this.props.isLoggedIn,
      'criteria': 'distance', // can be 'state', 'city' (meaning city, state), or distance (in miles)
      'distance': 0, // miles from user's city, state
      'matches': { 'state': [], 'city': [], 'distance': [] }
    };
  }

  changeCriteria(criteria) {
    this.setState({ 'criteria': criteria.value });
  }

  changeDistance() {
    const distance = document.getElementById('distance').value;
    this.setState({ 'distance': distance });
  }

  getCriteriaPath(criteria) {
    switch (criteria) {
      case 'state':
      case 'city':
        return `/api/userCountFiltered/${this.state.user.state}/`;

      case 'distance':
        return `/api/userCountDistance/${this.state.distance}/`;

      default:
        console.log(`Error! Invalid Search Criteria: '${criteria}'`);
    }
  }

  handleSubmission(e) {
    e.preventDefault();

    const values = {};

    if (this.state.criteria) {
      values.criteria = this.state.criteria;
      values.state = this.state.user.state;

      if (this.state.criteria === 'distance') {
        values.distance = this.state.distance;
      }

      if (this.state.criteria !== 'state') {
        values.city = this.state.user.city;
      }
    }

    const path = this.getCriteriaPath(values.criteria);

    axios.post(path, values)
      .then((res) => {
        const matches = this.state.matches;

        if (res.data.error !== undefined) {
          errorUser.username = 'Error:';
          errorUser.state = res.data.error;

          matches[this.state.criteria] = [errorUser];
        }

        // Add matches (except for the current user)
        matches[this.state.criteria] = res.data.matches.filter((user, index, people) => {
          return user.username !== this.state.user.username;
        });

        this.setState({ matches });
      })
      .catch((e) => {
        console.log(`\n\nAxios Error!: \n${JSON.stringify(e, undefined, 2)} \n\n`);
      });

  }

  displayMatches() {
    const { criteria, matches } = this.state;

    if (matches[criteria].length > 0) {
      return makePeopleCards(matches[criteria]);
    }
  }

  pageContent() {
    switch (this.state.loggedIn) {
      case true:
        return (
          <Grid>
            <Form style={FormStyles} onSubmit={this.handleSubmission.bind(this)} >
              <br />
              <FormGroup>
                <h5>Find people near you!</h5>
              </FormGroup>
              <br />
              <FormGroup>
                <label>Criteria Type</label>
                <Select name="criteria" value={this.state.criteria}
                  onChange={this.changeCriteria.bind(this)}
                  options={[
                    { 'value': 'state', 'label': 'state' },
                    { 'value': 'city', 'label': 'city' },
                    { 'value': 'distance', 'label': 'distance' }
                  ]} />
              </FormGroup>
              {
                this.state.criteria === 'state' &&
                <FormGroup>
                  <p>{this.state.user.state}</p>
                </FormGroup>
              }
              {
                this.state.criteria === 'city' &&
                <FormGroup>
                  <p>{this.state.user.city}, {this.state.user.state}</p>
                </FormGroup>
              }
              {
                this.state.criteria === 'distance' &&
                <FormGroup>
                  <label>Distance (miles) from {this.state.user.city}, {this.state.user.state}</label>
                  <input id="distance" type="number" value={this.state.distance} min={0}
                    onChange={this.changeDistance.bind(this)} />
                </FormGroup>
              }

              <br />
              <input type="submit" value="Search" />
            </Form>
          </Grid>
        );

      case false:
        return <NotLoggedIn />;

      // do nothing until auth status is determined
      default: // null
    }
  }

  render() {
    return (
      <div style={this.props.renderStyles} >
        {this.pageContent()}
        {
          (this.state.matches[this.state.criteria].length > 0) &&
          <div>
            <br />
            <hr />
            <br />
          </div>
        }
        {this.displayMatches()}
      </div>
    );
  }
};
