
const Coordinates = {
  // Examples by keys:
  // user data -> {'state': 'California'}
  //   key -> 'California'
  // user data -> {'city': 'San Jose', 'state': 'California'}
  //   key -> 'San+Jose+California'
};

const getCoordinatesFromLocation = (location) => {

};

const getCoordinatesFromUserData = (user) => {
  const { state } = user;
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



module.exports = {

};
