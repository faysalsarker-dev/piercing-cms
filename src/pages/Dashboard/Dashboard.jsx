import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, ShoppingCart, Box, DollarSign, ListOrdered, Sparkles, Package } from "lucide-react";
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
import { useState } from "react";

export default function Dashboard() {

  const axiosSecure = useAxios();


  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; 

  const [year] = useState(currentYear);
  const [month] = useState(currentMonth);

  const { data, isLoading, error } = useQuery({
    queryKey: ["price", year, month],
    queryFn: async () => {
      const response = await axiosSecure.get(`/reports/monthly-stock?year=${year}&month=${month}`);
      return response.data;
    },
    staleTime: 1200000,
    cacheTime: 3600000,
  });


  if (error) {
    return <div>Error fetching data</div>;
  }

  const chartConfig = {
    addedStockCount: { label: "Stock", color: "hsl(var(--chart-1))" },
    soldProductCount: { label: "Sales", color: "hsl(var(--chart-2))" },
    addedOrderCount: { label: "Orders", color: "hsl(var(--chart-3))" },
    completedOrderCount: { label: "Order Completed", color: "hsl(var(--chart-4))" },
  };


  


  return (
    <div className="p-6 grid gap-6">
 
  

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Monthly Sales */}
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="flex flex-col items-start gap-2">
      <div className="flex items-center text-primary">
        <ShoppingCart className="w-6 h-6 mr-2" />
        <CardTitle className="text-lg font-semibold">Monthly Sales</CardTitle>
      </div>
      <p className="text-sm text-muted-foreground">Total items sold this month</p>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold text-foreground">
        {data?.totalSoldProductCount ?? 0}
      </p>
    </CardContent>
  </Card>

  {/* Monthly Stock */}
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="flex flex-col items-start gap-2">
      <div className="flex items-center text-blue-500">
        <Box className="w-6 h-6 mr-2" />
        <CardTitle className="text-lg font-semibold">Stock Added</CardTitle>
      </div>
      <p className="text-sm text-muted-foreground">New stock added this month</p>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold text-foreground">
        {data?.totalAddedStockCount ?? 0}
      </p>
    </CardContent>
  </Card>

  {/* Monthly Orders */}
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="flex flex-col items-start gap-2">
      <div className="flex items-center text-green-600">
        <ListOrdered className="w-6 h-6 mr-2" />
        <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
      </div>
      <p className="text-sm text-muted-foreground">Orders received and completed</p>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col space-y-1">
        <span className="text-lg font-medium text-muted-foreground">
          Total Orders: <span className="text-xl font-bold text-foreground">{data?.totalAddedOrderCount ?? 0}</span>
        </span>
        <span className="text-lg font-medium text-muted-foreground">
          Completed: <span className="text-xl font-bold text-green-700">{data?.totalCompletedOrderCount ?? 0}</span>
        </span>
      </div>
    </CardContent>
  </Card>

  {/* Monthly Revenue */}
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="flex flex-col items-start gap-2">
      <div className="flex items-center text-yellow-500">
        <DollarSign className="w-6 h-6 mr-2" />
        <CardTitle className="text-lg font-semibold">Revenue</CardTitle>
      </div>
      <p className="text-sm text-muted-foreground">Total earnings this month</p>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold text-foreground">
        <span className="font-extrabold">৳</span> {data?.totalRevenue ?? 0}
      </p>
    </CardContent>
  </Card>
</div>


      {/* Chart */}
{
  isLoading ? (

    <div className="flex items-center justify-center h-full p-4 text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2">Loading...</span></div>
  ) : error ? (
    <div className="flex items-center justify-center h-full p-4 text-red-500">
      <span>Error loading data</span>
    </div>
  ):(

    <Card>
    <CardHeader>
      <CardTitle>Stock & Sales</CardTitle>
      <CardDescription>{`${new Date(year, month - 1).toLocaleString("default", { month: "long" })} ${year}`}</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={data?.weeklyChartData || []}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="week"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => String(value).slice(0, 3)}              />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
          <Bar dataKey="addedStockCount" fill="var(--color-addedStockCount)" radius={4} />
          <Bar dataKey="soldProductCount" fill="var(--color-soldProductCount)" radius={4} />
          <Bar dataKey="addedOrderCount" fill="var(--color-addedOrderCount)" radius={4} />
          <Bar dataKey="completedOrderCount" fill="var(--color-completedOrderCount)" radius={4} />
        </BarChart>
      </ChartContainer>
    </CardContent>
    <CardFooter className="flex-col items-start gap-2 text-sm">
  {/* Excellent performance */}
  {data?.totalSoldProductCount > 10 && data?.totalRevenue > 10000 && (
    <div className="flex gap-2 font-medium leading-none text-green-500">
      <TrendingUp className="h-4 w-4" />
      <span>
        🔥 Excellent month! Sales and revenue are booming. Keep pushing those top products!
      </span>
    </div>
  )}

  {/* Good sales but room to grow */}
  {data?.totalSoldProductCount <= 10 && data?.totalSoldProductCount > 5 && (
    <div className="flex gap-2 font-medium leading-none text-yellow-500">
      <ShoppingCart className="h-4 w-4" />
      <span>
        👍 Sales are steady. Consider optimizing your high-performing items to grow further.
      </span>
    </div>
  )}

  {/* Low sales warning */}
  {data?.totalSoldProductCount <= 5 && (
    <div className="flex gap-2 font-medium leading-none text-red-500">
      <Box className="h-4 w-4" />
      <span>
        ⚠️ Sales are slower than usual. Try promotions or ads to drive engagement.
      </span>
    </div>
  )}

  {/* Bonus tip based on order volume */}
  {data?.totalCompletedOrderCount > 15 && (
    <div className="flex gap-2 font-medium leading-none text-blue-500">
      <Sparkles className="h-4 w-4" />
      <span>
        🎯 Orders are flowing in! Don’t forget to maintain great delivery speed and service.
      </span>
    </div>
  )}

  {/* Stock refill encouragement */}
  {data?.totalAddedStockCount < 5 && (
    <div className="flex gap-2 font-medium leading-none text-purple-500">
      <Package className="h-4 w-4" />
      <span>
        📦 Low stock updates this month—add more products to stay competitive!
      </span>
    </div>
  )}
</CardFooter>


  </Card>
  )
}




    

   
    </div>
  );
}
