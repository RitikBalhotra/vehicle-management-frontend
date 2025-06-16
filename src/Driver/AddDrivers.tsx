import { Box, Typography } from "@mui/material";
import APPTextField from "../Components/UI/AppTextField";
import type { DriverForm } from "./types-d";
import type { ChangeEvent } from "react";

interface AddDriverProps {
    value: DriverForm;
    setValue: React.Dispatch<React.SetStateAction<DriverForm>>;
}

const AddDriver: React.FC<AddDriverProps> = ({ value, setValue }) => {
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setValue((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (
        e: ChangeEvent<HTMLInputElement>,
        field: "profileImage" | "licenseFile"
    ) => {
        const file = e.target.files?.[0] || null;
        setValue((prev) => ({ ...prev, [field]: file }));
    };

    const formFields =
        [
            { name: 'firstName', label: 'First Name', placeholder: 'Enter First Name' },
            { name: 'lastName', label: 'Last Name', placeholder: 'Enter Last Name' },
            { name: 'email', label: 'Email', placeholder: 'Enter email' },
            { name: 'mobile', label: 'Mobile', placeholder: 'Enter Mobile no' },
            { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password' },
            { name: 'dob', label: 'Date of Birth', type: 'date' },
            { name: 'role', label: 'Role', inputProps: { readOnly: true }, type: 'text' },
            { name: 'experience', label: 'Experience (yrs)', placeholder: "Experience in years" },
            { name: 'address', label: 'Address', placeholder: "Address" },
            { name: 'licenseExpiryDate', label: 'License Expiry', type: 'date' }
        ]



    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {formFields.map((field) => (
                <Box key={field.name}>
                    <Typography variant="subtitle2" mb={0.5} fontWeight="bold">
                        {field.label}
                    </Typography>
                    <APPTextField
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        inputProps={field.inputProps}
                        placeholder={field.placeholder}
                        type={field.type || "text"}
                        value={(value as any)[field.name]}
                        onChange={handleChange}
                        isreq
                    />
                </Box>
            ))}

            {/* Profile Image Upload */}
            <Box>
                <Typography fontWeight={600}>Upload Profile Image</Typography>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "profileImage")}
                />
                {value.profileImage && (
                    <Typography variant="caption">{value.profileImage.name}</Typography>
                )}
            </Box>

            {/* Driving License Upload */}
            <Box>
                <Typography fontWeight={600}>Upload Driving License</Typography>
                <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, "licenseFile")}
                />
                {value.licenseFile && (
                    <Typography variant="caption">{value.licenseFile.name}</Typography>
                )}
            </Box>
        </Box>
    );
};

export default AddDriver;
