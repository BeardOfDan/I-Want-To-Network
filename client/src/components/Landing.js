import React, { Component } from 'react';
import axios from 'axios';

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

  // async componentDidMount() {
  //   const user = (await axios.get('/auth/currentUser')
  //     .then((response) => {
  //       return response.data;
  //     })
  //     .catch((e) => {
  //       console.log('error: ' + e);
  //       return null; // there's an error, so don't show the auth buttons in the header
  //     }));

  //   if (!user) {
  //     return this.setState({
  //       'isLoggedIn': false
  //     });
  //   }

  //   this.setState({
  //     'isLoggedIn': true
  //   });
  // }

  makePersonCard(person) {
    // Inline styling variable
    const borderRadius = '5%';
    const marginLeftLinkedIn = '-5%';
    const marginLeftGitHub = '-2.5%';

    // Handle optional fields
    const location = (person.city ? (person.city + ', ') : '') + (person.state ? person.state : '');
    const linkedin = (<a href={person.linkedin} target="_blank" className="btn btn-primary" style={{ borderRadius, 'marginBottom': 10, 'marginLeft': marginLeftLinkedIn }}>{person.linkedin ? 'Check Out My LinkedIn' : ''}</a>);

    return (
      <div key={person.id} className="card" style={{ 'width': '18rem', borderRadius }}>
        <img className="card-img-top" src={person.photoURL} alt={person.username + '\'s profile pic'} style={{ 'borderTopRightRadius': borderRadius, 'borderTopLeftRadius': borderRadius }} />
        <div className="card-body" style={{ borderRadius }}>
          <h5 className="card-title">{person.username}</h5>
          <p className="card-text">{location ? location : ''}</p>
          {person.linkedin ? linkedin : ''}
          <a href={person.githubURL} target="_blank" className="btn btn-success" style={{ borderRadius, 'marginLeft': marginLeftGitHub }}>Check Out My Github</a>
        </div>
      </div>
    );
  }

  cardRows() { // turns an array of cards into an array of arrays with length of 3
    const people = this.state.others;
    const rows = [];

    for (let i = 0; i < people.length; i += this.rowLength) {
      const rowIndex = i / this.rowLength;
      rows[rowIndex] = [];

      for (let j = 0; (j < this.rowLength) && ((rowIndex + j < people.length)); j++) {
        rows[rowIndex][j] = this.makePersonCard(people[rowIndex + j]);
      }
    }

    return rows;
  }

  cardRow(row, index) { // turn the row into a bootstrap row of this.rowLength (3)
    const colSize = ~~(12 / this.rowLength);
    const colClass = `col-sm-${colSize}`;

    return (
      <div className="row" key={index}>
        {
          row.map((card, index) => {
            return (
              <div className={colClass} key={index}>
                {card}
              </div>
            );
          })
        }
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
          return (
            <div>
              {this.cardRows().map((peopleRow, index) => {
                return this.cardRow(peopleRow, index);
              })}
            </div>
          );
        }
        break;

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
