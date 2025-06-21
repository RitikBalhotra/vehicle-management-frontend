import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import StorageService from "../Service/StorageService";
import {
  DELETE,
  GETALLAPI,
  GETALLVEHICLES,
  GETASSIGNEDVEHICLE,
  UPDATEAPI,
} from "../Service/APIService";
import AppTable from "../Components/UI/Apptable";
import type { Driver, DriverForm, Manager, ManagerForm, User, UserForm, Vehicle, VehicleForm, FieldConfig } from "../Components/types/types";
import  { cardData, driverFields, managerFields, userFields, UserFields,  } from "../Components/types/types";
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
import AddVehicle from "../Features/Vehicle/AddVehicle";



const Dashboard = () => {
  const [role, setRole] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [assignVehicle, setAssignVehicle] = useState<Vehicle | null>(null);
  const [currentCardName, setCurrentCardName] = useState<string>('Total Users');
  const [initalForm, setInitailForm] = useState(UserFields);
  const [visibleFields, setVisibleFields] = useState<FieldConfig<any>[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<UserForm | ManagerForm | DriverForm | VehicleForm>>({});
  const [editRole, setEditRole] = useState("");
  const [addRole, setAddRole] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [btnColor, setBtnColor] = useState('')
  const [modalTitle, setModelTitle] = useState('');


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

      console.log("user fecthed : " + userRes);
      if (Array.isArray(userRes)) {
        setUsers(userRes);
        setManagers(userRes.filter((u) => u.role == "manager"));
        setDrivers(userRes.filter((u) => u.role == "driver"));


        if (Array.isArray(vehicleRes)) setVehicles(vehicleRes);

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
  const handleEdit = useCallback((r: User | Manager | Driver) => {
    if (!r) return;

    setEditId(r._id);
    setEditRole(r.role);
    console.log(r.role)
    setOpen(true);
    setModelTitle(`Edit ${r.role?.toString().toUpperCase() || "User"}`);

    const baseForm = {
      firstName: r.firstName || "",
      lastName: r.lastName || "",
      email: r.email || "",
      password: "", // intentionally blank
      mobile: r.mobile || "",
      dob: r.dob ? new Date(r.dob) : "",
      profilePic: r.profilePic || null,
      role: r.role,
    };

    if (r.role == "driver") {
      setFormData({
        ...baseForm,
        licenseExpiry: r.licenseExpiry ? new Date(r.licenseExpiry) : "",
        address: r.address || "",
        experience: r.experience || "",
        licenseFile: r.licenseFile || null,
      });
      setVisibleFields(driverFields);
    } else if (r.role == "manager") {
      setFormData(baseForm);
      setVisibleFields(managerFields);
    } else {
      setFormData(baseForm);
      setVisibleFields(userFields);
    }

    console.log("📝 Editing form data:",baseForm);
  }, [formData]);


  // handle Delete
  const handleDelete = async (r) => {
    const res = await DELETE({ url: `/delete/${r._id}` });
    if (res) {
      ToasterService.showtoast({ message: 'Deleted Successfully!', type: "success" })
    }
    await fetchedData();
  };


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

    const baseFields = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      mobile: "",
      dob: "",
      profilePic: null,
      role,
    };

    const roleFields = {
      manager: {},
      driver: {
        licenseExpiry: "",
        address: "",
        experience: "",
        licenseFile: null,
      },
      user: {},
      vehicle: {}, // if any
    };

    if (role === "user") {
      setVisibleFields(userFields);
    } else if (role === "manager") {
      setVisibleFields(managerFields);
    } else if (role === "driver") {
      setVisibleFields(driverFields);
    }

    setFormData({ ...baseFields, ...(roleFields[role] || {}) });
    setModelTitle(`Add ${label}`);
    setEditId(null);
    setAddRole(role);
    setOpen(true);
  };

  //update user
  const updateUser = async () => {
    try {
      const form = new FormData();

      // Only append user/manager/driver fields if not vehicle
      if (editRole !== "vehicle") {
        form.append("firstName", (formData as UserForm | ManagerForm | DriverForm).firstName || "");
        form.append("lastName", (formData as UserForm | ManagerForm | DriverForm).lastName || "");
        form.append("email", (formData as UserForm | ManagerForm | DriverForm).email || "");
        form.append("mobile", (formData as UserForm | ManagerForm | DriverForm).mobile || "");
        if ((formData as UserForm | ManagerForm | DriverForm).dob)
          form.append("dob", new Date((formData as UserForm | ManagerForm | DriverForm).dob as Date).toISOString());
        form.append("role", (formData as UserForm | ManagerForm | DriverForm).role || "");

        if ((formData as UserForm | ManagerForm | DriverForm).profilePic instanceof File) {
          form.append("profilePic", (formData as UserForm | ManagerForm | DriverForm).profilePic as File);
        }

        if (editRole == "driver") {
          if ((formData as DriverForm).licenseExpiry) {
            form.append("licenseExpiry", new Date((formData as DriverForm).licenseExpiry as Date).toISOString());
          }
          form.append("address", (formData as DriverForm).address || "");
          form.append("experience", (formData as DriverForm).experience || "");
          if ((formData as DriverForm).licenseFile instanceof File) {
            form.append("drivingLicense", (formData as DriverForm).licenseFile as File);
          }
        }
      }
      // If you want to handle vehicle update, add logic here for VehicleForm fields

      console.log("form data which send to backend : " + form.get);
      await UPDATEAPI({
        url: `/update/${editId}`,
        payload: form,
        header: { "Content-Type": "multipart/form-data" },
      });

      await fetchedData();
      setOpen(false);
      setEditRole("")
    } catch (err) {
      console.error("Update error:", err);
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
              <AppTable rowData={vehicles} rowActions={[]} headerColumn={vehicleColumns} title="Vehicle List" text="Add Vehicle" onAddClick={() => handleAdd("vehicle")} buttonColor="#388e3c" />
            </Paper>
          )}
        </Box>
      )}


      {/* DRIVER VIEW */}
      {role === "driver" && (
        <Box p={3}>
          <Typography variant="h4" gutterBottom>Driver Dashboard</Typography>

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
        onOkClick={updateUser}
        onClose={() => setOpen(false)}
        title={modalTitle}
      >
        {["user", "manager", "driver"].includes(addRole || editRole) && visibleFields.length > 0 && (
          <AppForm
            key={editId || modalTitle}
            fields={visibleFields.map((field) => ({
              ...field,
              type: field.type ?? "text",
            }))}
            setValue={setFormData}
            value={formData}
          />
        )}

        {(addRole === "vehicle" || editRole === "vehicle") && (
          <AddVehicle setValue={setFormData} value={formData} />
        )}
      </APPModal>




      <Outlet />
    </Box>
  );
};

export default Dashboard;
