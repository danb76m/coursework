import React, { useEffect, usemem } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import LoginPage from './LoginPage';
import Register from './Register';
import CampaignManager from './CampaignManager';
import axios from 'axios';
import { setAuthentication, addCampaign } from './store'; // Import setAuthentication
import CampaignEdit from './CampaignEdit';

const App = () => {
  const dispatch = useDispatch(); // Stores if they are authenticated and if they are what is the API response (includes name and session id)
  const { isAuthenticated, data } = useSelector(state => state);

  useEffect(() => { // Accepts a function that contains imperative, possibly effectful code.
    const checkAuthentication = async () => {
      try {
        const response = await axios.get('http://localhost:2977/protected', { withCredentials: true }); // "localhost:2977" is used as my API backend
        dispatch(setAuthentication(true, response.data));

        const campaigns = await axios.get('http://localhost:2977/campaigns', { withCredentials: true }); // withCredentials so that the cookies will be stored in the request
        dispatch(addCampaign(campaigns.data))
      } catch (error) {
          dispatch(setAuthentication(false, undefined));
          console.error('Error fetching authentication:', error);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <div>
      {isAuthenticated ? ( // Access these routes if they are authenticated
        <BrowserRouter>
        <Routes>
        <Route path="/" element={<CampaignManager />} />
        <Route path="/edit/:id" element={<CampaignEdit data={data}/>} />
        </Routes>
        </BrowserRouter>
      ) : ( // Else see the LoginPage at the index ('/') and also have /register
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
};

export default App;