import axios from 'axios';

const API_URL = 'http://192.168.1.15:8080/api/auth/';

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
export const registerUser = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}register/`, { username, email, password });
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