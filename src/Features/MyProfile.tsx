import {
    Avatar,
    Box,
    Paper,
    Typography,
    Grid,
    Divider,
    Button,
    TextField,
    IconButton
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import StorageService from "../Service/StorageService";
import EditIcon from "@mui/icons-material/Edit";
import { ChangeEvent, useRef } from "react";
import ToasterService from "../Service/ToastService";
import { GETBYID } from "../Service/APIService";
import { driverFields, managerFields } from "../Components/types/types"
import type { DriverForm, ManagerForm, } from "../Components/types/types";
import { useNavigate } from "react-router-dom";





const MyProfile = () => {
    const [fields, setFields] = useState<Array<{ name: string; label: string; type?: string }>>([]);
    const [formData, setFormData] = useState<Partial<ManagerForm | DriverForm>>({});

    const fileFieldNames = ["profilePic", "licenseFile"];
    const navigate = useNavigate();


    useEffect(() => {
        fetchUser();
    }, [])



    const fetchUser = useCallback(async () => {
        const user = StorageService.getUser();

        if (!user) {
            ToasterService.showtoast({
                message: "User not Logged in",
                type: "error",
            });
            navigate("/");
            return;
        }

        try {
            console.log("User ID:", user.id);
            const res = await GETBYID({ url: `/user/${user.id}` });
            setFormData(res);
            if (formData.role === "manger" || formData.role === "admin") {
                setFields(
                    managerFields.map(field => ({
                        ...field,
                        name: String(field.name)
                    }))
                );
            }
            else {
                setFields(
                    driverFields.map(field => ({
                        ...field,
                        name: String(field.name)
                    }))
                );
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            ToasterService.showtoast({
                message: "Failed to fetch user data",
                type: "error",
            });
            navigate("/");
        }
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profilePic: file,
            }));
        }

        // Optional: reset the input after selection
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    const fileInputRef = useRef<HTMLInputElement>(null);
    return (
        <Box sx={{ p: 4, bgcolor: "#f0f2f5", minHeight: "100vh", color: "#fff" }}>
            <Typography variant="h4"  color="black" fontWeight="bold" gutterBottom>
                My Profile
            </Typography>
            <Typography variant="body2" gutterBottom color="black">
                View or edit your profile details below.
            </Typography>

            <Grid container spacing={4} mt={2} alignItems="flex-start">
                {/* Left Section */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            border: "2px solid white",
                            borderRadius: 3,
                            bgcolor: "#1e2230",
                            textAlign: "center",
                        }}
                    >
                        {/* Avatar with Edit Button */}
                        <Box sx={{ position: "relative", width: 340, height: 340, mx: "auto", mb: 2 }}>
                            <Avatar
                                src={
                                    typeof formData?.profilePic === "string"
                                        ? formData.profilePic
                                        : formData?.profilePic
                                            ? URL.createObjectURL(formData.profilePic)
                                            : undefined
                                }
                                sx={{ width: 340, height: 340 }}
                            />
                            <IconButton
                                sx={{
                                    position: "absolute",
                                    bottom: 16,
                                    right: 16,
                                    backgroundColor: "#ffffffcc",
                                    '&:hover': { backgroundColor: "#ffffff" },
                                }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <EditIcon sx={{ color: "#000" }} />
                            </IconButton>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleImageChange}
                            />
                        </Box>

                        <Typography variant="h6" color="white">{`${formData?.firstName ?? ""} ${formData?.lastName ?? ""}`}</Typography>
                        <Divider sx={{ my: 2, bgcolor: "#444" }} />
                        <Typography variant="body2" color="#aaa">
                            {formData?.role}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Right Section */}
                <Grid size={{xs:12, md:8}}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 2,
                            border: "1px solid white",
                            borderRadius: 3,
                            bgcolor: "#1e2230",
                            height: "100%",       
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Typography variant="h6" color="white" gutterBottom>
                            Profile Details
                        </Typography>

                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                maxHeight: "60vh", 
                                pr: 1, 
                            }}
                        >
                            <Grid container color="white" spacing={2}>
                                {fields
                                    .filter((field) => !fileFieldNames.includes(field.name))
                                    .map((field) => (
                                        <Grid size={{xs:12, md:6}} key={field.name} mt={2}>
                                            <TextField
                                                name={field.name}
                                                label={field.label}
                                                value={
                                                    field.type === "date"
                                                        ? (formData as any)[field.name]?.slice(0, 10) || ""
                                                        : (formData as any)[field.name] || ""
                                                }
                                                onChange={handleChange}
                                                type={field.type ?? "text"}
                                                fullWidth
                                                sx={{
                                                    input: { color: "white" },
                                                    label: { color: "white" },
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": { borderColor: "white" },
                                                        "&:hover fieldset": { borderColor: "#90caf9" },
                                                        "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                                                    },
                                                }}
                                            />
                                        </Grid>
                                    ))}
                            </Grid>
                        </Box>

                        <Box mt={3} display="flex" justifyContent="flex-end">
                            <Button variant="contained" color="primary">
                                Save Changes
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MyProfile;
