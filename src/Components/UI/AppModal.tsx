import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    type DialogProps,
} from '@mui/material';
import {type ReactNode } from 'react';

interface AppModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title: string;
    onOkClick: () => void;
    size?: DialogProps['maxWidth']; // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const APPModal: React.FC<AppModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
    onOkClick,
    size = 'lg',
}) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth={size}
            sx={{justifyContent:"center", alignItems:"center"}}
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button onClick={onOkClick} autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default APPModal;
