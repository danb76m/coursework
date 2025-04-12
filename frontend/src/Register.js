// Credit https://github.com/hCaptcha/react-hcaptcha


import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import HCaptcha from '@hcaptcha/react-hcaptcha';
import './stylesheets/Register.css';

function Register() {
  // Captcha
  const [token, setToken] = useState(null);
  const captchaRef = useRef(null);

  const onLoad = () => {
    // this reaches out to the hCaptcha JS API and runs the
    // execute function on it. you can use other functions as
    // documented here:
    // https://docs.hcaptcha.com/configuration#jsapi
    captchaRef.current.execute();
  };

  useEffect(() => {

    if (token)
      console.log(`hCaptcha Token: ${token}`);

  }, [token]);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverResponse, setServerResponse] = useState(''); // State to store server response
  const navigate = useNavigate(); // Get useNavigate hook instance

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = JSON.stringify({
        email,
        password,
        username,
        token
      });

      console.log(data)

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:2977/register',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
        withCredentials: true,
      };

      const response = await axios.request(config);

        // Handle successful registration (clear form, redirect)
        console.log('Registration successful!');
        setUsername('');
        setEmail('');
        setPassword('');
        navigate('/'); // Redirect to homepage
    } catch (error) {
      console.error('Registration error:', error);
      setServerResponse(error.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <h2>Register</h2>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
        />
        <label htmlFor="email">Email:</label>
        <input type="text" name="email" value={email} onChange={handleChange} />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
        />
    <form>
      <HCaptcha
        sitekey="32bf2927-7267-4c40-af14-1969bf799183"
        onLoad={onLoad}
        onVerify={setToken}
        ref={captchaRef}
      />
    </form>
        <button type="submit">Register</button>
      </form>
      <label htmlFor="serverResponse">{serverResponse}</label>
    </div>
  );
}

export default Register;
