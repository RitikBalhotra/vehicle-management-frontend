import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import LockResetIcon from '@mui/icons-material/LockReset';
import bgImage from "../images/changePassword.png"; // 🔄 Replace with your actual image path
import APPTextField from "../Components/UI/AppTextField";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = () => {
    console.log("Change Password Payload:", formData);
    // 🔐 Call API here to change the password
  };

  return (
    <Box sx={{ bgcolor: "#f0f2f5", minHeight: "100vh", py: 6 }}>
      <Grid container justifyContent="center">
        <Grid item xs={11} md={8}>
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 3,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
            {/* 📸 Left Image Section */}
            <Box flex={1} textAlign="center">
              <img
                src={bgImage}
                alt="Change Password Illustration"
                style={{ maxWidth: "100%", height: "auto", borderRadius: "10px" }}
              />
            </Box>

            {/* 🧾 Right Form Section */}
            <Box flex={1}>
              <Typography variant="h5" fontWeight="bold" mb={3}>
                <LockResetIcon sx={{ mr: 1 }} />
                Change Password
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                <APPTextField
                  label="Old Password"
                  name="oldPassword"
                  type="password"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  placeholder="Enter old password"
                  isreq={true}
                />
                <APPTextField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  isreq={true}
                />
              </Box>

              <Box mt={4} textAlign="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleChangePassword}
                  sx={{ px: 4, py: 1.5, fontWeight: "bold" }}
                >
                  Change Password
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChangePassword;
