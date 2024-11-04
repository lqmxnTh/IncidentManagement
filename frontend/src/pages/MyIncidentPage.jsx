import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useCookies } from 'react-cookie';

function MyIncidentCard({ incident }) {
  return (
    <Card variant="outlined" style={{ marginBottom: '1rem' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {incident.title}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {incident.description}
        </Typography>
        <Grid container spacing={2} style={{ marginTop: '0.5rem' }}>
          {[
            { label: 'Status', value: incident.status },
            { label: 'Priority', value: incident.priority },
            { label: 'Created At', value: incident.formatted_created_at },
            { label: 'Faculty', value: incident.faculty_name },
            { label: 'Classroom', value: incident.classroom_name || 'N/A' },
            { label: 'Building', value: incident.building_name },
            { label: 'Floor', value: incident.floor },
          ].map((field, index) => (
            <Grid item xs={6} key={index}>
              <Typography variant="body2">
                <strong>{field.label}:</strong> {field.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

function MyIncidentPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const user = cookies?.user;

  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/api/user-incidents/${user.id}`, {
          headers: { Authorization: `Token ${token}` }
        });
        setIncidents(response.data);
      } catch (err) {
        console.error("Error fetching incidents:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, [baseURL, token]);

  if (loading) return <Typography variant="body1">Loading...</Typography>;
  if (error) return <Typography variant="body1" color="error">Error loading incidents.</Typography>;

  return (
    <div style={{ padding: '2rem' }}>
      {incidents.length > 0 ? (
        incidents.map((incident) => <MyIncidentCard key={incident.id} incident={incident} />)
      ) : (
        <Typography variant="body1" color="textSecondary">
          No incidents to display.
        </Typography>
      )}
    </div>
  );
}

export default MyIncidentPage;
