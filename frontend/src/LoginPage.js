import React, { useState } from 'react';
import axios from 'axios';
import './stylesheets/LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      let data = JSON.stringify({
        "email": username,
        "password": password
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:2977/login',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data,
        withCredentials: true
      };

      const response = await axios.request(config);


      const message = response.data.message;
      const id = response.data.id; 
      console.log('Login successful!', id);
  
      // Delay to allow server-side session update (optional)
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.reload();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed'); // Extract error message or provide a default
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Email Address:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      <a href="/register">Create an account</a>
      {errorMessage && <label htmlFor="response-message">Response:</label>}
      {errorMessage && <p id="response-message">{errorMessage}</p>}
    </form>
  );
}

export default LoginPage;