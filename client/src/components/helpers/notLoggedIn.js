import React from 'react';

// This is a render function for a message for users that are NOT logged in
export default () => {
  return (
    <div>
      <p>This is a basic app to help us network</p>
      <hr />
      <p>First, sign in with GitHub by clicking the button in the upper right</p>
      <p>Then you can see who else is here, their email addresses and links to their githubs</p>
    </div>
  );
};
