const axios = require('axios');

const Coordinates = {
  // Examples by keys:
  // user data -> {'state': 'California'}
  //   key -> 'California'
  // user data -> {'city': 'San Jose', 'state': 'California'}
  //   key -> 'San+Jose+California'
};

const getCoordinatesFromLocation = (location) => {
  const path = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&sensor=false`

  return axios.get(path)
    .then((res) => {
      return Coordinates[location] = res.data.results.geometry.location;
    });
};

const getCoordinatesFromUserData = (user) => {
  const state = user.state.replace(/ /gi, '+');
  const city = user.city.replace(/ /gi, '+');

  if (state === undefined) {
    return { 'error': 'This user has no location data' };
  }

  if (city === undefined) { // only do it by state
    if (Coordinates[state]) {
      return Coordinates[state];
    }

    return getCoordinatesFromLocation(state);
  }

  const locationString = `${city}+${state}`;

  if (Coordinates[locationString]) {
    return Coordinates[locationString];
  }

  return getCoordinatesFromLocation(locationString);
};

// Returns distance in miles between two coordinates
const getCoordsDist = (alpha, beta) => {
  return 9001;
};

module.exports = {
  // user is the user data for the person searching for matches
  // people is the totality of all users in the database
  // dist is the distance (in miles) for the search
  'filterByDist': async (user, people, dist) => {
    const userCoords = getCoordinatesFromUserData(user);

    const coordList = people.reduce((accumulator, person, index, collection) => {
      accumulator.push(getCoordinatesFromUserData(person));
    }, []);

    await Promise.all(coordList);

    return users.filter((user, index, collection) => {
      return dist > (getCoordsDist(userCoords, coordList[index]));
    });
  }
};
