export interface Driver {
    id:'',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    dob: '',
    role: '';
    [key : string]: string | number;
}

export type DriverForm = Omit<Driver, "id">;
