import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import './stylesheets/CampaignEdit.css';

function CampaignEdit() {
  const { id } = useParams(); // Get the campaign ID from URL params
  const [campaign, setCampaign] = useState(null);
  const [formData, setFormData] = useState({
    campaign_id: -1,
    impressions: 0,
    clicks: 0,
    budget_per_day: 0,
    start_date: '',
    end_date: null,
    has_end_date: false,
    category_ids: [],
  });
  const [responseMessage, setResponseMessage] = useState('');

  const data = useSelector(state => state.data); // Access data from state
  const campaignsArray = useSelector(state => state.campaigns);

  useEffect(() => {
    const campaigns = campaignsArray.length ? campaignsArray[0] : []; // Extract inner array of campaigns
    const selectedCampaign = campaigns.find(c => c.campaign_id === parseInt(id));

    if (!selectedCampaign) {
      console.log("Couldn't find selected campaign.");
      return;
    }

        setCampaign(selectedCampaign);
        setFormData({
          campaign_id: selectedCampaign.campaign_id,
          name: selectedCampaign.name,
          image_link: selectedCampaign.image_link,
          budget_per_day: selectedCampaign.budget_per_day,
          end_date: selectedCampaign.end_date == null ? '' : new Date(selectedCampaign.end_date).toISOString().slice(0, 10),
          has_end_date: selectedCampaign.has_end_date,
          category_ids: selectedCampaign.category_ids,
          paused: selectedCampaign.paused,
          archived: selectedCampaign.archived
        })
        console.log(selectedCampaign.end_date)
        console.log(formData.end_date)
  }, [campaignsArray, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    setResponseMessage('') // Remove this so you can tell you have updated
    confirmAlert({
      title: 'Confirm update',
      message: 'Are you sure you want update? This is an irreverisble action.',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            push();
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

  const handleDelete = (e) => {
    e.preventDefault();


    setResponseMessage('') // Remove this so you can tell you have updated
    confirmAlert({
      title: 'Confirm delete',
      message: 'WARNING: THIS ACTION IS IRREVERISLBE',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            pushDelete();
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

  function pushDelete() {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:2977/delete-campaign/' + formData.campaign_id,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data,
      withCredentials: true
    };

    try {
      axios.request(config);
      setResponseMessage('Deleted campaign')
      window.location.reload()
    }catch(error) {
      console.log(error);
      setResponseMessage('Internal error')
    }
  }

  function push() {
    let data = JSON.stringify({
      "name": formData.name,
      "image_link": formData.image_link,
      "budget_per_day": formData.budget_per_day,
      "end_date": formData.end_date,
      "has_end_date": formData.has_end_date,
      "category_ids": formData.category_ids,
      "paused": formData.paused,
      "archived": formData.archived
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:2977/update-campaign/' + formData.campaign_id,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data,
      withCredentials: true
    };

    try {
      axios.request(config);
      setResponseMessage('Updated campaign')
    }catch(error) {
      console.log(error);
      setResponseMessage('Internal error')
    }
  }

  if (!campaign) {
    return <div>Not found</div>;
  }

  return (
    <div>
      
      <form onSubmit={handleSubmit}>
      <h1>Edit Campaign</h1>
      <label>Campaign Name:</label>
      <input type="text" name="name" value={formData.name} onChange={handleInputChange} />

      <label>Image Link:</label>
      <input type="text" name="image_link" value={formData.image_link} onChange={handleInputChange} />

        <label>Budget Per Day:</label>
        <input type="number" name="budget_per_day" value={formData.budget_per_day} onChange={handleInputChange} />

        <label>End Date:</label>
        <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} />

        <label>Has End Date:</label>
        <input type="checkbox" name="has_end_date" checked={formData.has_end_date} onChange={handleInputChange} />

        <label>Paused:</label>
        <input type="checkbox" name="paused" checked={formData.paused} onChange={handleInputChange} />

        <label>Archived:</label>
        <input type="checkbox" name="archived" checked={formData.archived} onChange={handleInputChange} />

        <button type="submit" name="delete" onClick={handleDelete}>Delete Campaign</button>
        <button type="submit">Save Changes</button>
        {responseMessage && <p id="response-message">{responseMessage}</p>}
        
      </form>
    </div>
  );
}

export default CampaignEdit;