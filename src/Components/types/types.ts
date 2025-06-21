import PeopleIcon from "@mui/icons-material/People";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import type { SvgIconComponent } from "@mui/icons-material";

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
  dob: string;
  role: "driver";
  address: string;
  experience: string;
  licenseExpiry: string;
  licenseFile: null | File | string;
  [key: string]: any;
}
export type DriverForm = Omit<Driver, "id">;

export interface Manager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
  dob: string;
  profilePic: null | File | string;
  role: "manager" | "";
  [key: string]: any;
}
export type ManagerForm = Omit<Manager, "id">;

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
  dob: string;
}
export type UserForm = Omit<User, "id">;

export interface Vehicle {
  type: "vehicle";
  id: string | number;
  vehicleName: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleType: string;
  chassiNumber: string;
  registrationNumber: string;
  vehicleDescription: string;
  status: string;
  vehiclePhotos?: (File | string)[];
}

export type VehicleForm = Omit<Vehicle, "id">;

// form fields for user to add users
interface AddUserFields<T> {
  name: keyof T | string;
  label: string;
  type?: string;
  placeholder?: string;
  options?: string[];
}

// Generic field config for forms
export interface FieldConfig<T> {
  name: keyof T | string;
  label: string;
  type?: string;
  options?: string[];
  placeholder?: string;
}

export const UserFields: AddUserFields<UserForm>[] = [
  { name: "firstName", label: "First Name", placeholder: "Enter First Name" },
  { name: "lastName", label: "Last Name", placeholder: "Enter Last Name" },
  { name: "email", label: "Email", placeholder: "Enter email" },
  { name: "mobile", label: "Mobile", placeholder: "Enter Mobile no" },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter password",
  },
  { name: "dob", label: "Date of Birth", type: "date" },
  {
    name: "role",
    label: "Select Role",
    type: "select",
    options: ["admin", "manager", "driver"],
  },
  {
    name: "experience",
    label: "Experience (yrs)",
    placeholder: "Experience in years",
  },
  { name: "address", label: "Address", placeholder: "Address" },
  { name: "licenseExpiry", label: "License Expiry", type: "date" },
  { name: "profilePic", label: "Upload Profile Image", type: "file" },
  { name: "licenseFile", label: "Upload License Image", type: "file" },
];

// field definitions
export const driverFields: FieldConfig<Driver>[] = [
  { name: "firstName", label: "First Name", type: "text" },
  { name: "lastName", label: "Last Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "mobile", label: "Mobile", type: "text" },
  { name: "dob", label: "DOB", type: "date" },
  { name: "profilePic", label: "Profile Image", type: "file" },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: ["driver", "manager", "admin"],
  },
  { name: "address", label: "Address", type: "text" },
  { name: "experience", label: "Experience", type: "text" },
  { name: "licenseExpiry", label: "License Expiry", type: "date" },
  { name: "licenseFile", label: "Driving License", type: "file" },
  
];

export const managerFields: FieldConfig<Manager>[] = [
  { name: "firstName", label: "First Name", type: "text" },
  { name: "lastName", label: "Last Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "mobile", label: "Mobile", type: "text" },
  { name: "dob", label: "DOB", type: "date" },
  { name: "password", label: "Password", type: "password" },
];

export const userFields: FieldConfig<User>[] = [
  { name: "firstName", label: "First Name", type: "text" },
  { name: "lastName", label: "Last Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "mobile", label: "Mobile", type: "text" },
  { name: "dob", label: "DOB", type: "date" },
  { name: "password", label: "Password", type: "password" },
];

// card data
interface CardDataItem {
  label: string;
  key: "users" | "managers" | "drivers" | "vehicles";
  icon: SvgIconComponent;
  bg: string;
  borderColor: string;
  roles: ("admin" | "manager" | "driver")[];
}

export const cardData: CardDataItem[] = [
  {
    label: "Total Users",
    key: "users",
    icon: PeopleIcon,
    bg: "#fce4ec",
    borderColor: "#8e24aa",
    roles: ["admin"],
  },
  {
    label: "Total Managers",
    key: "managers",
    icon: SupervisorAccountIcon,
    bg: "#e3f2fd",
    borderColor: "#1976d2",
    roles: ["admin"],
  },
  {
    label: "Total Drivers",
    key: "drivers",
    icon: LocalShippingIcon,
    bg: "#fff3e0",
    borderColor: "#fb8c00",
    roles: ["admin", "manager"],
  },
  {
    label: "Total Vehicles",
    key: "vehicles",
    icon: DirectionsCarIcon,
    bg: "#e8f5e9",
    borderColor: "#388e3c",
    roles: ["admin", "manager"],
  },
];

// table columns
export interface Column {
  name: string;
  label: string;
}

export const userColumns: Column[] = [
  { name: "profilePic", label: "Profile Pic" },
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
  { name: "email", label: "Email" },
  { name: "mobile", label: "Mobile" },
  { name: "role", label: "Role" },
  { name: "actions", label: "Actions" },
];

export const driverColumns: Column[] = [...userColumns];

export const vehicleColumns: Column[] = [
  { name: "vehicleName", label: "Vehicle Name" },
  { name: "vehicleModel", label: "Model" },
  { name: "vehicleYear", label: "Year" },
  { name: "type", label: "Vehicle Type" },
  { name: "chassiNumber", label: "Chassi Number" },
];
