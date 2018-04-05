import React, { Component } from 'react';
import axios from 'axios';

export default class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'isLoggedIn': null,
      'others': []
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

  makePersonCard(person) {
    return (
      <div key={person.id} className="card" style={{'width': '18rem'}}>
        <img className="card-img-top" src={person.photoURL} alt={person.username + '\'s pic'} />
        <div className="card-body">
          <h5 className="card-title">{person.username}</h5>
          <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <a href={person.githubURL} className="btn btn-primary">Check Out My Github</a>
        </div>
      </div>
    );
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
        axios.get('/api/people')
          .then((response) => {
            this.setState({ 'others': response.data });
          });

        if (this.state.others.length < 1) {
          return (<p>Here is a listing of people</p>);
        } else {
          return (
            <div>
              {this.state.others.map((person, index) => {
                return this.makePersonCard(person);
              })}
            </div>
          );
        }

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
