import {TextField } from '@mui/material';
import React from 'react';

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
  return (
    <TextField
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      required={isreq}
      fullWidth
      sx={{marginBottom:2}}
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
