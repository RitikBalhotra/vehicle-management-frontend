import {
  Avatar,
  Box,
  Button,
  Typography,
} from "@mui/material";
import APPTextField from "../../Components/UI/AppTextField";
import type { ChangeEvent } from "react";

interface FieldConfig<T> {
  name: keyof T;
  label: string;
  type: 'text' | 'email' | 'number' | 'password' | 'date' | 'select' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

interface AppFormProps<T> {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  fields: FieldConfig<T>[];
}

const AppForm = <T extends { role?: string; profilePic?: any; licenseFile?: any }>({
  value,
  setValue,
  fields,
}: AppFormProps<T>) => {
  console.log(value);
  

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValue(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "profilePic" | "licenseFile"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(prev => ({ ...prev, [field]: file }));
    }
  };

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  // Role-based field exclusion
  const excludeFieldsByRole: Record<string, (keyof T)[]> = {
    manager: ["licenseExpiry", "experience", "address", "licenseFile"] as (keyof T)[],
    admin: ["licenseExpiry", "experience", "address", "licenseFile"] as (keyof T)[],
    user: [] as (keyof T)[],
    driver: [] as (keyof T)[],
  };

  const getFilteredFields = () => {
    const excludeList = value.role ? excludeFieldsByRole[value.role] ?? [] : [];
    return fields.filter(field => !excludeList.includes(field.name));
  };

  const filteredFields = getFilteredFields();

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {filteredFields.map((field) => (
        <Box key={String(field.name)}>
          <Typography variant="subtitle2" mb={0.5} fontWeight="bold">
            {field.label}
          </Typography>
          <APPTextField
            name={String(field.name)}
            value={
              field.type === "date"
                ? formatDate(value[field.name] as string | Date | null)
                : value[field.name] ?? ""
            }
            onChange={handleChange}
            type={field.type}
            placeholder={field.placeholder}
            isreq={true}
            options={field.options}
          />
        </Box>
      ))}

      {/* Profile Picture Upload */}
      {value.role && ["manager", "driver", "user"].includes(value.role) && (
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
                sx={{ width: 56, height: 56 }}
              />
            )}
            <Button variant="outlined" component="label">
              Choose File
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e, "profilePic")}
              />
            </Button>
            <Typography variant="body2">
              {value.profilePic
                ? typeof value.profilePic === "string"
                  ? value.profilePic.split("/").pop()
                  : value.profilePic.name
                : "No file selected"}
            </Typography>
          </Box>
        </Box>
      )}

      {/* License Upload (Driver Only) */}
      {value.role === "driver" && (
        <Box>
          <Typography variant="subtitle2" mb={0.5} fontWeight="bold">
            Upload License Image
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
            {value.licenseFile && (
              <Avatar
                src={
                  typeof value.licenseFile === "string"
                    ? value.licenseFile
                    : URL.createObjectURL(value.licenseFile)
                }
                sx={{ width: 56, height: 56 }}
              />
            )}
            <Button variant="outlined" component="label">
              Choose File
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e, "licenseFile")}
              />
            </Button>
            <Typography variant="body2">
              {value.licenseFile
                ? typeof value.licenseFile === "string"
                  ? value.licenseFile.split("/").pop()
                  : value.licenseFile.name
                : "No file selected"}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AppForm;
