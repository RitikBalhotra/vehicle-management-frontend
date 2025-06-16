import { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { DELETE, GETALLAPI, POSTAPI, UPDATEAPI } from "../Service/APIService";
import StorageService from "../Service/StorageService";
import AppButton from "../Components/UI/AppButton";
import APPModal from "../Components/UI/AppModal";
import AppTable from "../Components/UI/Apptable";
import AddDriver from "../Driver/AddDrivers";
import AddManager from "../Manager/AddManager"; // in case manager edit is allowed
import type { Driver, DriverForm } from "./types-d";

const defaultForm: DriverForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  mobile: "",
  licenseFile: null,
  profileImage: null,
  address: "",
  experience: "",
  dob: "",
  role: "driver",
};

const Drivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<DriverForm>(defaultForm);
  const [editData, setEditData] = useState<any>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");

  const columns = [
    { name: "profilePic", label: "Profile Pic" },
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "email", label: "Email" },
    { name: "mobile", label: "Mobile" },
    { name: "role", label: "Role" },
    { name: "actions", label: "Actions" },
  ];

  const rowActions = [
    {
      label: "Edit",
      color: "primary",
      onClick: (row) => handleEdit(row),
    },
    {
      label: "Delete",
      color: "error",
      onClick: (row) => handleDelete(row),
    },
  ];

  const fetchDrivers = async () => {
    try {
      const res = await GETALLAPI({ url: "/list" });
      if (Array.isArray(res)) {
        const driversList = res.filter((user) => user.role == "driver");
        setDrivers(driversList);
      }
    } catch {
      alert("Access denied. Only admin can view drivers.");
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleModalClose = () => {
    setOpen(false);
    setIsEditMode(false);
    setFormData(defaultForm);
    setEditData(null);
    setEditId(null);
    setEditRole("");
  };

  const saveData = async () => {
    try {
      const user = StorageService.getUser();
      if (!user) return alert("User not logged in");

      const payload = { ...formData, createdBy: user.id };
      await POSTAPI({ url: "/register", payload });

      fetchDrivers();
      handleModalClose();
    } catch (err: any) {
      console.error("Add Driver Error:", err);
      alert("Failed to add driver: " + err.message);
    }
  };

  const handleEdit = (row) => {
    setEditId(row._id);
    setEditRole(row.role);
    setIsEditMode(true);
    setOpen(true);

    const baseForm = {
      firstName: row.firstName || "",
      lastName: row.lastName || "",
      email: row.email || "",
      password: "",
      mobile: row.mobile || "",
      dob: row.dob ? new Date(row.dob) : "",
      profileImage: row.profileImage || null,
      role: row.role,
    };

    if (row.role === "driver") {
      setEditData({
        ...baseForm,
        licenseNumber: row.licenseNumber || "",
        licenseExpiry: row.licenseExpiry ? new Date(row.licenseExpiry) : "",
        address: row.address || "",
        experience: row.experience || "",
        licenseFile: row.licenseFile || null,
      });
    } else {
      setEditData(baseForm);
    }
  };

  const updateUser = async () => {
    try {
      const form = new FormData();
      form.append("firstName", editData.firstName);
      form.append("lastName", editData.lastName);
      form.append("email", editData.email);
      form.append("mobile", editData.mobile);
      if (editData.dob) {
        form.append("dob", new Date(editData.dob).toISOString());
      }
      form.append("role", editData.role);

      if (editData.profileImage && editData.profileImage instanceof File) {
        form.append("profileImage", editData.profileImage);
      }

      if (editRole === "driver") {
        form.append("licenseNumber", editData.licenseNumber);
        if (editData.licenseExpiry) {
          form.append("licenseExpiry", new Date(editData.licenseExpiry).toISOString());
        }
        form.append("address", editData.address);
        form.append("experience", editData.experience);
        if (editData.licenseFile && editData.licenseFile instanceof File) {
          form.append("licenseFile", editData.licenseFile);
        }
      }

      await UPDATEAPI({
        url: `/update/${editId}`,
        payload: editData,
        header: { "Content-Type": "multipart/form-data" },
      });

      fetchDrivers();
      handleModalClose();
    } catch (err: any) {
      console.error("Update error:", err.message);
    }
  };

  const handleDelete = async (row) => {
    try {
      await DELETE({ url: `/delete/${row._id}` });
      fetchDrivers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={4}
            onClick={() => {
              setOpen(true);
              setIsEditMode(false);
            }}
            sx={{
              p: 3,
              bgcolor: "#2e7d32",
              color: "#fff",
              borderRadius: 2,
              minHeight: 150,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.2s ease-in-out",
              cursor: "pointer",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Total Drivers: {drivers.length}
            </Typography>
            <AppButton
              text="Add Driver"
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
                setIsEditMode(false);
              }}
              sx={{
                alignSelf: "flex-start",
                mt: 2,
                backgroundColor: "#ffffff",
                color: "#2e7d32",
                fontWeight: 600,
                textTransform: "uppercase",
                "&:hover": {
                  backgroundColor: "#f3e5f5",
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 2 }}>
          <AppTable
            rowData={drivers}
            rowActions={rowActions}
            headerColumn={columns}
            title="Driver List"
            headerActions={[]}
          />
        </Paper>
      </Box>

      <APPModal
        isOpen={open}
        onClose={handleModalClose}
        onOkClick={isEditMode ? updateUser : saveData}
        title={isEditMode ? "Edit User" : "Add Driver"}
      >
        {isEditMode ? (
          editRole === "driver" ? (
            <AddDriver value={editData} setValue={setEditData} />
          ) : (
            <AddManager value={editData} setValue={setEditData} />
          )
        ) : (
          <AddDriver value={formData} setValue={setFormData} />
        )}
      </APPModal>

      <Outlet />
    </Box>
  );
};

export default Drivers;
