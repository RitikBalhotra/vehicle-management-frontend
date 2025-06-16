import {
  Avatar,
  Box,
  Button,
  Typography,
} from "@mui/material";
import APPTextField from "../Components/UI/AppTextField";
import type { ChangeEvent } from "react";
import type { ManagerForm } from "./types-m";

interface AddManagerProps {
  value: ManagerForm;
  setValue: React.Dispatch<React.SetStateAction<ManagerForm>>;
}

const AddManager: React.FC<AddManagerProps> = ({ value, setValue }) => {
  // handle change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };


  const formatDate = (date?: string | Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  // handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue((prev) => ({ ...prev, profilePic: file }));
    }
  };

  const formFields = [
    { name: "firstName", label: "First Name", placeholder: "Enter First Name" },
    { name: "lastName", label: "Last Name", placeholder: "Enter Last Name" },
    { name: "email", label: "Email", placeholder: "Enter email" },
    { name: "mobile", label: "Mobile", placeholder: "Enter Mobile no" },
    { name: "password", label: "Password", type: "password", placeholder: "Enter password" },
    { name: "dob", label: "Date of Birth", type: "date" },
    { name: "role", label: "Select Role", type: "select", options: ["admin", "manager", "driver"] },
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
            value={
              field.type === "date"
                ? formatDate(value[field.name as keyof ManagerForm])
                : value[field.name as keyof ManagerForm] || ""
            }
            onChange={handleChange}
            type={field.type || "text"}
            placeholder={field.placeholder}
            isreq={true}
            options={field.options}
          />
        </Box>
      ))}

      {/* Profile Image Styled Like a Text Field */}
      <Box>
        <Typography variant="subtitle2" mb={0.5} fontWeight="bold">
          Upload Profile Image
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            p: 1.2,
            border: "1px solid #ccc",
            borderRadius: "4px",
            bgcolor: "#fafafa",
          }}
        >
          {value.profilePic && (
            <Avatar
              src={
                typeof value.profilePic === "string"
                  ? value.profilePic
                  : URL.createObjectURL(value.profilePic)
              }
              alt="Profile Preview"
              sx={{ width: 56, height: 56 }}
            />
          )}

          <Button variant="outlined" component="label">
            Choose File
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          <Typography variant="body2">
            {value.profilePic instanceof File
              ? value.profilePic
              : typeof value.profilePic === "string"
                ? value.profilePic.split('/').pop()
                : "No file selected"}
          </Typography>
        </Box>

      </Box>
    </Box>
  );
};

export default AddManager;
