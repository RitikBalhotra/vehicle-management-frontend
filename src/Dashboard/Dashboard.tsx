import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Paper } from "@mui/material";
import StorageService from "../Service/StorageService";
import { DELETE, DELETEVEHICLE, GETALLAPI, GETALLVEHICLES } from "../Service/APIService";
import AppTable from "../Components/UI/Apptable";
import StatsCard from "../Components/UI/StatsCard";
import type { Manager } from "../Manager/types-m";
import type { Driver } from "../Driver/types-d";
import type { Vehicle } from "../Vehicle/types-v";

type User = {
  type: "user",
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: string;
};

const Dashboard = () => {
  const [role, setRole] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [manangers, setManangers] = useState<Manager[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = StorageService.getUser();
    const rl = user.role[0];
    setRole(rl);
    fetchedData(rl);
  }, []);

  const handleButton = () => {
    navigate("/add");
  };

  const fetchedData = async (rl: string) => {
    try {
      if (rl === "admin" || rl === "manager") {
        const userRes = await GETALLAPI({ url: "/list" });
        if (Array.isArray(userRes.data)) {
          const allUsers = userRes.data;
          const managers = allUsers.filter((user: Manager) => user.role == "manager");
          const drivers = allUsers.filter((user: Driver) => user.role == "driver");
          setUsers(allUsers);
          setManangers(managers);
          setDrivers(drivers);

        }
      }

      const vehicleRes = await GETALLVEHICLES({ url: "/vehiclelist" });
      if (Array.isArray(vehicleRes.data)) {
        setVehicles(vehicleRes.data);
      }
    } catch (err) {
      console.error("Error in fetchedData:", err);
      alert("Something went wrong while fetching data.");
    }
  };


  // for checking the object is user
  function isUser(obj: any): obj is User {
    return 'email' in obj && 'role' in obj && 'firstName' in obj;
  }
  // for checking the object is vehicle
  function isVehicle(obj: any): obj is Vehicle {
    return 'vehicleName' in obj && 'vehicleModel' in obj;
  }
  const handleEdit = (r) => {
    if (isUser(r)) {
      console.log("user edit logic ");
    }
    else if (isVehicle(r)) {
      console.log("vehicle edit logic");
    }
  }

  const handleDelete = async (r) => {
      await DELETE({ url: `/delete/${r?._id}` })
        .then((res) => {
          console.log("user deleted:" + res);
          fetchedData(role);
        })
        .catch((err) => console.log("delete api error :" + err));
   
    }
  }
  const userColumns = [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "email", label: "Email" },
    { name: "mobile", label: "Mobile" },
    { name: "role", label: "Role" },
    { name: "actions", label: "Actions" }
  ];

  const rowActions = [
    {
      label: 'Edit',
      color: 'primary',
      onClick: (r) => handleEdit(r),
    },
    {
      label: 'Delete',
      color: 'error',
      onClick: (r) => handleDelete(r),
    },
  ]

  const driversColumns = [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "email", label: "Email" },
    { name: "mobile", label: "Mobile" },
    { name: "role", label: "Role" },
    { name: "actions", label: "Actions" }
  ];

  const vehiclesColumns = [
    { name: "vehicleName", label: "Vehicle Name" },
    { name: "vehicleModel", label: "Model" },
    { name: "vehicleYear", label: "Year" },
    { name: "type", label: "Vehicle Type" },
    { name: "chassiNumber", label: "Chassi Number" },
    { name: "Actions", label: "Actions" },
  ];

  // Cards style themes by role
  const cardThemes = [
    { title: "Total Users", color: "#1976d2" },
    { title: "Total Managers", color: "#9c27b0" },
    { title: "Total Drivers", color: "#2e7d32" },
    { title: "Total Vehicles", color: "#ef6c00" },
    { title: "Assigned Vehicles", color: "#00acc1" },
    { title: "Assigned Vehicle", color: "#00897b" },
    { title: "Trips Completed", color: "#f44336" },
  ];

  return (
    <Box
      sx={{
        p: 4,
        background: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}
      </Typography>

      <Grid container spacing={3} mb={4}>
        {role === "admin" && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard title="Total Users" value={users.length} onClick={handleButton} bg={cardThemes[0].color} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard title="Total Managers" value={manangers.length} onClick={handleButton} bg={cardThemes[1].color} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard title="Total Drivers" value={drivers.length} onClick={handleButton} bg={cardThemes[2].color} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard title="Total Vehicles" value={vehicles.length} onClick={handleButton} bg={cardThemes[3].color} />
            </Grid>
          </>
        )}

        {role === "manager" && (
          <>
            <Grid item xs={12} sm={6} md={6}>
              <StatsCard title="Total Drivers" value={drivers.length} onClick={handleButton} bg={cardThemes[2].color} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard title="Total Managers" value={manangers.length} onClick={handleButton} bg={cardThemes[1].color} />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <StatsCard title="Total Vehicles" value={vehicles.length} onClick={handleButton} bg={cardThemes[4].color} />
            </Grid>
          </>
        )}

        {role === "driver" && (
          <>
            <Grid item xs={12} sm={6} md={6}>
              <StatsCard title="Assigned Vehicle" value="Truck A" onClick={handleButton} bg={cardThemes[5].color} />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <StatsCard title="Trips Completed" value="12" onClick={handleButton} bg={cardThemes[6].color} />
            </Grid>
          </>
        )}
      </Grid>

      {/* Tables */}
      {role === "admin" && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <AppTable rowData={users} rowActions={rowActions} headerColumn={userColumns} title="User List" headerActions={[]} />
        </Paper>
      )}

      {role == "manager" && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <AppTable rowData={drivers} headerColumn={driversColumns} title="Driver List" headerActions={[]} />
        </Paper>
      )}

      {role === "driver" && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <AppTable rowData={vehicles}  headerColumn={vehiclesColumns} title="Your Vehicles" headerActions={[]} />
        </Paper>
      )}

      <Outlet />
    </Box>
  );
};

export default Dashboard;
