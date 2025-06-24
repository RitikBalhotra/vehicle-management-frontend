import axios from 'axios';
import StorageService from '../Service/StorageService';
import Spinnerservice from './SpinnerService';

// Make sure to define REACT_APP_API_URL in your .env file (e.g., REACT_APP_API_URL=http://localhost:5000)
const baseUrl = "https://vehicle-management-server-1-ly86.onrender.com/api"


interface ApiParams {
  url: string;
  payload?: any;
  header?: Record<string, string>;
}

// Register User
export const POSTAPI = async ({
  url,
  payload,
  token = null,
}: {
  url: string;
  payload: any;
  token?: string | null;
}) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  Spinnerservice.showSpinner();
  const response = await axios.post(`${baseUrl}${url}`, payload, {
    headers,
  });

  return response.data;
};


// login 
export const LOGINAPI = async ({ url, payload = {}, header = {} }: ApiParams) => {
  try {
    const response = await axios.post(`${baseUrl}${url}`, payload, {
      headers: { ...header, 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('LOGINAPI Error:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};



// get all users 
export const GETALLAPI = async ({ url, header = {} }: ApiParams) => {
  try {
    const response = await axios.get(`${baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
        ...header,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('GETALLAPI Error:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};



// Get by ID
export const GETBYID = async ({ url }: ApiParams) => {
  try {
    const response = await axios.get(`${baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('GET BY ID ERROR:', error);
    throw error;
  }
};

// find by email
export const FINDBYEMAIL = async ({ url }: ApiParams) => {
  try {
    const res = await axios.get(`${baseUrl}${url}`);
    console.log(res.data.user);
  } catch (err) {
    console.error("User not found or error occurred", err);
  }
};


// forget password
export const FORGOTPASSWORD = async ({ url, payload }: ApiParams) => {
  try {
    const res = await axios.post(`${baseUrl}${url}`, payload);
    return res.data;
  }
  catch (error) {
    console.error('Forget Error:', error);
    throw error;
  }
};


//Reset password
export const RESET = async ({ url, payload }: ApiParams) => {
  try {
    const res = await axios.post(`${baseUrl}${url}`, payload);
    return res.data;
  }
  catch (error) {
    console.error('Reset error', error);
    throw error;
  }
}


// Delete User
export const DELETE = async ({ url }: ApiParams) => {
  try {
    const response = await axios.delete(`${baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('DELETE ERROR:', error);
    throw error;
  }
};

//Change Password
export const CHANGEPASSWORD = async ({ url, payload }: ApiParams) => {
  try {
    const response = await axios.put(`${baseUrl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`
      }
    })
    return response.data;
  }
  catch (error: any) {
    throw new Error(error.response?.data.message || error.message)
  }
}


// Update API
export const UPDATEAPI = async ({ url, payload = {}, header = {} }: ApiParams) => {
  try {
    const response = await axios.put(`${baseUrl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
        'Content-Type': 'application/json',
        ...header,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('EDITAPI Error:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};




/////------------------------------vehicles routes----------------------------////////

// Add Vehicle
export const POSTVEHICLE = async ({ url, payload = {}, header = {} }: ApiParams) => {
  try {
    const response = await axios.post(`${baseUrl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
        ...header,
      },
    });
    return response.data;
  } catch (error) {
    console.error('POST VEHICLE ERROR:', error);
    throw error;
  }
};

// Get All Vehicles
export const GETALLVEHICLES = async ({ url, header = {} }: ApiParams) => {
  try {
    const response = await axios.get(`${baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
        ...header,
      },
    });
    return response.data;
  } catch (error) {
    console.error('GET ALL VEHICLES ERROR:', error);
    throw error;
  }
};

// get all drivers 
export const GETALLDRIVERS = async ({ url }: ApiParams) => {
  try {
    const response = await axios.get(`${baseUrl}${url}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch drivers:", error);
    return { success: false, message: "Error fetching drivers" };
  }
};


// Delete Vehicle
export const DELETEVEHICLE = async ({ url }: ApiParams) => {
  try {
    const response = await axios.delete(`${baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('DELETE VEHICLE ERROR:', error);
    throw error;
  }
};

// Update Vehicle
export const UPDATEVEHICLE = async ({ url, payload = {}, header = {} }: ApiParams) => {
  try {
    const response = await axios.put(`${baseUrl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
        ...header,
      },
    });
    return response.data;
  } catch (error) {
    console.error('UPDATE VEHICLE ERROR:', error);
    throw error;
  }
};

// assign vehicle 
export const ASSIGNVEHICLE = async ({ driverId, vehicleId, assignedBy, }: { driverId: string; vehicleId: string; assignedBy: string; }) => {
  console.log("driverid :" + driverId);
  console.log("vehicleid: " + vehicleId);
  console.log("assigned by: " + assignedBy);
  if (!driverId || !vehicleId || !assignedBy) {
    console.log("Missing required fields");
  }

  const response = await axios.put(`${baseUrl}/assign-vehicle/${driverId}`, {
    vehicleId,
    assignedBy,
  }, {
    withCredentials: true,
  });

  return response.data;
};

// get assign vehcile for driver 
export const GETASSIGNEDVEHICLE = async (userId: string) => {
  const response = await axios.get(`${baseUrl}/driver/assigned-vehicle/${userId}`, {
    withCredentials: true,
  });

  return response.data;
};



// // upload to chloudinary
// export const uploadToCloudinary = async (file: File) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('upload_preset', 'VMS-Data');
//   const cloudName = 'dfomjqmdg';
//   try {
//     const res = await axios.post(
//       `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//       formData
//     );
//     return res.data.secure_url;
//   } catch (error: any) {
//     console.error('Cloudinary Upload Error:', error);
//     throw new Error(error.response?.data?.message || error.message);
//   }
// };
