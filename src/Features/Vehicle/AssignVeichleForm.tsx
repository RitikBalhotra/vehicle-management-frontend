import React, { useState } from 'react';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { ASSIGNVEHICLE } from '../../Service/APIService';
import type { Driver } from '../../Driver/types-d';
import type { Vehicle } from './types-v';
import StorageService from '../../Service/StorageService';

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
            alert('Please select both driver and vehicle');
            return;
        }

        setAssigning(true);
        try {
            await ASSIGNVEHICLE({
                driverId: selectedDriver,
                vehicleId: selectedVehicle,
                assignedBy: currentUser.id,
            });

            alert('Vehicle assigned successfully');
            onSuccess();
        } catch (error) {
            console.error('Assignment failed:', error);
            alert('Failed to assign vehicle');
        } finally {
            setAssigning(false);
        }
    };

    const isPopulatedUser = (
        user: unknown
    ): user is { firstName: string; lastName: string } => {
        return (
            typeof user === 'object' &&
            user !== null &&
            'firstName' in user &&
            'lastName' in user
        );
    };

    return (
        <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, maxWidth: 400 }}>
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
                        {isPopulatedUser(d.userId)
                            ? `${d.userId.firstName} ${d.userId.lastName}`
                            : String(d.userId)}
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
                    <MenuItem key={v._id} value={v._id}>
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
