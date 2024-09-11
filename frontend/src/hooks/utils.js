// utils.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
const incidentApiPath = import.meta.env.INCIDENT;

const makeRequest = async (method, endpoint, data = null) => {
  try {
    const response = await axios({
      method,
      baseURL,
      url: endpoint,
      data,
    });

    return response.data;
  } catch (error) {
    console.error('Error making request:', error);
    throw error; // Rethrow the error for handling in the calling code
  }
};

export default makeRequest;


/**
 * Update the status of an item and save the changes to the server.
 * @param {string} baseURL - The base URL for the API.
 * @param {string} id - The ID of the item to update.
 * @param {object} item - The item object with the updated status.
 * @param {string} newStatus - The new status to set.
 * @returns {Promise<void>}
 */
export const updateItemStatus = async (baseURL, id, item, newStatus) => {
  // Update the item object with the new status
  const updatedItem = {
    ...item,
    status: newStatus,
  };

  // Simulate the delay for React state update
  await new Promise(resolve => setTimeout(resolve, 0));

  // Make the API call to update the item on the server
  try {
    await axios.put(`${baseURL}/api/incidents/${id}/`, updatedItem);
    console.log("Item updated successfully");
  } catch (error) {
    console.error("Failed to update item:", error);
  }
};
/**
 * Format the date as dd/mm/yyyy.
 * @param {string} dateString - The ISO date string to format.
 * @returns {string} - The formatted date string.
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};