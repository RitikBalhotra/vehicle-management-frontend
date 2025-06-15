import { Box, Typography } from "@mui/material";
import APPTextField from "../Components/UI/AppTextField";
import type { ChangeEvent } from "react";
import type { VehicleForm } from "./types-v"; // Adjust path if needed

interface AddVehicleProps {
  value: VehicleForm;
  setValue: React.Dispatch<React.SetStateAction<VehicleForm>>;
}

const AddVehicle: React.FC<AddVehicleProps> = ({ value, setValue }) => {
 
    // handle change
    const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const formFields = [
    { name: "vehicleName", label: "Vehicle Name", placeHolder: "Enter Vehicle Name" },
    { name: "vehicleModel", label: "Vehicle Model", placeHolder: "Enter Vehicle Model" },
    { name: "vehicleYear", label: "Vehicle Year", placeHolder: "Enter Vehicle Year" },
    { name: "chassiNumber", label: "Chassi Number", placeHolder: "Enter Chassi Number" },
    { name: "registrationNumber", label: "Registration Number", placeHolder: "Enter Registration Number" },
    {
      name: "vehicleDescription",
      label: "Vehicle Description",
      type: "textarea",
      placeHolder: "Enter Vehicle Description",
    },
    { name: "vehicleType", label: "Vehicle Type", type: "select", options: ["LTV", "HTV"] },
    { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {formFields.map((field) => (
        <Box key={field.name}>
          <Typography variant="subtitle2" mb={0.5} fontWeight="bold">
            {field.label}
          </Typography>
          <APPTextField
            name={field.name}
            value={value[field.name as keyof VehicleForm] || ""}
            onChange={handleChange}
            type={field.type || "text"}
            placeholder={field.placeHolder}
            isreq={true}
            options={field.options}
          />
        </Box>
      ))}
    </Box>
  );
};

export default AddVehicle;
