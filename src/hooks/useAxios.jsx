import axios from "axios";

const axiosCommon = axios.create({
  baseURL: 'https://gold-server-pied.vercel.app',

});

const useAxios = () => {
  return axiosCommon;
};

export default useAxios;