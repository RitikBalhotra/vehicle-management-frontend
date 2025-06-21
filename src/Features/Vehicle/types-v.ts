export interface Vehicle {
  type:"vehicle",
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
