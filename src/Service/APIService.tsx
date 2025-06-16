import axios from 'axios';
import StorageService from '../Service/StorageService';

const baseUrl = 'http://localhost:3020/api';

interface ApiParams {
  url: string;
  payload?: any;
  header?: Record<string, string>;
}

// Register User
export const POSTAPI = async ({ url, payload = {}, header = {} }: ApiParams) => {
  try {
    const formData = new FormData();

    for (const key in payload) {
      const value = payload[key];
      if (value === undefined || value === null) continue;

      if (key === "profileImage") {
        formData.append("profilePic", value); 
      } else if (key === "licenseFile") {
        formData.append("drivingLicense", value); 
      } else {
        formData.append(key, value);
      }
    }
    const response = await axios.post(`${baseUrl}${url}`, formData, {
      headers: {
        ...header,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error("POSTAPI Error:", error);
    throw new Error(error.response?.data?.message || error.message);
  }
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
