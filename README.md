# React + Vite

  const { data } = useQuery({
      queryKey: ["price"],
      queryFn: async () => {
        const response = await axiosCommon.get("/price"
        );
        
        return response.data;
      },
      staleTime: 1200000, 
      cacheTime: 3600000, 
    });


  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosCommon.post(`/online-booking`, info);
      
      return data; // assuming server returns saved booking object with _id etc.
    },
    onSuccess: (data) => {
      toast.success("Booking confirmed successfully.");

     
  
      reset();
      refetch(); 
    },
    onError: () => {
      toast.error("An error occurred while submitting your request.");
    },
  });