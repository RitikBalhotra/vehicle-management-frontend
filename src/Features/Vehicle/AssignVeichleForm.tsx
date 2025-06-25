import { useState } from 'react';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { ASSIGNVEHICLE } from '../../Service/APIService';
import type { Driver } from '../../Components/types/types';
import type { Vehicle } from './types-v';
import StorageService from '../../Service/StorageService';
import ToasterService from '../../Service/ToastService';

type Props = {
    drivers: Driver[];
    vehicles: Vehicle[];
    onSuccess: () => void;
};

const AssignVehicleForm = ({ drivers, vehicles, onSuccess }: Props) => {
    const [selectedDriver, setSelectedDriver] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [assigning, setAssigning] = useState(false);

    const currentUser = StorageService.getUser(); // for assignedBy

    const handleAssign = async () => {
        if (!selectedDriver || !selectedVehicle) {
            ToasterService.showtoast({message:"Kindly select both driver and vehicle", type:"info"})
            return;
        }
        

        setAssigning(true);
        try {
            await ASSIGNVEHICLE({
                driverId: selectedDriver,
                vehicleId: selectedVehicle,
                assignedBy: currentUser.id,
            });

            ToasterService.showtoast({message:"Vehicle assigned successfully", type:"success"})
            onSuccess();
        } catch (error) {
            ToasterService.showtoast({message:"Failed to assigned vehicle ", type:"error"});

        } finally {
            setAssigning(false);
        }
    };

    
    return (
        <Box sx={{p: 3, border: '1px solid #ccc', borderRadius: 2, maxWidth: 400 }}>
            <Typography variant="h6" gutterBottom>
                Assign Vehicle to Driver
            </Typography>

            {/* Driver Selection */}
            <TextField
                select
                label="Select Driver"
                fullWidth
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                sx={{ mb: 2 }}
            >
                {drivers.map((d) => (
                    <MenuItem key={d._id} value={d._id}>
                            {d.firstName} {d.lastName}
                    </MenuItem>
                ))}
            </TextField>

            {/* Vehicle Selection */}
            <TextField
                select
                label="Select Vehicle"
                fullWidth
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                sx={{ mb: 2 }}
            >
                {vehicles.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                        {v.vehicleName} ({v.vehicleModel})
                    </MenuItem>
                ))}
            </TextField>

            <Button
                variant="contained"
                onClick={handleAssign}
                disabled={assigning}
                fullWidth
            >
                {assigning ? 'Assigning...' : 'Assign Vehicle'}
            </Button>
        </Box>
    );
};

export default AssignVehicleForm;
