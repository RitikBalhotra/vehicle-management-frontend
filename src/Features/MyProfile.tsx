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
import { useRef } from "react";
import ToasterService from "../Service/ToastService";
import { GETBYID, UPDATEAPI } from "../Service/APIService";
import { driverFields, managerFields } from "../Components/types/types"
import type { DriverForm, ManagerForm, } from "../Components/types/types";
import { useNavigate } from "react-router-dom";





const MyProfile = () => {
    const [fields, setFields] = useState<Array<{ name: string; label: string; type?: string }>>([]);
    const [formData, setFormData] = useState<Partial<ManagerForm | DriverForm>>({});
    const [id, setId] = useState('')

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
            setId(user.id);
            const res = await GETBYID({ url: `/user/${user.id}` });
            setFormData(res);
            if (res.role == "manger" || res.role == "admin") {
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
    }, [formData]);
    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSave = async () => {

        try {
            await UPDATEAPI({ url: `/update/${id}`, payload: formData, header: { "Content-Type": "multipart/form-data" } })
            fetchUser();
            setId("");
            ToasterService.showtoast({ message: "update infomation successfullly!", type: "success" })
        }
        catch (err) {
            ToasterService.showtoast({ message: `${err}`, type: "error" })
        }

    }

    const handleImageChange = (e: any) => {
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
        <Box sx={{ p: 4, bgcolor: "white", minHeight: "100vh", color: "#fff" }}>
            <Typography variant="h4" color="black" fontWeight="bold" gutterBottom>
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
                            bgcolor: "#e3e5e1",
                            textAlign: "center",
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                maxWidth: 300, // ⬅️ you can reduce or increase this
                                mx: "auto",
                                mb: 2,
                                aspectRatio: "1", // ✅ Keep it square for a perfect circle
                            }}
                        >
                            <Avatar
                                src={
                                    typeof formData?.profilePic === "string"
                                        ? formData.profilePic
                                        : formData?.profilePic
                                            ? URL.createObjectURL(formData.profilePic)
                                            : undefined
                                }
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />

                            {/* Edit Button */}
                            <IconButton
                                sx={{
                                    position: "absolute",
                                    bottom: 16,
                                    right: 16,
                                    backgroundColor: "#ffffff",
                                    '&:hover': { backgroundColor: "red" },
                                }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <EditIcon sx={{ color: "#000" }} />
                            </IconButton>

                            {/* Hidden File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleImageChange}
                            />
                        </Box>
                        <Typography variant="h4" fontFamily={"initial"} color="black">{`${formData?.firstName ?? ""} ${formData?.lastName ?? ""}`}</Typography>
                        <Divider sx={{ my: 2, bgcolor: "#444" }} />
                        <Typography variant="body1" color="red">
                            {formData?.role}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Right Section */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 2,
                            border: "1px solid white",
                            borderRadius: 3,
                            bgcolor: "#e3e5e1",
                            height: "64vh", // ✅ Fixed height
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Typography variant="h6" color="black" gutterBottom>
                            Profile Details
                        </Typography>

                        {/* Scrollable Inner Area */}
                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                pr: 1,
                            }}
                        >
                            <Grid container spacing={2}>
                                {fields
                                    .filter((field) => !fileFieldNames.includes(field.name))
                                    .map((field) => (
                                        <Grid size={{ xs: 12, md: 6 }} key={field.name} mt={2}>
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
                                                    input: { color: "black" },
                                                    label: { color: "black" },
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": { borderColor: "black" },
                                                        "&:hover fieldset": { borderColor: "#90caf9" },
                                                        "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                                                    },
                                                }}
                                            />
                                        </Grid>
                                    ))}
                            </Grid>
                        </Box>

                        {/* Button - fixed at bottom */}
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant="contained" color="primary" onClick={handleSave}>
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
