
export interface Manager {
    id:'',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    dob: '',
    role: ''
}

export type ManagerForm = Omit<Manager, "id">;
