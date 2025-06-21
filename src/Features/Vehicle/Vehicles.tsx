import { Box, Grid, Paper, Typography } from "@mui/material";
import AppButton from "../../Components/UI/AppButton";
import AppTable from "../../Components/UI/Apptable";
import APPModal from "../../Components/UI/AppModal";
import AddVehicle from "./AddVehicle";
import { useEffect, useState } from "react";
import { GETALLAPI, GETALLDRIVERS, GETALLVEHICLES, POSTVEHICLE, UPDATEVEHICLE } from "../../Service/APIService";
import type { Vehicle, VehicleForm } from "./types-v";
import StorageService from "../../Service/StorageService";
import AssignVehicleForm from "./AssignVeichleForm";
import type { Driver } from "../../Driver/types-d";

const defaultForm: VehicleForm = {
  vehicleName: "",
  vehicleModel: "",
  vehicleYear: "",
  vehicleType: "",
  chassiNumber: "",
  registrationNumber: "",
  vehicleDescription: "",
  status: "",
  vehiclePhotos: [],
  type: ""
};

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
   const [drivers, setDrivers] = useState<Driver[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<VehicleForm>(defaultForm);
  const [editData, setEditData] = useState<VehicleForm | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [role, setRole]  =useState("");


  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await GETALLVEHICLES({ url: "/vehiclelist" });
      if (res.data) setVehicles(res.data);
      const user = StorageService.getUser();
      console.log(user.role[0]);
      setRole(user.role[0])
    } catch (error) {
      console.error("Vehicle fetch failed:", error);
      alert("Failed to fetch vehicles.");
    }
  };


   const fetchDrivers = async () => {
    const res = await GETALLDRIVERS({url:'/drivers'}); 
    if (res.success) {
      setDrivers(res.data);
    }
  };

  const saveData = async () => {
    const {
      vehicleName,
      vehicleModel,
      vehicleYear,
      vehicleType,
      chassiNumber,
      registrationNumber,
      vehicleDescription,
      status,
      vehiclePhotos,
    } = formData;

    if (
      !vehicleName || !vehicleModel || !vehicleYear || !vehicleType ||
      !chassiNumber || !registrationNumber || !vehicleDescription ||
      !status || !vehiclePhotos
    ) {
      return alert("Please fill all fields!");
    }

    try {
      const user = StorageService.getUser();
      const payloadWithCreator = {
        ...formData,
        created_by: user?.id
      };

      const res = await POSTVEHICLE({ url: "/add", payload: payloadWithCreator });

      if (res) {
        alert("Vehicle added successfully!");
        setFormData(defaultForm);
        setOpen(false);
        fetchVehicles();
      }
    } catch (err: any) {
      if (err?.response?.status === 400 && err?.response?.data?.message === "Vehicle exists") {
        alert("Vehicle with this Chassi Number already exists.");
      } else {
        alert("Vehicle not added. Try again.");
      }
      console.error("Error adding vehicle:", err);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    const form = {
      vehicleName: vehicle.vehicleName || "",
      vehicleModel: vehicle.vehicleModel || "",
      vehicleYear: vehicle.vehicleYear || "",
      vehicleType: vehicle.vehicleType || "",
      chassiNumber: vehicle.chassiNumber || "",
      registrationNumber: vehicle.registrationNumber || "",
      vehicleDescription: vehicle.vehicleDescription || "",
      status: vehicle.status || "",
      vehiclePhotos: vehicle.vehiclePhotos || [],
      type: vehicle.type || ""
    };

    setEditId(vehicle._id);
    setEditData(form);
    setIsEditMode(true);
    setOpen(true);
  };

  const updateVehicle = async () => {
    try {
      if (!editId || !editData) return;

      const form = new FormData();
      form.append("vehicleName", editData.vehicleName);
      form.append("vehicleModel", editData.vehicleModel);
      form.append("vehicleYear", editData.vehicleYear);
      form.append("vehicleType", editData.vehicleType);
      form.append("chassiNumber", editData.chassiNumber);
      form.append("registrationNumber", editData.registrationNumber);
      form.append("vehicleDescription", editData.vehicleDescription);
      form.append("status", editData.status);
      form.append("type", editData.type);

      if (editData.vehiclePhotos && Array.isArray(editData.vehiclePhotos)) {
        editData.vehiclePhotos.forEach((photo) => {
          if (photo instanceof File) {
            form.append("vehiclePhotos", photo);
          }
        });
      }

      await UPDATEVEHICLE({
        url: `/updatevehicle/${editId}`,
        payload: form,
        header: { "Content-Type": "multipart/form-data" },
      });

      console.log("Vehicle updated successfully");
      await fetchVehicles();
      setOpen(false);
      setIsEditMode(false);
      setEditData(null);
      setEditId(null);
    } catch (error: any) {
      console.error("Update vehicle failed:", error.message);
    }
  };

  const handleDelete = (r: Vehicle) => {
    console.log(r);
  };

  const columns = [
    { name: "vehicleName", label: "Vehicle Name" },
    { name: "vehicleModel", label: "Model" },
    { name: "vehicleYear", label: "Year" },
    { name: "vehicleType", label: "Type" },
    { name: "chassiNumber", label: "Chassi No." },
    { name: "registrationNumber", label: "Registration No." },
    { name: "status", label: "Status" },
    { name: "Actions", label: "Actions" },
  ];

  const rowActions = [
    {
      label: 'Edit',
      color: 'primary',
      onClick: (r: Vehicle) => handleEdit(r),
    },
    {
      label: 'Delete',
      color: 'error',
      onClick: (r: Vehicle) => handleDelete(r),
    },
  ];

  return (
    <Box>
      {/* Dashboard Cards */}
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
              bgcolor: "#ef6c00",
              color: "#fff",
              borderRadius: 2,
              minHeight: 150,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.2s ease-in-out",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Total Vehicles: {vehicles.length}
            </Typography>

            <AppButton
              text="Add Vehicle"
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
                color: "#9c27b0",
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

      {/* Table Section */}
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 2 }}>
          <AppTable
            rowData={vehicles}
            rowActions={rowActions}
            headerColumn={columns}
            title="Vehicle List"
            headerActions={[]}
          />
        </Paper>
      </Box>

      {(role === "admin" || role === "manager") && (
        <AssignVehicleForm
          drivers={drivers}
          vehicles={vehicles}
          onSuccess={fetchVehicles} // refresh the data after assign
        />
      )}
      {/* Modal for Add/Edit Vehicle */}
      <APPModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setIsEditMode(false);
          setEditData(null);
          setEditId(null);
          setFormData(defaultForm);
        }}
        onOkClick={isEditMode ? updateVehicle : saveData}
        title={isEditMode ? "Edit Vehicle" : "Add Vehicle"}
      >
        <AddVehicle
          value={isEditMode && editData ? editData : formData}
          setValue={isEditMode ? setEditData : setFormData}
        />
      </APPModal>
    </Box>
  );
};

export default Vehicles;
