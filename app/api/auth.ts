import axios from 'axios';

const API_URL = 'http://192.168.1.21:8080/api/auth/';

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}login/`, { username, password });
    return response.data.access; // Token de acceso
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error en el login:', error.response?.data);
    } else {
      console.error('Error en el login:', error);
    }
    return null;
  }
};
export const registerUser = async (username: string, password: string, nombre: string, genero: string, licencias: string, aviones:string) => {
    try {
      const response = await axios.post(`${API_URL}register/`, { username, password, nombre, genero, licencias, aviones });
      return response.data.access; 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error en el registro:', error.response?.data);
      } else {
        console.error('Error en el registro:', error);
      }
      return null;
    }
  };