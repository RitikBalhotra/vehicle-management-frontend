export interface Driver {
    id:'',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    dob: '',
    role:  'driver';
    [key : string]: string | number;
}

export type DriverForm = Omit<Driver, "id">;
