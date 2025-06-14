import { Box, Grid, MenuItem, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import APPTextField from "./AppTextField";
import { GETBYID } from "../../Service/APIService";
import StorageService from "../../Service/StorageService";

const MyProfile: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
        dob: "",
        role: "",
    });

    // fetch user by id 
    const fetchUser = async () => {
        const item = StorageService.getUser();
        const res = await GETBYID({
            url: `/getById/${item.userId}`,
        });
        setFormData(res);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const formFields = [
        { name: "firstName", label: "First Name", placeholder: "Enter First Name" },
        { name: "lastName", label: "Last Name", placeholder: "Enter Last Name" },
        { name: "email", label: "Email", placeholder: "Enter email" },
        { name: "mobile", label: "Mobile", placeholder: "Enter Mobile no" },
        { name: "dob", label: "Date of Birth", type: "date" },
        { name: "role", label: "Select Role", type: "select", options: ["admin", "manager", "driver"] },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" mb={3} fontWeight={600}>
                My Profile
            </Typography>


            <Grid container spacing={2}>
                {formFields.map((field) => (
                    <Grid item xs={12} sm={6} md={4} key={field.name}>
                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 0.5, fontWeight: 600, color: "text.primary" }}
                        >
                            {field.label}
                        </Typography>

                        {field.type === "select" ? (
                            <TextField
                                select
                                fullWidth
                                name={field.name}
                                value={formData[field.name as keyof typeof formData] || ""}
                                onChange={handleChange}
                                size="small"
                            >
                                <MenuItem value="">Select a role</MenuItem>
                                {field.options?.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </TextField>
                        ) : (
                            <APPTextField
                                name={field.name}
                                placeholder={field.placeholder}
                                type={field.type || "text"}
                                onChange={handleChange}
                                value={formData[field.name as keyof typeof formData] || ""}
                            />
                        )}
                    </Grid>
                ))}
            </Grid>

        </Box>
    );
};

export default MyProfile;
