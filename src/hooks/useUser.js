import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";



export const useUser = (email) => {
    const axiosCommon = useAxios()
  return useQuery({
    queryKey: ['user', email],
    queryFn: async () => {
      if (!email) throw new Error("Email is required");
      const response = await axiosCommon.get(`/users/role/${email}`);
      return response.data;
    },
    enabled: !!email,
    staleTime: 1000 * 60 * 5 
  });
};
