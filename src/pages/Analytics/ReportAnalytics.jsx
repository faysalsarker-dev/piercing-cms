import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Box, ShoppingCart, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Label } from "recharts";



  // const chartData = [
  //   { monthName: "January", desktop: 186, mobile: 80 },
  //   { month: "February", desktop: 305, mobile: 200 },
  //   { month: "March", desktop: 237, mobile: 120 },
  //   { month: "April", desktop: 73, mobile: 190 },
  //   { month: "May", desktop: 209, mobile: 130 },
  //   { month: "June", desktop: 214, mobile: 140 },
  //   { month: "January", desktop: 186, mobile: 80 },
  //   { month: "February", desktop: 305, mobile: 200 },
  //   { month: "March", desktop: 237, mobile: 120 },
  //   { month: "April", desktop: 73, mobile: 190 },
  //   { month: "May", desktop: 209, mobile: 130 },
  //   { month: "June", desktop: 214, mobile: 140 },
  // ]
  






const chartConfig = {
  totalAddedStock: {
      label: "totalAddedStock",
      color: "hsl(var(--chart-1))",
    },
    totalSoldProduct: {
      label: "totalSoldProduct",
      color: "hsl(var(--chart-2))",
    },
  } 



  const chartDataPie = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 190, fill: "var(--color-other)" },
  ]
  const chartConfigPie = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  } 









export default function ReportAnalytics() {

const axiosSecure = useAxios()


const { data:chartData } = useQuery({
  queryKey: ["full-report"],
  queryFn: async () => {
    const response = await axiosSecure.get(`/reports/full-report`
    );
    
    return response.data;
  },
  staleTime: 1200000, 
  cacheTime: 3600000, 
});


const { data} = useQuery({
  queryKey: ["inventory-summary"],
  queryFn: async () => {
    const response = await axiosSecure.get(`/reports/inventory-summary`
    );
    
    return response.data;
  },
  staleTime: 1200000, 
  cacheTime: 3600000, 
});


const { data : categoriesSales} = useQuery({
  queryKey: ["categories-sales"],
  queryFn: async () => {
    const response = await axiosSecure.get(`/reports/categories-sales`
    );
    
    return response.data;
  },
  staleTime: 1200000, 
  cacheTime: 3600000, 
});


console.log(categoriesSales,"data");



 
  return (
    <div className="p-3 grid gap-6">
      {/* Yearly Stock vs Sales Report */}
   




    <Card>
      <CardHeader>
        <CardTitle>Stock & Seles</CardTitle>
        <CardDescription>January - December</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="monthName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="totalAddedStock" fill="var(--color-totalAddedStock)" radius={4} />
            <Bar dataKey="totalSoldProduct" fill="var(--color-totalSoldProduct)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
  {/* Conditional Message for Yearly Sales */}
  {data?.totalSalesCount > 500 && (
    <div className="flex gap-2 font-medium leading-none text-green-500">
      <TrendingUp className="h-4 w-4" />
      <span>Excellent sales performance this year! You&apos;ve exceeded your sales target.</span>
    </div>
  )}

  {data?.totalSalesCount <= 250 && data?.totalSalesCount > 500 && (
    <div className="flex gap-2 font-medium leading-none text-yellow-500">
      <ShoppingCart className="h-4 w-4" />
      <span>Good sales performance this year. Keep pushing to reach your sales goal.</span>
    </div>
  )}

  {data?.totalSalesCount <= 100 && (
    <div className="flex gap-2 font-medium leading-none text-red-500">
      <Box className="h-4 w-4" />
      <span>Sales are slower than expected. Consider reviewing your strategy for improvement.</span>
    </div>
  )}

</CardFooter>

    </Card>




      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Sales Count */}
        <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfigPie}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartDataPie}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {/* {totalVisitors.toLocaleString()} */}1234K
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Sales
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>

        {/* Total Earned Revenue */}
        <Card>
      <CardHeader>
        <CardTitle>Line Chart - Dots</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
      </div>

      {/* Weekly Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.totalSalesCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.totalStockCount}</p>
            <p className="text-xl font-bold">{data?.totalWeight} G</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold"><span className="font-extrabold">৳ </span>{data?.totalRevenue}</p>
          </CardContent>
        </Card>
      </div>


    </div>
  );
}
