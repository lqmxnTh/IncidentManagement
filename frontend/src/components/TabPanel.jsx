import { Box } from "@mui/material";

export function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        className="border-t border-gray-300 "
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ marginTop: "30px" }}>{children}</Box>}
      </div>
    );
  }