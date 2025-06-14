export default class StorageService {
   static setToken = (token: string) => {
    localStorage.setItem('token', JSON.stringify(token));
  };
   static getToken = () => {
    const tok = localStorage.getItem('token');
    return tok ? JSON.parse(tok) : null;
  };

  static setUser = (user: unknown) => {
    localStorage.setItem('user', JSON.stringify(user));
  };

   static setVehicle = (vehicle: unknown) => {
    localStorage.setItem('vehicle', JSON.stringify(vehicle));
  };

  static getUser = () => {
    const dt = localStorage.getItem('user');
    return dt ? JSON.parse(dt) : null;  
  };

 static clear= () => localStorage.clear();
}
