import { Box, Typography } from "@mui/material";
import APPTextField from "../Components/UI/AppTextField";
import type { ChangeEvent } from "react";
import type { DriverForm } from "./types-d"; 

interface AddDriverProps {
    value: DriverForm;
    setValue: React.Dispatch<React.SetStateAction<DriverForm>>;
}

const AddDriver: React.FC<AddDriverProps> = ({ value, setValue }) => {
    
    // handle change
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setValue((prev) => ({ ...prev, [name]: value }));
    };

    const formFields =
        [
            { name: 'firstName', label: 'First Name', placeholder: 'Enter First Name' },
            { name: 'lastName', label: 'Last Name', placeholder: 'Enter Last Name' },
            { name: 'email', label: 'Email', placeholder: 'Enter email' },
            { name: 'mobile', label: 'Mobile', placeholder: 'Enter Mobile no' },
            { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password' },
            { name: 'dob', label: 'Date of Birth', type: 'date' },
            { name: 'role', label: 'Select Role', type: 'select', options: ['admin', 'manager', 'driver'] }
        ]



    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {formFields.map((field) => (
                <Box key={field.name}>
                    <Typography variant="subtitle2" mb={0.5} fontWeight="bold">
                        {field.label}
                    </Typography>
                    <APPTextField
                        name={field.name}
                        value={value[field.name as keyof DriverForm] || ""}
                        onChange={handleChange}
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        isreq={true}
                        options={field.options}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default AddDriver;
