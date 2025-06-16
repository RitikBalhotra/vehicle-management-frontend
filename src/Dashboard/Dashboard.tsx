import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Paper } from "@mui/material";
import StorageService from "../Service/StorageService";
import { DELETE, GETALLAPI, GETALLVEHICLES, UPDATEAPI } from "../Service/APIService";
import AppTable from "../Components/UI/Apptable";
import StatsCard from "../Components/UI/StatsCard";
import type { Manager, ManagerForm } from "../Manager/types-m";
import type { Driver } from "../Driver/types-d";
import type { Vehicle } from "../Vehicle/types-v";
import APPModal from "../Components/UI/AppModal";
import AddManager from "../Manager/AddManager";
import AddDriver from "../Driver/AddDrivers";

type User = {
  type: "user",
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: "admin" | "manager" | "driver" | "";
};

const defaultForm: ManagerForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  mobile: '',
  dob: '',
  profileImage: null,
  role: 'manager'
};

const Dashboard = () => {
  const [role, setRole] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [manangers, setManangers] = useState<Manager[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [editRole, setEditRole] = useState("");
  const [editId, setEditId] = useState<string | null>(null)
  const navigate = useNavigate();


  // useEffect for role
  useEffect(() => {
    const user = StorageService.getUser();
    if (user) {
      const rl = Array.isArray(user.role) ? user.role[0] : user.role;
      setRole(rl);
    }
    else {
      navigate('/');
    }
  }, []);

  // useEffect for fetched data 
  useEffect(() => {
    if (role) {
      fetchedData();
    }
  }, [role])

  const handleButton = () => {
    console.log("handle button is clicked");
  };


  // fetched Data
  const fetchedData = async () => {
    try {
      if (role == "admin" || role == "manager") {
        const userRes = await GETALLAPI({ url: "/list" });
        if (Array.isArray(userRes)) {
          const allUsers = userRes;
          const managers = allUsers.filter((user) => user.role == "manager");
          const drivers = allUsers.filter((user) => user.role == "driver");
          setUsers(allUsers);
          setManangers(managers);
          setDrivers(drivers);
        }
      }

      const vehicleRes = await GETALLVEHICLES({ url: "/vehiclelist" });
      if (Array.isArray(vehicleRes)) {
        setVehicles(vehicleRes);
      }
    } catch (err) {
      console.error("Error in fetchedData:", err);
      alert("Something went wrong while fetching data.");
    }
  };

  const handleEdit = (r: Manager | Driver) => {
    setEditRole(r.role);
    setEditId(r?._id)
    setOpen(true);

    console.log("row data in edit fun: " + r?.profilePic)
    const baseForm = {
      firstName: r.firstName || '',
      lastName: r.lastName || '',
      email: r.email || '',
      password: '',
      mobile: r.mobile || '',
      dob: r.dob ? new Date(r.dob) : '',
      profilePic: r?.profilePic || null,
      role: r.role,
    };

    if (r.role == "manager") {
      setFormData(baseForm);
    } else if (r.role == "driver") {
      const driverData = {
        ...baseForm,
        licenseNumber: r.licenseNumber || '',
        licenseExpiry: r.licenseExpiry ? new Date(r.licenseExpiry) : '',
        address: r.address || '',
        experience: r.experience || '',
        licenseFile: r.licenseFile || null,
      };
      setFormData(driverData);
    }
  };



  // handle Delete
  const handleDelete = async (r) => {
    await DELETE({ url: `/delete/${r?._id}` })
      .then((res) => {
        console.log("user deleted:" + res);
        fetchedData();
      })
      .catch((err) => console.log("delete api error :" + err));
  }


  // update user function
  const updateUser = async () => {
    try {
      console.log("updateUser is running");
      const form = new FormData();
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("email", formData.email);
      form.append("mobile", formData.mobile);
      if (formData.dob) {
        form.append("dob", new Date(formData.dob).toISOString());
      }
      form.append("role", formData.role);

      if (formData.profileImage && formData.profileImage instanceof File) {
        form.append("profileImage", formData.profileImage);
      }


      if (editRole == "driver") {
        form.append("licenseNumber", formData.licenseNumber);
        if (formData.licenseExpiry) {
          form.append("licenseExpiry", new Date(formData.licenseExpiry).toISOString());
        }
        form.append("address", formData.address);
        form.append("experience", formData.experience);
        if (formData.licenseFile && formData.licenseFile instanceof File) {
          form.append("licenseFile", formData.licenseFile);
        }
      }


      await UPDATEAPI({
        url: `/update/${editId}`, 
        payload: formData,
        header: { "Content-Type": "multipart/form-data" },
      });
      console.log("User updated successfully");
      await fetchedData();
      setOpen(false);
    } catch (err: any) {
      console.error("Update error:", err.message);
    }
  };



  const userColumns = [
    { name: "profilePic", label: "Profile Pic" },
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
        Welcome {role.toUpperCase()}
      </Typography>

      <Grid container spacing={3} mb={4}>
        {role == "admin" && (
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
              <StatsCard title="Total Vehicles" value={vehicles.length+1} onClick={handleButton} bg={cardThemes[3].color} />
            </Grid>
          </>
        )}

        {role === "manager" && (
          <>
            <Grid item xs={12} sm={3} md={6}>
              <StatsCard title="Total Drivers" value={drivers.length} onClick={handleButton} bg={cardThemes[2].color} />
            </Grid>
            <Grid item xs={12} sm={3} md={6}>
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
      {role == "admin" && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <AppTable rowData={users} rowActions={rowActions} headerColumn={userColumns} title="User List" headerActions={[]} />
        </Paper>
      )}

      {role == "manager" && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <AppTable rowData={drivers} rowActions={rowActions} headerColumn={driversColumns} title="Driver List" headerActions={[]} />
        </Paper>
      )}

      {role === "driver" && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <AppTable rowData={vehicles} headerColumn={vehiclesColumns} title="Your Vehicles" headerActions={[]} />
        </Paper>
      )}


      <APPModal isOpen={open} onOkClick={updateUser} onClose={() => setOpen(false)} title="Edit User">
        {editRole == "manager" && (
          <AddManager value={formData} setValue={setFormData} />
        )}
        {editRole == "driver" && (
          <AddDriver value={formData} setValue={setFormData} />
        )}
      </APPModal>


      <Outlet />
    </Box>
  );
};

export default Dashboard;
