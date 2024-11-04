import React, { useState } from "react";
import { TextField, MenuItem, Button, Box } from "@mui/material";

const SearchBox = ({ data, searchFunction, defauultCateg }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchParameter, setSearchParameter] = useState(defauultCateg);
  const searchParameters = Object.keys(data[0] || {}).filter(key => key !== 'id'); // Exclude 'id' or any other keys you don't want to include

  // Function to handle the search
  const handleSearch = () => {
    const results = searchFunction(data, searchParameter, searchValue);
    return results; // You may want to lift this state up or manage it differently
  };

  return (
    <Box>
      <TextField
        className="w-2/12"
        select
        label="Search By"
        value={searchParameter}
        onChange={(e) => setSearchParameter(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
        color="info"
      >
        {searchParameters.map((param) => (
          <MenuItem key={param} value={param}>
            {param.charAt(0).toUpperCase() + param.slice(1)} {/* Capitalize the first letter */}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        className="w-9/12"
        label="Search"
        variant="outlined"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        sx={{ mb: 2 }}
        color="info"
      />

      <Button
        className="w-1/12"
        variant="contained"
        color="info"
        onClick={handleSearch}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBox;
