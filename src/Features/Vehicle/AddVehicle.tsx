import { Box, Typography, Button, Avatar } from "@mui/material";
import type { VehicleForm } from "./types-v";
import APPTextField from "../../Components/UI/AppTextField";

type Props = {
  value: VehicleForm;
  setValue: React.Dispatch<React.SetStateAction<VehicleForm>>;
};

const formFields = [
  { name: "vehicleName", label: "Vehicle Name", placeholder: "Enter vehicle name" },
  { name: "vehicleModel", label: "Model", placeholder: "Enter model" },
  { name: "vehicleYear", label: "Year", type: "number", placeholder: "e.g., 2022" },
  { name: "vehicleType", label: "Type", type: "select", options: ["LTV", "HTV"] },
  { name: "chassiNumber", label: "Chassi No.", placeholder: "Enter chassi number" },
  { name: "registrationNumber", label: "Registration No.", placeholder: "Enter registration number" },
  { name: "vehicleDescription", label: "Description", placeholder: "Short description" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
];

const AddVehicle = ({ value, setValue }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: val } = e.target;
    setValue((prev) => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);
      setValue((prev) => ({ ...prev, vehiclePhotos: fileList }));
    }
  };

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
            placeholder={field.placeholder}
            isreq={true}
            options={field.options}
          />
        </Box>
      ))}

      {/* Vehicle Photos Upload Section */}
      <Box>
        <Typography variant="subtitle2" mb={0.5} fontWeight="bold">
          Upload Vehicle Photos
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          sx={{
            p: 1.2,
            border: "1px solid #ccc",
            borderRadius: "4px",
            bgcolor: "#fafafa",
          }}
        >
          {Array.isArray(value.vehiclePhotos) &&
            value.vehiclePhotos.map((file, idx) =>
              typeof file !== "string" ? (
                <Avatar
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${idx + 1}`}
                  sx={{ width: 56, height: 56 }}
                />
              ) : null
            )}

          <Button variant="outlined" component="label">
            Choose Files
            <input
              type="file"
              hidden
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </Button>
          <Typography variant="body2">
            {Array.isArray(value.vehiclePhotos) && value.vehiclePhotos.length > 0
              ? `${value.vehiclePhotos.length} file(s) selected`
              : "No files selected"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AddVehicle;
