import axios from 'axios';
import StorageService from '../Service/StorageService'; // Adjust the path if needed

const baseUrl = 'http://localhost:3020/api';

interface GetApiParams {
  url: string;
  header?: Record<string, string>;
  payload?: Record<string, string>;
}

// signup function
export const POSTAPI = ({ url, payload = {}, header = {} }: GetApiParams) => {
  return axios
    .post(baseUrl + url, payload, header)
    .then((res) => res.data)
    .catch((err) => console.log("POST API ERROR" + err));
};

// login function 
export const LOGINAPI = ({ url, payload = {}, header = {} }: GetApiParams) => {
  return axios
    .post(baseUrl + url, payload, header)
    .then((res) => res.data)
    .catch((err) => console.log(err));
};

// get all users
export const GETALLAPI = ({ url, header = {} }: GetApiParams) => {
  try {
    return axios.get(baseUrl + url, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
        ...header,
      },
    });
  } catch (error) {
    console.error('GETAPI Error:', error);
    throw error;
  }
}

// get by id
export const GETBYID = ({ url, }: GetApiParams) => {
  return axios
    .get(baseUrl + url, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
};

// Delete user by id 
export const DELETE = ({ url, }: GetApiParams) => {
  return axios
    .delete(baseUrl + url, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`
      }
    })
    .then((res) => res.data)
    .catch((err) => console.log(err))
}

// -------------------------vehicle routers------------------------------

// add vehicle
export const POSTVEHICLE = ({ url, payload = {}, header = {} }: GetApiParams) => {
  return axios
    .post(baseUrl + url, payload, header)
    .then((res) => res.data)
    .catch((err) => console.log("Post API Error" + err))
}

// get all vehicles
export const GETALLVEHICLES = ({ url, header = {} }: GetApiParams) => {
  try {
    return axios.get(baseUrl + url, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
        ...header,
      },
    })
  }
  catch (error) {
    console.log('Get all Vehicle: ' + error)
    throw error;
  }

}

// Delete user by id 
export const DELETEVEHICLE = ({ url, }: GetApiParams) => {
  return axios
    .delete(baseUrl + url, {
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`
      }
    })
    .then((res) => res.data)
    .catch((err) => console.log(err))
}