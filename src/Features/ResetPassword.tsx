import React, { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import APPTextField from "../Components/UI/AppTextField"; // your reusable input
import img from "../images/login-bg.png"
import { POSTAPI } from "../Service/APIService"; // your API handler
import { useNavigate } from "react-router-dom";
import ToasterService from "../Service/ToastService";
import Spinnerservice from "../Service/SpinnerService";

const ResetPassword = () => {
    const [form, setForm] = useState({ otp: "", newPassword: "" });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.otp || !form.newPassword) {
            ToasterService.showtoast({message:"Both Fields are required", type:"info"})
            return;
        }

        try {
            Spinnerservice.showSpinner();
            await POSTAPI({
                url: "/reset",
                payload: {
                    otp: form.otp,
                    newPassword: form.newPassword,
                },
            });
            ToasterService.showtoast({message: "Password reset successfully", type:"success"});
            navigate("/login");
            Spinnerservice.hideSpinner();
        } catch (err: any) {
            ToasterService.showtoast({message:"Failed to reset Password", type:"error"})
        }
    };

    const fields = [
        { name: "otp", label: "Otp" },
        { name: "newPassword", label: "New Password", type: "password" },

    ]

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                background: 'linear-gradient(to bottom right, #ddeeff, #f3e8ff)',
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    maxWidth: 380,
                    width: '100%',
                    p: 4,
                    borderRadius: 3,
                    backgroundColor: '#ffffffee',
                    zIndex: 2,
                }}
            >
                {fields.map(field => (
                    <Box key={field.name}>
                        <Typography variant="body2" fontWeight="600" textAlign="left" mb={2}>
                            {field.label}
                        </Typography>

                        <APPTextField
                            name={field.name}
                            type={field.type}
                            onChange={handleChange}
                        />
                    </Box>
                )
                )}
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{
                        mt: 2,
                        py: 1.3,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        fontSize: '1rem',
                    }}
                >
                    Change Password
                </Button>
            </Paper>

            {/* Right Side Image */}
            <Box
                sx={{
                    display: { xs: 'none', md: 'block' },
                    maxWidth: 600,
                    ml: 8,
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    mb={2}
                    textAlign="center"
                    color="primary"
                >
                    Vehicle Management System
                </Typography>
                <img
                    src={img}
                    alt="Reset Image"
                    style={{ maxWidth: '100%' }}
                />
            </Box>
        </Box>
    );
};

export default ResetPassword;
