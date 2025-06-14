import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { GETALLAPI } from "../Service/APIService";
import { Box, Paper, Typography } from "@mui/material";
// import AppButton from "../Components/UI/AppButton";
import AppTable from "../Components/UI/Apptable";
import AppButton from "../Components/UI/AppButton";
import APPModal from "../Components/UI/AppModal";
import AddManager from "./AddManager";
import type { Manager, ManagerForm } from "./types-m"

const defaultForm: ManagerForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    dob: '',
    role: ''
}
const Managers = () => {
    const [managers, setManagers] = useState<Manager[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<ManagerForm>(defaultForm);



    const column = [
        { name: 'firstName', label: 'First Name' },
        { name: 'lastName', label: 'Last Name' },
        { name: 'email', label: 'Email' },
        { name: 'mobile', label: 'Mobile' },
        { name: 'dob', label: 'Date of Birth' },
        { name: 'role', label: 'Role' },
    ];
    const fetchUsers = async () => {

        
        try {
            await GETALLAPI({ url: "/list" })
                .then((res) => {
                    // const dummy = res.data;
                    if (Array.isArray(res.data)) {
                        const managersList = res.data.filter((user: Manager) => user.role == "manager"); // Case-sensitive
                        setManagers(managersList);
                        console.log("Managers:", managersList);
                    } else {
                        console.error("Expected an array but got:", res.data);
                    }
                })
        } catch {
            alert("Access denied. Only admin can view users.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const saveData = () => {

    }
    return (
        <Box>
            <Box sx={{ mb: 2 }}>
                <Paper elevation={3} sx={{ width: 250, p: 3, borderRadius: 3, textAlign: "center" }}>
                    <Typography variant="h6" mb={1}>
                        Total Managers
                    </Typography>
                    <AppButton text="Add Manager" onClick={() => setOpen(true)} />
                </Paper>
            </Box>

            <Box>
                <APPModal isOpen={open} onClose={() => setOpen(false)} title="Add User" onOkClick={saveData}>
                    <AddManager value={formData} setValue={setFormData} />
                </APPModal>


                <Paper sx={{ p: 2 }}>
                    <AppTable
                        rowData={managers.map((m, idx) => ({
                            ...m,
                            id: m.id ?? idx
                        }))}
                        headerColumn={column}
                        title="Vehicle List"
                        headerActions={[]}
                    />
                </Paper>
                <Outlet />
            </Box>
        </Box>
    )

}

export default Managers;