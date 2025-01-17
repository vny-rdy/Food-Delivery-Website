import React from 'react';
import Navbar from '../components/navbar/Navbar';

const Contact = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
        <h2>Contact Information</h2>
        <p><strong>Admin Credentials:</strong> <br /> Username: <code>admin</code>, Password: <code>root</code></p>
        <br /><br />
        <strong>Important Notes:</strong>
        <ul>
          <li>User can use Logo "FD" to go home</li>
          <li>
            If a user has already signed up and wishes to sign up again, please use a different phone number to register.
          </li>
          <li>
            If a user has signed up previously, logged out, and now wants to log in, use the login button. 
            If login does not work, please sign up again with a different phone number.
          </li>
          
        </ul>
      </div>
    </div>
  );
};

export default Contact;
