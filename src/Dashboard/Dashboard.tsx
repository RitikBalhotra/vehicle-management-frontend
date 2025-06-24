import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import StorageService from "../Service/StorageService";
import {
  DELETE,
  GETALLAPI,
  GETALLVEHICLES,
  GETASSIGNEDVEHICLE,
  GETBYID,
  POSTAPI,
  POSTVEHICLE,
  UPDATEAPI,
} from "../Service/APIService";
import AppTable from "../Components/UI/Apptable";
import type { Driver, DriverForm, Manager, ManagerForm, User, UserForm, Vehicle, VehicleForm, FieldConfig } from "../Components/types/types";
import { cardData, driverFields, managerFields, userFields, } from "../Components/types/types";
import APPModal from "../Components/UI/AppModal";
import ToasterService from "../Service/ToastService";
import {
  userColumns,
  driverColumns,
  vehicleColumns
} from "../Components/types/types";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AppForm from "../Components/UI/AppForm";
import AssignVehicleForm from "../Features/Vehicle/AssignVeichleForm";



const Dashboard = () => {
  const [role, setRole] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [assignVehicle, setAssignVehicle] = useState<Vehicle | null>(null);
  const [currentCardName, setCurrentCardName] = useState<string>('Total Users');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<UserForm | ManagerForm | DriverForm | VehicleForm>>({});
  const [editRole, setEditRole] = useState("");
  const [addRole, setAddRole] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [modalTitle, setModelTitle] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<'form' | 'assignVehicle'>('form');

  const navigate = useNavigate();

  //use Effect
  useEffect(() => {
    const user = StorageService.getUser();
    if (user) {
      const rl = Array.isArray(user.role) ? user.role[0] : user.role;
      setRole(rl);
    } else {
      navigate("/");
    }
  }, []);

  //fetched data
  const fetchedData = useCallback(async () => {
    try {
      const userRes = await GETALLAPI({ url: "/list" });
      const vehicleRes = await GETALLVEHICLES({ url: "/vehiclelist" });


      if (Array.isArray(userRes)) {
        setUsers(userRes);
        setManagers(userRes.filter((u) => u.role[0] === "manager"));
        setDrivers(userRes.filter((u) => u.role[0] === "driver"));
      }

      if (Array.isArray(vehicleRes.data)) {
        setVehicles(vehicleRes.data);
      } else {
        console.warn("Vehicle data not an array:", vehicleRes);
      }

    } catch (err) {
      console.error("Fetching data error:", err);
    }
  }, []);


  const countMap = {
    users: users.length,
    managers: managers.length,
    drivers: drivers.length,
    vehicles: vehicles.length,
  }

  const visibleCards = cardData.filter((card) => card.roles.includes(role as any)).map((card) => ({
    ...card,
    value: countMap[card.key], // inject value dynamically
  }));


  //fetch Assign Vehicle
  const fetchAssignedVehicle = useCallback(async () => {
    const user = StorageService.getUser();
    try {
      const res = await GETASSIGNEDVEHICLE(user.id);
      if (res?.vehicle) setAssignVehicle(res.vehicle);
      console.log(res);
    } catch (err) {
      console.error("Assigned vehicle fetch failed:", err);
    }
  }, []);

  //use Effect
  useEffect(() => {
    if (role === "admin" || role === "manager") {
      fetchedData();
    } else if (role === "driver") {
      fetchAssignedVehicle();
    }
  }, [role, fetchedData, fetchAssignedVehicle]);

  useEffect(() => {
    if (visibleCards.length > 0) {
      setCurrentCardName(visibleCards[0].label);
    }
  }, [visibleCards.length]);

  // handle Edit
  const handleEdit = useCallback(async (row: { _id: string }) => {
    if (!row || !row._id) return;


    try {
      const res = await GETBYID({ url: `/user/${row._id}` });

      const role = Array.isArray(res.role) ? res.role[0] : res.role || "driver";
      setModalContent('form');
      setEditId(res._id);
      setEditRole(role);
      setOpen(true);
      setModelTitle(`Edit ${role.toUpperCase()}`);

      const baseForm = {
        firstName: res.firstName || "",
        lastName: res.lastName || "",
        email: res.email || "",
        password: "",
        mobile: res.mobile || "",
        dob: res.dob ? new Date(res.dob) : "",
        profilePic: res.profilePic || null,
        role: res.role,
      };

      if (role === "driver") {
        setFormData({
          ...baseForm,
          licenseExpiry: res.licenseExpiry ? new Date(res.licenseExpiry) : "",
          address: res.address || "",
          experience: res.experience || "",
          licenseFile: res.licenseFile || null,
        });
      } else if (role === "manager") {
        setFormData(baseForm);
      } else if (role === "vehicle") {
        setFormData(res);
      } else {
        setFormData(baseForm);
      }

      console.log("📝 Edit Form Data (via API):", res);
    } catch (err) {
      console.error("❌ Failed to fetch user by ID:", err);
    }
  }, []);


  const updateDetails = async () => {
    try {
      const form = new FormData();

      // Common user fields
      form.append("firstName", formData.firstName || "");
      form.append("lastName", formData.lastName || "");
      form.append("email", formData.email || "");
      form.append("mobile", formData.mobile || "");
      form.append("dob", formData.dob ? new Date(formData.dob).toISOString() : "");
      form.append("role", editRole); // role is important for backend logic

      // File handling
      if (formData.profilePic instanceof File) {
        form.append("profilePic", formData.profilePic);
      }

      // Driver-specific fields
      if (editRole === "driver") {
        form.append("address", formData.address || "");
        form.append("experience", formData.experience || "");
        if (formData.licenseExpiry)
          form.append("licenseExpiry", new Date(formData.licenseExpiry).toISOString());

        if (formData.licenseFile instanceof File) {
          form.append("drivingLicense", formData.licenseFile);
        }

        // 🔄 Update driver (user-based) details
        await UPDATEAPI({
          url: `/update/${editId}`, // editId comes from set in handleEdit
          payload: form,
          header: { "Content-Type": "multipart/form-data" },
        });

      } else if (editRole === "vehicle") {
        // Vehicle-specific fields
        form.append("vehicleName", formData.vehicleName || "");
        form.append("vehicleModel", formData.vehicleModel || "");
        form.append("vehicleYear", formData.vehicleYear || "");
        form.append("vehicleType", formData.vehicleType || "");
        form.append("chassiNumber", formData.chassiNumber || "");
        form.append("registrationNumber", formData.registrationNumber || "");
        form.append("vehicleDescription", formData.vehicleDescription || "");
        form.append("status", formData.status || "");

        if (Array.isArray(formData.vehiclePhotos)) {
          formData.vehiclePhotos.forEach((file: File) => {
            form.append("vehiclePhotos", file);
          });
        }

        // 🔄 Update vehicle
        await UPDATEAPI({
          url: `/vehicle/update/${editId}`,
          payload: form,
          header: { "Content-Type": "multipart/form-data" },
        });

      } else {
        // 👤 Update basic user or manager
        await UPDATEAPI({
          url: `/update/${editId}`,
          payload: form,
          header: { "Content-Type": "multipart/form-data" },
        });
      }

      ToasterService.showtoast({ message: "Details updated successfully", type: "success" });
      await fetchedData(); // refresh data list
      setOpen(false);
      setEditRole("");
      setFormData({});
    } catch (err) {
      console.error("Update failed", err);
      ToasterService.showtoast({ message: "Update failed", type: "error" });
    }
  };


  // handle Delete
  const handleDelete = (r) => {
    setSelectedUserId(r._id);        // Store the selected user ID
    setConfirmOpen(true);            // Open confirmation dialog

  };



  const confirmDelete = async () => {
    if (!selectedUserId) return;


    try {
      const res = await DELETE({ url: `/delete/${selectedUserId}` });
      if (res) {
        ToasterService.showtoast({ message: 'Deleted Successfully!', type: 'success' });
        await fetchedData();
      }
    } catch (err) {
      ToasterService.showtoast({ message: 'Deletion failed!', type: 'error' });
    } finally {
      setConfirmOpen(false);      // Close confirmation popup
      setSelectedUserId(null);    // Clear user ID
    }
  };

  const handleAssignVehicle = () => {
    console.log("handleassign is working");
    setModalContent('assignVehicle');
    setOpen(true);
  }


  type RoleType = "user" | "manager" | "driver" | "vehicle";

  const handleAdd = (label: string) => {
    const lowerLabel = label.toLowerCase();
    const role: RoleType = lowerLabel.includes("manager")
      ? "manager"
      : lowerLabel.includes("driver")
        ? "driver"
        : lowerLabel.includes("vehicle")
          ? "vehicle"
          : "user";


    setFormData({
      ...(role !== 'user' ? { role } : {}),
    });

    setModalContent('form');
    setModelTitle(`Add ${label}`);
    setEditId(null);
    setAddRole(role);
    setOpen(true);
  };


  const addDetails = async () => {
    try {
      const form = new FormData();

      // Append all fields to formData
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File || value instanceof Blob) {
          form.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((v) => form.append(key, v)); // for vehiclePhotos (multiple files)
        } else {
          form.append(key, value as string);
        }
      });

      // 🟢 If it's a vehicle
      if (addRole === "vehicle") {
        await POSTVEHICLE({
          url: "/add",
          payload: form,
          header: { "Content-Type": "multipart/form-data" },
        });

        ToasterService.showtoast({ message: "Vehicle added successfully", type: "success" });

      } else {
        // 🟢 For user/driver/manager
        if (!formData.role) {
          form.append("role", "driver"); // default role
        }

        await POSTAPI({
          url: "/register",
          payload: form,
          header: { "Content-Type": "multipart/form-data" },
        });

        ToasterService.showtoast({ message: "User added successfully", type: "success" });
      }

      setOpen(false);
      fetchedData?.(); // refresh list if available

    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to add entry";
      ToasterService.showtoast({ message: msg, type: "error" });
    }
  };





  const rowActions = [
    { label: "Edit", color: "primary", onClick: (r) => handleEdit(r) },
    { label: "Delete", color: "error", onClick: (r) => handleDelete(r) },
  ];




  return (
    <Box sx={{ p: 4, background: "#f0f2f5", minHeight: "100vh" }}>

      {/* ROLE-BASED CARDS */}
      {(role === "admin" || role === "manager") && (
        <Grid container spacing={1} sx={{ mt: 2 }}>
          {visibleCards.map((card, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i} onClick={() => setCurrentCardName(card.label)}>
              <Paper
                elevation={currentCardName === card.label ? 6 : 0}
                sx={{
                  p: 3,
                  backgroundColor: card.bg,
                  borderRadius: 3,
                  textAlign: "center",
                  boxShadow: currentCardName === card.label ? `10px 10px 10px ${card.borderColor}` : '0px',
                  border: `2px solid ${card.borderColor}`,
                }}
              >
                {<card.icon />}
                <Typography variant="h6">{card.label}</Typography>
                <Typography variant="h4">{card.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* DYNAMIC TABLE BASED ON CARD */}
      {(role === "admin" || role === "manager") && (
        <Box mt={4}>
          {currentCardName === "Total Users" && role === "admin" && (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <AppTable rowData={users} rowActions={rowActions} headerColumn={userColumns} title="User List" text="Add User" onAddClick={() => handleAdd("User")} buttonColor="#1976d2"
                buttonIcon={<PersonAddIcon />} />
            </Paper>
          )}

          {currentCardName === "Total Managers" && role === "admin" && (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <AppTable rowData={managers} rowActions={rowActions} headerColumn={userColumns} title="Manager List" text="Add Manager" onAddClick={() => handleAdd("Manager")} buttonColor="#1976d2"
                buttonIcon={<PersonAddIcon />} />
            </Paper>
          )}

          {currentCardName === "Total Drivers" && (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <AppTable rowData={drivers} rowActions={rowActions} headerColumn={driverColumns} title="Driver List" text="Add Driver" onAddClick={() => handleAdd("Driver")} buttonColor="#1976d2"
                buttonIcon={<LocalShippingIcon />} />
            </Paper>
          )}

          {currentCardName === "Total Vehicles" && (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button variant="contained" onClick={handleAssignVehicle} sx={{ bgcolor: "#388e3c" }}>
                  Assign Vehicle
                </Button>
              </Box>

              <AppTable
                rowData={vehicles}
                rowActions={rowActions}
                onAddClick={() => handleAdd("vehicle")}
                headerColumn={vehicleColumns}
                text="Add Vehicle"
                title="Vehicle List"
              />
            </Paper>
          )}

        </Box>
      )}


      {/* DRIVER VIEW */}
      {role === "driver" && (
        <Box p={3}>
          {assignVehicle ? (
            <>
              <Paper elevation={3} sx={{ p: 3, maxWidth: 600 }}>
                <Typography variant="h6" gutterBottom>Assigned Vehicle Details</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography><strong>Name:</strong> {assignVehicle.vehicleName}</Typography>
                <Typography><strong>Model:</strong> {assignVehicle.vehicleModel}</Typography>
                <Typography><strong>Number:</strong> {assignVehicle.chassiNumber}</Typography>
                {assignVehicle.type && <Typography><strong>Fuel Type:</strong> {assignVehicle.type}</Typography>}
                {assignVehicle.vehicleYear && (
                  <Typography><strong>Registration Date:</strong> {new Date(assignVehicle.vehicleYear).toLocaleDateString()}</Typography>
                )}
              </Paper>

              {assignVehicle.vehiclePhotos && (
                <Box mt={4} sx={{ width: "100%", maxWidth: "1000px", mx: "auto", textAlign: "center" }}>
                  <Typography variant="h6" gutterBottom>Vehicle Image</Typography>
                  <Box component="img" src={assignVehicle.vehiclePhotos} alt="Assigned Vehicle" sx={{
                    width: "100%", maxHeight: 500, objectFit: "cover", borderRadius: 4, boxShadow: 3,
                  }} />
                </Box>
              )}
            </>
          ) : (
            <Typography>No vehicle assigned to you yet.</Typography>
          )}
        </Box>
      )}

      {/* MODAL */}
      <APPModal
        isOpen={open}
        onOkClick={editRole ? updateDetails : addDetails}
        onClose={() => {
          setOpen(false);
          setFormData({});
          setEditRole("");
          setAddRole("");
          setModalContent("form");
        }}
        title={modalTitle}
      >
        {modalContent === "form" && (editRole || addRole) && (
          <AppForm
            role={(editRole || addRole) as RoleType}
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {modalContent === "assignVehicle" && (
          <AssignVehicleForm
            drivers={drivers}
            vehicles={vehicles}
            onSuccess={() => {
              setOpen(false);
              fetchedData();
            }}
          />
        )}
      </APPModal>



      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            No
          </Button>
          <Button onClick={confirmDelete} color="error">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Outlet />
    </Box>
  );
};

export default Dashboard;
