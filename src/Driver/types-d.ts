export interface Driver {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    mobile: string;
    dob: string
    role:  'driver';
    address:string;
    experience:string;
    licenseExpiry:string;
    licenseFile: null | File | string;
    [key : string]: any;
}

export type DriverForm = Omit<Driver, "id">;



