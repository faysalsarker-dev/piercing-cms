import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, ShoppingCart, Box, DollarSign } from "lucide-react";
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
  };



  const totalAddedStock = data?.weeklyReports.reduce((total, item) => total + item.addedStockCount, 0);
  const totalAddedSales = data?.weeklyReports.reduce((total, item) => total + item.soldProductCount, 0);



  return (
    <div className="p-6 grid gap-6">
 
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle><ShoppingCart className="inline-block mr-2" /> This Month Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalAddedStock}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle><Box className="inline-block mr-2" /> This Month Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalAddedSales}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle><DollarSign className="inline-block mr-2" /> This Month Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold"><span className="font-extrabold">৳ </span>{data?.totalSalesAmount}</p>
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
        <BarChart accessibilityLayer data={data?.weeklyReports || []}>
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
        </BarChart>
      </ChartContainer>
    </CardContent>
    <CardFooter className="flex-col items-start gap-2 text-sm">
{/* Conditional Messages */}
{data?.totalSalesQuantity > 10 && (
<div className="flex gap-2 font-medium leading-none text-green-500">
  <TrendingUp className="h-4 w-4" />
  <span>Excellent sales performance! Keep up the great work to surpass your targets.</span>
</div>
)}

{data?.totalSalesQuantity <= 10 && data?.totalSalesQuantity > 5 && (
<div className="flex gap-2 font-medium leading-none text-yellow-500">
  <ShoppingCart className="h-4 w-4" />
  <span>Sales are on track! Focus on boosting your top-selling products to achieve your goal.</span>
</div>
)}

{data?.totalSalesQuantity <= 5 && (
<div className="flex gap-2 font-medium leading-none text-red-500">
  <Box className="h-4 w-4" />
  <span>Sales could be better this month. Consider running a promotion to increase sales.</span>
</div>
)}
</CardFooter>

  </Card>
  )
}




    

   
    </div>
  );
}
