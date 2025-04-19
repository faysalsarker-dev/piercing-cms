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









  
    <CardFooter className="flex-col items-start gap-2 text-sm">
    {/* Dynamic Messages */}
    <div className="flex gap-2 font-medium leading-none">
      {/* Calculate the percentage change dynamically */}
      {percentageChange > 0 ? (
        <>
          Trending up by {percentageChange.toFixed()}% this month <TrendingUp className="h-4 w-4" />
        </>
      ) : (
        <>
          Trending down by {Math.abs(percentageChange).toFixed()}% this month <TrendingDown className="h-4 w-4" />
        </>
      )}
    </div>

    {/* Dynamic message for highest revenue */}
    {highestMonth && highestRevenue && (
      <div className="flex gap-2 font-medium leading-none">
        Highest revenue in {highestMonth}: {highestRevenue} 
      </div>
    )}

    {/* Sales Description */}
    <div className="leading-none text-muted-foreground">
      Showing total revenue 
    </div>
  </CardFooter>
  

