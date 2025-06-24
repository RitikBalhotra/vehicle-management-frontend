import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';

interface APPTextFieldProps {
  type?: string;
  name?: string;
  value?: string | number;
  label?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  placeholder?: string;
  isreq?: boolean;
  options?: string[];
}


const APPTextField: React.FC<APPTextFieldProps> = ({ type, name, value, onChange, placeholder, isreq, options }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <TextField
      name={name}
      value={value}
      onChange={onChange}
      type={isPassword ? (showPassword ? 'text' : 'password') : type}
      InputProps={{
        endAdornment: isPassword && (
          <InputAdornment position="end">
            <IconButton onClick={toggleVisibility} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      placeholder={placeholder}
      required={isreq}
      fullWidth
      sx={{ marginBottom: 2 }}
      select={!!options}
    >
      {options && options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </TextField>
  );
};

export default APPTextField;
