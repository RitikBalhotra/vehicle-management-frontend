import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {
  DELETE,
  GETALLAPI,
  POSTAPI,
  UPDATEAPI,
} from "../Service/APIService";
import AppTable from "../Components/UI/Apptable";
import AppButton from "../Components/UI/AppButton";
import APPModal from "../Components/UI/AppModal";
import AddManager from "./AddManager";
import AddDriver from "../Driver/AddDrivers";
import StorageService from "../Service/StorageService";
import type { Manager, ManagerForm } from "./types-m";

const defaultForm: ManagerForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  mobile: "",
  dob: "",
  profileImage: null,
  role: "manager",
};

const Managers = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ManagerForm>(defaultForm);
  const [editData, setEditData] = useState<any>(null);
  const [editRole, setEditRole] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

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
      onClick: (row: Manager) => handleEdit(row),
    },
    {
      label: "Delete",
      color: "error",
      onClick: (row: Manager) => handleDelete(row),
    },
  ];

  const fetchUsers = async () => {
    try {
      const res = await GETALLAPI({ url: "/list" });
      if (Array.isArray(res)) {
        const managersList = res.filter((user: Manager) => user.role == "manager");
        setManagers(managersList);
      } else {
        console.error("Expected array but got:", res);
      }
    } catch {
      alert("Access denied. Only admin can view users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const saveData = async () => {
    try {
      const user = StorageService.getUser();
      if (!user) return alert("User not logged in");

      const payload = { ...formData, createdBy: user.id };

      await POSTAPI({ url: "/register", payload });
      fetchUsers();
      handleModalClose();
    } catch (err: any) {
      console.error("Add Manager Error:", err);
      alert("Failed to add manager: " + err.message);
    }
  };

  const handleEdit = (r: any) => {
    setIsEditMode(true);
    setEditRole(r.role);
    setEditId(r?._id);
    setOpen(true);

    const baseForm = {
      firstName: r.firstName || "",
      lastName: r.lastName || "",
      email: r.email || "",
      password: "",
      mobile: r.mobile || "",
      dob: r.dob ? new Date(r.dob) : "",
      profileImage: r?.profileImage || null,
      role: r.role,
    };

    if (r.role === "driver") {
      setEditData({
        ...baseForm,
        licenseNumber: r.licenseNumber || "",
        licenseExpiry: r.licenseExpiry ? new Date(r.licenseExpiry) : "",
        address: r.address || "",
        experience: r.experience || "",
        licenseFile: r.licenseFile || null,
      });
    } else {
      setEditData(baseForm);
    }
  };

  const updateUser = async () => {
    try {
      const form = new FormData();

      for (const key in editData) {
        const value = editData[key];
        if (value instanceof File) {
          form.append(key, value);
        } else if (value !== undefined && value !== null) {
          form.append(key, value.toString());
        }
      }

      await UPDATEAPI({
        url: `/update/${editId}`,
        payload: form,
        header: { "Content-Type": "multipart/form-data" },
      });

      fetchUsers();
      handleModalClose();
    } catch (err: any) {
      console.error("Update error:", err.message);
    }
  };

  const handleDelete = async (r: Manager) => {
    try {
      await DELETE({ url: `/delete/${r._id}` });
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleModalClose = () => {
    setOpen(false);
    setIsEditMode(false);
    setEditData(null);
    setEditId(null);
    setFormData(defaultForm);
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
              bgcolor: "#9c27b0",
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
              Total Managers: {managers.length}
            </Typography>

            <AppButton
              text="Add Manager"
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
                setIsEditMode(false);
              }}
              sx={{
                alignSelf: "flex-start",
                mt: 2,
                backgroundColor: "#fff",
                color: "#9c27b0",
                fontWeight: 600,
                textTransform: "uppercase",
                "&:hover": { backgroundColor: "#f3e5f5" },
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Paper sx={{ p: 2 }}>
          <AppTable
            rowData={managers}
            rowActions={rowActions}
            headerColumn={columns}
            title="Manager List"
            headerActions={[]}
          />
        </Paper>
      </Box>

      <APPModal
        isOpen={open}
        onClose={handleModalClose}
        onOkClick={isEditMode ? updateUser : saveData}
        title={isEditMode ? "Edit User" : "Add Manager"}
      >
        {isEditMode ? (
          editRole === "driver" ? (
            <AddDriver value={editData} setValue={setEditData} />
          ) : (
            <AddManager value={editData} setValue={setEditData} />
          )
        ) : (
          <AddManager value={formData} setValue={setFormData} />
        )}
      </APPModal>

      <Outlet />
    </Box>
  );
};

export default Managers;
