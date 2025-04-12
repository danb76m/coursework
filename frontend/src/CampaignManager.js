import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import './stylesheets/CampaignManager.css';

function CampaignManager() {
  const data = useSelector(state => state.data); // Access data from state
  const campaignsArray = useSelector(state => state.campaigns);
  const name = data.username;

  const campaigns = campaignsArray.length ? campaignsArray[0] : []; // Extract inner array of campaigns

  const handleLogout = async (event) => {
    event.preventDefault();

    confirmAlert({ // uses 'react-confirm-alert' module to display a popup which and use buttons
      title: 'Log out',
      message: 'Are you sure you want to log out!!!',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await axios.get('http://localhost:2977/logout', {
              withCredentials: true,
            });
            window.location.reload();
          },
        },
        {
          label: 'No',
          onClick: () => {
            
          },
        },
      ],
    });
  };

  const handleCreate = async (event) => {
    confirmAlert({
      title: 'Create new ad campaign',
      message: 'Are you sure you want to create a new ad campaign?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await axios.post('http://localhost:2977/create-campaign', {}, {
              withCredentials: true,
            });
            window.location.reload();
          },
        },
        {
          label: 'No',
          onClick: () => {
            
          },
        },
      ],
    });
  }

  return (
    <div class="campaign-manager">
      <h1>Campaign Manager</h1>
      <h1>{time() + ", " + name + ", hope you are doing well."}</h1>
      <h1>You have £{data.balance}</h1>
      {campaigns.length > 0 && ( // Render the table only if campaigns array is not empty
        <table>
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Impressions</th>
              <th>Clicks</th>
              <th>Budget Per Day</th>
              <th>End Date</th>
              <th>Paused</th>
              <th>Archived</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.campaign_id}>
                <td>{campaign.name}</td>
                <td>{campaign.impressions}</td>
                <td>{campaign.clicks}</td>
                <td>{campaign.budget_per_day}</td>
                <td>{campaign.has_end_date ? new Date(campaign.end_date).toISOString().slice(0, 10) : "N/A"}</td>
                <td>{campaign.paused ? "Paused" : "Not Paused"}</td>
                <td>{campaign.archived ? "Archived" : "Not Archived"}</td>
                <td>
                  <a href={"/edit/" + campaign.campaign_id}>Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {campaigns.length === 0 && <p>No campaigns found... Create one today!</p>} 
      <button onClick={handleCreate}>New Campaign</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

function time() {
  const hours = new Date().getHours();
  if (hours > 5 && hours < 12) return "Good morning";
  if (hours >= 12 && hours < 18) return "Good afternoon";
  if (hours >= 18 && hours < 22) return "Good evening";
  return "Good night";
}

export default CampaignManager;
