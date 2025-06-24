import React from 'react';
import { Box, InputLabel, MenuItem, TextField } from '@mui/material';
import AppTextField from './AppTextField';
import { roleFieldMap } from '../types/types'; 

type Props = {
  role: 'user' | 'manager' | 'driver' | 'vehicle';
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
};

const AppForm = ({ role, formData, setFormData }: Props) => {
  const fields = roleFieldMap[role] || [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, files } = e.target as any;

    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files.length === 1 ? files[0] : Array.from(files),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <Box mt={2}>
      {fields.map((field) => {
        // Label for every field
        const label = (
          <InputLabel sx={{ mb: 0.5, fontWeight: 600 }}>{field.label}</InputLabel>
        );

        // File Input
        if (field.type === 'file') {
          return (
            <Box key={field.name} mt={2}>
              {label}
              <input
                type="file"
                name={field.name}
                accept="image/*"
                multiple={field.name === 'vehiclePhotos'}
                onChange={handleChange}
              />
            </Box>
          );
        }

        // Select Dropdown (Vehicle Type / Status)
        if (field.name === 'vehicleType' || field.name === 'status') {
          const options =
            field.name === 'vehicleType' ? ['LTV', 'HTV'] : ['Active', 'Inactive'];

          return (
            <Box key={field.name} mt={2}>
              {label}
              <TextField
                select
                fullWidth
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
              >
                {options.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          );
        }

        // Default Input
        return (
          <Box key={field.name} mt={2}>
            {label}
            <AppTextField
              fullWidth
              name={field.name}
              type={field.type || 'text'}
              value={formData[field.name] || ''}
              onChange={handleChange}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default AppForm;
