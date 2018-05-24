import React from 'react';

const _ = {
  'rowLength': 4,
  'borderRadius': '5%',
  'marginLeftLinkedIn': '-5%',
  'marginLeftGitHub': '-2.5%'
}; // utility variable for options

// Helper function for cardRows
const makePersonCard = (person) => {
  // Handle optional fields
  const location = (person.city ? (person.city + ', ') : '') + (person.state ? person.state : '');
  const linkedin = (<a href={person.linkedin} target="_blank" className="btn btn-primary" style={{ 'borderRadius': _.borderRadius, 'marginBottom': 10, 'marginLeft': _.marginLeftLinkedIn }}>{person.linkedin ? 'Check Out My LinkedIn' : ''}</a>);

  return (
    <div key={person.id} className="card" style={{ 'width': '18rem', 'borderRadius': _.borderRadius }}>
      <img className="card-img-top" src={person.photoURL} alt={person.username + '\'s profile pic'} style={{ 'borderTopRightRadius': _.borderRadius, 'borderTopLeftRadius': _.borderRadius }} />
      <div className="card-body" style={{ 'borderRadius': _.borderRadius }}>
        <h5 className="card-title">{person.username}</h5>
        <p className="card-text">{location ? location : ''}</p>
        {person.linkedin ? linkedin : ''}
        <a href={person.githubURL} target="_blank" className="btn btn-success" style={{ 'borderRadius': _.borderRadius, 'marginLeft': _.marginLeftGitHub }}>Check Out My Github</a>
      </div>
    </div>
  );
}

const cardRows = (people) => { // turns an array of cards into an array of arrays with length of 3
  // const people = this.state.others;
  const rows = [];

  for (let i = 0; i < people.length; i += _.rowLength) {
    const rowIndex = ~~(i / _.rowLength);
    rows[rowIndex] = [];

    for (let j = 0; (j < _.rowLength) && (((i + j) < people.length)); j++) {
      rows[rowIndex][j] = makePersonCard(people[i + j]);
    }
  }

  return rows;
}

const cardRow = (row, index) => { // turn the row into a bootstrap row of rowLength (3)
  const colSize = ~~(12 / _.rowLength);
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

export default (people, options) => {
  // options holds value(s) to update the utility variable _
  for (let key in options) {
    _[key] = options[key];
  }

  return (
    <div>
      {cardRows(people).map((peopleRow, index) => {
        return cardRow(peopleRow, index);
      })}
    </div>
  );
};
