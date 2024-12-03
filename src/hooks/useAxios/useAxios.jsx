import axios from "axios";

const axiosCommon = axios.create({
  baseURL: import.meta.env.BASE_URL,

});

const useAxios = () => {
  return axiosCommon;
};

export default useAxios;