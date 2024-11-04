import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Autocomplete,
} from "@mui/material";
import axios from "axios";

const ManagePermissionsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // Fetch data from the backend (users, groups, and permissions)
  useEffect(() => {
    fetchUsers();
    fetchGroups();
    fetchPermissions();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get(baseURL + "/api/users/", {
      headers: {
        Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
      },
    });
    setUsers(response.data);
  };

  const fetchGroups = async () => {
    const response = await axios.get(baseURL + "/api/groups/", {
      headers: {
        Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
      },
    });
    setGroups(response.data);
  };

  const fetchPermissions = async () => {
    const response = await axios.get(baseURL + "/api/permissions/", {
      headers: {
        Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
      },
    });
    setPermissions(response.data);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Handle assigning groups to users
  const handleGroupAssignment = async (userId, groupId) => {
    await axios.patch(
      `${baseURL}/api/users/${userId}/`,
      { groups: [groupId] },
      {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      }
    );
    fetchUsers(); // Refresh data
  };

  // Handle creating new group
  const handleCreateGroup = async () => {
    await axios.post(
      `${baseURL}/api/groups/`,
      { name: newGroupName },
      {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      }
    );
    setNewGroupName("");
    fetchGroups(); // Refresh data
  };

  // Handle assigning permissions to a group
  const handlePermissionAssignment = async (groupId, permissionIds) => {
    await axios.patch(`/api/groups/${groupId}/`, { permissions: permissionIds });
    fetchGroups(); // Refresh group data
  };
  

  return (
    <Box>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Users" />
        <Tab label="Groups" />
        <Tab label="Permissions" />
      </Tabs>

      {/* Users Tab */}
      {tabIndex === 0 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Assign Group</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <FormControl>
                      <InputLabel>Group</InputLabel>
                      <Select
                        value={user.groups[0]?.id || ""}
                        onChange={(e) =>
                          handleGroupAssignment(user.id, e.target.value)
                        }
                      >
                        {groups.map((group) => (
                          <MenuItem key={group.id} value={group.id}>
                            {group.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Groups Tab */}
      {tabIndex === 1 && (
        <Box>
          {/* Create New Group */}
          <Box mt={3}>
            <FormControl>
              <TextField
                label="Group Name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                color="info"
              ></TextField>
            </FormControl>
            <Button
              variant="contained"
              color="info"
              onClick={handleCreateGroup}
            >
              Create Group
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Group Name</TableCell>
                  <TableCell>Assign Permission</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <Autocomplete
                          multiple
                          id="group-permissions"
                          options={permissions}
                          getOptionLabel={(permission) => permission.name}
                          value={group.permissions || []} // Make sure to handle multiple selected values
                          onChange={(event, newValue) => {
                            const selectedPermissionIds = newValue.map(
                              (permission) => permission.id
                            );
                            handlePermissionAssignment(
                              group.id,
                              selectedPermissionIds
                            ); // Pass array of selected permission IDs
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Permissions"
                              placeholder="Select permissions"
                            />
                          )}
                        />
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Permissions Tab */}
      {tabIndex === 2 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Permission Name</TableCell>
                <TableCell>Code Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>{permission.name}</TableCell>
                  <TableCell>{permission.codename}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ManagePermissionsPage;
