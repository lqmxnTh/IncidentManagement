import axios from 'axios';
import { useState, useEffect } from 'react';

const fetchUserGroups = async () => {
  try {
    const response = await axios.get('/user-groups/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Or wherever you're storing the auth token
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return [];
  }
};
