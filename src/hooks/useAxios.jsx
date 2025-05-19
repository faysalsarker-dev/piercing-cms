import axios from "axios";

const axiosCommon = axios.create({
  // baseURL: 'http://localhost:5000',
  // baseURL: 'https://gold-server-pied.vercel.app',
  baseURL: import.meta.env.VITE_API,

});

const useAxios = () => {
  return axiosCommon;
};

export default useAxios;