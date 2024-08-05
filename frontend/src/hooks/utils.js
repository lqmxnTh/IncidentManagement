// utils.js
import axios from 'axios';

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
