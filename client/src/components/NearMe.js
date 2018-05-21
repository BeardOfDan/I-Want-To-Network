import React, { Component } from 'react';
import { Grid, Form, FormGroup } from 'react-bootstrap';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

// import axios from 'axios';

import NotLoggedIn from './helpers/notLoggedIn.js';

export default class NearMe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'user': this.props.user,
      'loggedIn': this.props.isLoggedIn,
      'criteriaType': 'state', // can be 'state', 'city' (meaning city, state), or distance (set number of miles)
      'criteriaValue': null,
      'matches': []
    };
  }

  changeCriteriaType(criteriaType) {
    this.setState({ criteriaType });
  }

  handleSubmission(e) {
    e.preventDefault();

    const values = {};

    if (this.state.criteriaType) {
      values.criteriaType = this.state.criteriaType;
    }


  }

  pageContent() {
    switch (this.state.loggedIn) {
      case true:
        return (
          <Grid>
            <Form onSubmit={this.handleSubmission.bind(this)} >
              <br />
              <FormGroup>
                <h5>Find people near you!</h5>
              </FormGroup>
              <br />
              <FormGroup>
                <label>Criteria Type</label>
                <Select name="criteriaType" value={this.state.criteriaType} onChange={this.changeCriteriaType.bind(this)}
                  options={[
                    { 'value': 'state', 'label': 'state' },
                    { 'value': 'city', 'label': 'city' },
                    { 'value': 'distance', 'label': 'distance' }
                  ]} />
              </FormGroup>
              {/* <FormGroup inline="true">
                <label>State:</label>
                <input id="state" type="text" placeholder="State" onKeyPress={this.addState.bind(this)} />
              </FormGroup> */}
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
      </div>
    );
  }
};
