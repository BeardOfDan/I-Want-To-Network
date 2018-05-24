const axios = require('axios');

// TODO: Check and see if there are any instances of cities with the same
// name as any of the state values in client/src/components/utility/stateOptions.js

const Coordinates = {
  // Coordinates key examples by user data:
  // user data -> {'state': 'California'}
  //   key -> 'California'
  // user data -> {'city': 'San Jose', 'state': 'California'}
  //   key -> 'San+Jose+California'
};

const getCoordinatesFromLocation = (location) => {
  const path = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&sensor=false`

  return axios.get(path)
    .then((res) => {
      return Coordinates[location] = res.data.results[0].geometry.location;
    })
    .catch((e) => {
      return { 'error': 'Axios Error!' };
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
// Uses Haversine formula
// Borrowed (and altered) code from https://www.movable-type.co.uk/scripts/latlong.html
const getCoordsDist = (alpha, beta) => {
  const R = 3959; // Earth's radius (miles)

  // Note: The '* (Math.PI / 180)' converts the values to Radians
  const φ1 = alpha.lat * (Math.PI / 180);
  const φ2 = beta.lat * (Math.PI / 180);
  const Δφ = (beta.lat - alpha.lat) * (Math.PI / 180);
  const Δλ = (beta.lng - alpha.lng) * (Math.PI / 180);

  const a = (Math.sin(Δφ / 2) ** 2) + Math.cos(φ1) * Math.cos(φ2)
    * (Math.sin(Δλ / 2) ** 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
};

module.exports = {
  // user is the user data for the person searching for matches
  // people is the totality of all users in the database
  // dist is the distance (in miles) for the search
  'filterByDist': async (user, people, dist) => {
    const userCoords = await getCoordinatesFromUserData(user);

    if (userCoords.error) {
      console.log('userCoords Error!');
      return { 'error': 'Could not get user\'s coordinates' };
    }

    const coordList = people.reduce((accumulator, person, index, collection) => {
      const value = getCoordinatesFromUserData(person);

      if (value.error) {
        console.log(`\n\nPeople[${index}] Error!`);
        console.log(`${JSON.stringify(collection[index])}\n\n`);

        accumulator.push({ 'error': 'Skip me in filter' });
        return accumulator;
      }

      accumulator.push(value);

      return accumulator;
    }, []);

    await Promise.all(coordList);

    return people.filter((user, index, collection) => {
      if (coordList[index].error) {
        return false;
      }

      return dist >= (getCoordsDist(userCoords, coordList[index]));
    });
  } // end of filterByDist
};
