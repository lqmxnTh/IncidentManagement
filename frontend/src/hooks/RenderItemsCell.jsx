import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * A reusable component to render a list of items based on their IDs and a specified key.
 * @param {Array} ids - Array of IDs to map.
 * @param {Array} allItems - Array of objects to find items from.
 * @param {string} key - Key to access the value in objects.
 * @returns {JSX.Element} A JSX element displaying the mapped items.
 */
const RenderItemsCell = ({ ids = [], allItems = [], name = 'name' }) => {
  // Ensure ids is an array
  if (!Array.isArray(ids)) {
    console.error('ids is not an array:', ids);
    return null;
  }

  // Map to the specified key values
  const itemNames = ids
    .map((id) => allItems.find((item) => item.id === id)?.[name])
    .filter(Boolean); // Remove any undefined or falsy values

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      gap={1}
      alignItems="center"
      height={"100%"}
    >
      {itemNames.map((item, index) => (
        <Box
          key={index}
          component="span"
          sx={{
            backgroundColor: "rgba(149, 165, 166, 0.7)",
            borderRadius: "12px",
            padding: "4px 8px",
            margin: "2px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">{item}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default RenderItemsCell;