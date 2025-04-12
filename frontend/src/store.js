import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  data: null,
  campaigns: [], // Added campaigns array
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_AUTHENTICATION':
      return {
        ...state,
        isAuthenticated: action.payload.authenticated,
        data: action.payload.data,
      };
    case 'ADD_CAMPAIGN': // Added action type for adding campaigns
      return {
        ...state,
        campaigns: [...state.campaigns, action.payload], // Add new campaign to the array
      };
    default:
      return state;
  }
};

const store = configureStore({
  reducer,
});

export const setAuthentication = (authenticated, data) => ({
  type: 'SET_AUTHENTICATION',
  payload: { authenticated, data },
});

export const addCampaign = (campaign) => ({ // Added action creator for adding campaigns
  type: 'ADD_CAMPAIGN',
  payload: campaign,
});

export default store;