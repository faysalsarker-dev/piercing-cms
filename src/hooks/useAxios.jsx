import axios from "axios";

const axiosCommon = axios.create({
  // baseURL: 'http://localhost:5000',
  // baseURL: 'https://gold-server-pied.vercel.app',
  baseURL: import.meta.env.VITE_BASE_URL,

});

const useAxios = () => {
  return axiosCommon;
};

export default useAxios;