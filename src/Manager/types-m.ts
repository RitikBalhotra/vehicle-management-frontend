
export interface Manager {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    mobile: string;
    dob: string;
    profilePic: null;
    role: 'manager' | '';
}

export type ManagerForm = Omit<Manager, "id">;
