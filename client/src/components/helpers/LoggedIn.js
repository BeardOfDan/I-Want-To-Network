import axios from 'axios';

// A helper function that determines if the user is logged in
// Accepts a callback function to set the state variable for if the user is logged in
export default async (setStateAuth) => {
  const user = (await axios.get('/auth/currentUser')
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      console.log('error: ' + e);
      return null; // there's an error, so don't show the auth buttons in the header
    }));

  setStateAuth({
    user,
    'isLoggedIn': (user === null) ? null : (user ? true : false)
  });
};
