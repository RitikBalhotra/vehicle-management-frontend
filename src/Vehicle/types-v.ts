export interface Vehicle {
  id: string | number;
  vehicleName: string;
  vehicleModel: string;
  vehicleYear: string;
  type: string;
  chassiNumber: string;
  registrationNumber: string;
  vehicleDescription: string;
  status: string;
  [key: string]: string | number;
}

export type VehicleForm = Omit<Vehicle, "id">;
