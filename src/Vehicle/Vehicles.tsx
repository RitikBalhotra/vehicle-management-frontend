import { Box, Paper, Typography } from "@mui/material";
import AppButton from "../Components/UI/AppButton";
import AppTable from "../Components/UI/Apptable";
import { useEffect, useState } from "react";
import { GETALLVEHICLES, POSTVEHICLE } from "../Service/APIService";
import APPModal from "../Components/UI/AppModal";
import AddVehicle from "./AddVehicle";
// import StorageService from "../Service/StorageService";
import type { Vehicle, VehicleForm } from "./types-v";

const defaultForm: VehicleForm = {
    vehicleName: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleType: "",
    chassiNumber: "",
    registrationNumber: "",
    vehicleDescription: "",
    status: ""
};

const Vehicles = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<VehicleForm>(defaultForm);

    const columns = [
        { name: "vehicleName", label: "Vehicle Name" },
        { name: "vehicleModel", label: "Model" },
        { name: "vehicleYear", label: "Year" },
        { name: "Vehicle Type", label: "Vehicle Type" },
        { name: "chassiNumber", label: "Chassi Number" },
        { name: "Actions", label: "Actions" }
    ];

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const res = await GETALLVEHICLES({ url: "/vehiclelist" });
            if (res.data) {
                setVehicles(res.data);
            }
        } catch (error) {
            console.error("Vehicle fetch failed:", error);
            alert("Failed to fetch vehicles.");
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
            status
        } = formData;

        if (
            !vehicleName ||
            !vehicleModel ||
            !vehicleYear ||
            !vehicleType ||
            !chassiNumber ||
            !registrationNumber ||
            !vehicleDescription ||
            !status
        ) {
            return alert("Please fill all fields!");
        }

        try {
            console.log(formData);
            const res = await POSTVEHICLE({ url: "/add", payload: formData });
            console.log(res);
            if (res) {
                alert("Vehicle added successfully!");
                setOpen(false);
                setFormData(defaultForm);
                fetchVehicles();
            }
            else{
                console.log("response is not coming so vehicle is not addded and data not fetched");
            }

        } catch (err) {
            alert("Vehicle not added. Try again.");
            console.error("Error adding vehicle:", err);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Summary + Add Button */}
            <Box sx={{ mb: 2 }}>
                <Paper elevation={3} sx={{ width: 250, p: 3, borderRadius: 3, textAlign: "center" }}>
                    <Typography variant="h6" mb={1}>
                        Total Vehicles
                    </Typography>
                    <AppButton text="Add Vehicle" onClick={() => setOpen(true)} />
                </Paper>
            </Box>

            {/* Modal */}
            <APPModal isOpen={open} onClose={() => setOpen(false)} title="Add Vehicle" onOkClick={saveData}>
                <AddVehicle value={formData} setValue={setFormData} />
            </APPModal>

            {/* Table */}
            <Box sx={{ p: 2 }}>
                <AppTable
                    rowData={vehicles.map((v, idx) => ({
                        ...v,
                        id: v.id ?? idx
                    }))}
                    headerColumn={columns}
                    title="Vehicle List"
                    headerActions={[]}
                />
            </Box>

        </Box>
    );
};

export default Vehicles;
