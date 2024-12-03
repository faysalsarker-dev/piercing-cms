import axios from "axios";

const axiosCommon = axios.create({

    baseURL: import.meta.env.BASE_URL,
  withCredentials: true, 
});


axiosCommon.interceptors.request.use(
  (config) => {
    // No need to manually attach token since it's in cookies
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

axiosCommon.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  async (error) => {
    if (error.response) {
      // Handle specific error responses
      if (error.response.status === 401) {
        console.error("Unauthorized. Redirecting to login...");
        // Redirect to login page or clear user session
        window.location.href = "/login";
      } else if (error.response.status === 403) {
        console.error("Forbidden. Access denied.");
      }
    }
    return Promise.reject(error);
  }
);

const useAxiosSecure = () => {
  return axiosCommon;
};

export default useAxiosSecure;
