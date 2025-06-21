import React from 'react';
import { Button, type ButtonProps } from '@mui/material';

interface AppButtonProps {
  variant?: ButtonProps['variant'];
  color?: ButtonProps['color'];
  text: string;
  onClick: () => void;
  buttonIcon?: React.ReactNode;
}

const AppButton: React.FC<AppButtonProps> = ({
  variant = 'outlined',
  onClick,
  color = 'primary',
  text,
  buttonIcon
}) => {
  return (
    <Button onClick={onClick} variant={variant} color={color} startIcon={buttonIcon}>
      {text}
    </Button>
  );
};

export default AppButton;
