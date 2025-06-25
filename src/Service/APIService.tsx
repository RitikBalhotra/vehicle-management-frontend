import axios from 'axios';
import StorageService from '../Service/StorageService';
import Spinnerservice from './SpinnerService';
import ToasterService from './ToastService';

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
  Spinnerservice.showSpinner();
    const response = await axios.post(`${baseUrl}${url}`, payload, {
      headers: { ...header, 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
  finally{
    Spinnerservice.hideSpinner();
  }
};



// get all users 
export const GETALLAPI = async ({ url, header = {} }: ApiParams) => {
  try {
  Spinnerservice.showSpinner();
    const response = await axios.get(`${baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
        ...header,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
  finally{
    Spinnerservice.hideSpinner();
  }
};



// Get by ID
export const GETBYID = async ({ url }: ApiParams) => {
  try {
    Spinnerservice.showSpinner();
    const response = await axios.get(`${baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
  finally{
    Spinnerservice.hideSpinner();
  }
};

// find by email
export const FINDBYEMAIL = async ({ url }: ApiParams) => {
  try {
    Spinnerservice.showSpinner();
    await axios.get(`${baseUrl}${url}`);
  } catch (err) {
    throw err;
  }
  finally{
    Spinnerservice.hideSpinner();
  }
};


// forget password
export const FORGOTPASSWORD = async ({ url, payload }: ApiParams) => {
  try {
    Spinnerservice.showSpinner();
    const res = await axios.post(`${baseUrl}${url}`, payload);
    return res.data;
  }
  catch (error) {
    throw error;
  }
  finally{
    Spinnerservice.hideSpinner();
  }
};


//Reset password
export const RESET = async ({ url, payload }: ApiParams) => {
  try {
    Spinnerservice.showSpinner();
    const res = await axios.post(`${baseUrl}${url}`, payload);
    return res.data;
  }
  catch (error) {
    throw error;
  }
  finally{
    Spinnerservice.hideSpinner();
  }
}


// Delete User
export const DELETE = async ({ url }: ApiParams) => {
  try {
    Spinnerservice.showSpinner();
    const response = await axios.delete(`${baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
  finally{
    Spinnerservice.hideSpinner();
  }
};

//Change Password
export const CHANGEPASSWORD = async ({ url, payload }: ApiParams) => {
  try {
    Spinnerservice.showSpinner();
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
  finally{
    Spinnerservice.hideSpinner();
  }
}


// Update API
export const UPDATEAPI = async ({ url, payload = {}, header = {} }: ApiParams) => {
  try {
    Spinnerservice.showSpinner();
    const response = await axios.put(`${baseUrl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
        'Content-Type': 'application/json',
        ...header,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
  finally{
    Spinnerservice.hideSpinner();
  }
};




/////------------------------------vehicles routes----------------------------////////

// Add Vehicle
export const POSTVEHICLE = async ({ url, payload = {}, header = {} }: ApiParams) => {
  try {
    Spinnerservice.showSpinner();
    const response = await axios.post(`${baseUrl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
        ...header,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
  finally{
    Spinnerservice.hideSpinner();
  }
};

// get single vehicle by id 
export const GETSINGLEAPI = async ({ url }: { url: string }) => {
  try {
    const token = StorageService.getToken(); // get auth token
    const res = await axios.get(`${baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err: any) {
    throw err?.response?.data || { message: "API Error" };
  }
  finally{
    Spinnerservice.hideSpinner();
  }
};

// Get All Vehicles
export const GETALLVEHICLES = async ({ url, header = {} }: ApiParams) => {
  try {
    Spinnerservice.showSpinner();
    const response = await axios.get(`${baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
        ...header,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
  finally{
    Spinnerservice.hideSpinner();
  }
};

// get all drivers 
export const GETALLDRIVERS = async ({ url }: ApiParams) => {
  try {
    Spinnerservice.showSpinner();
    const response = await axios.get(`${baseUrl}${url}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return { success: false, message: "Error fetching drivers" };
  }
  finally{
    Spinnerservice.hideSpinner();
  }
};


// Delete Vehicle
export const DELETEVEHICLE = async ({ url }: ApiParams) => {
  try {
    Spinnerservice.showSpinner();
    const response = await axios.delete(`${baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
  finally{
    Spinnerservice.hideSpinner();
  }
};

// Update Vehicle
export const UPDATEVEHICLE = async ({ url, payload = {}, header = {} }: ApiParams) => {
  try {
    Spinnerservice.showSpinner();
    const response = await axios.put(`${baseUrl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
        ...header,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
  finally{
    Spinnerservice.hideSpinner();
  }
};

// assign vehicle 
export const ASSIGNVEHICLE = async ({ driverId, vehicleId, assignedBy, }: { driverId: string; vehicleId: string; assignedBy: string; }) => {
  if (!driverId || !vehicleId || !assignedBy) {
    ToasterService.showtoast({message:"Missing required Fields", type:"info"})
  }

  Spinnerservice.showSpinner();
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
  Spinnerservice.showSpinner();
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
