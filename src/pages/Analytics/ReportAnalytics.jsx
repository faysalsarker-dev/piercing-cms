import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Box, ShoppingCart, TrendingDown, TrendingUp } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis,  CartesianGrid, Label, Cell } from "recharts";










const chartConfig = {
  totalAddedStock: {
    label: "Stock",
    color: "hsl(210, 100%, 56%)", // সমৃদ্ধ নীল
  },
  totalSoldProduct: {
    label: "Sold",
    color: "hsl(120, 45%, 53%)", // ঠান্ডা টিয়াল
  },

};



const categoryColors = [
  "hsl(210, 100%, 56%)", // সমৃদ্ধ নীল
  "hsl(200, 80%, 50%)", // ঠান্ডা টিয়াল
  "hsl(45, 90%, 60%)",  // উজ্জ্বল সোনালি হলুদ
  "hsl(335, 85%, 45%)", // গা dark ় রক্তচোখি লাল
  "hsl(120, 45%, 53%)", // কোমল সবুজ
];






export default function ReportAnalytics() {

const axiosSecure = useAxios()

const { data: chartData, isLoading: isChartLoading, isError: isChartError } = useQuery({
  queryKey: ["full-report"],
  queryFn: async () => {
    const response = await axiosSecure.get(`/reports/full-report`);
    return response.data;
  },
  staleTime: 1200000,
  cacheTime: 3600000,
});



const { data, isLoading: isInventoryLoading} = useQuery({
  queryKey: ["inventory-summary"],
  queryFn: async () => {
    const response = await axiosSecure.get(`/reports/inventory-summary`);
    return response.data;
  },
  staleTime: 1200000,
  cacheTime: 3600000,
});



const { data: categoriesSales, isLoading: isCategoryLoading, isError: isCategoryError } = useQuery({
  queryKey: ["categories-sales"],
  queryFn: async () => {
    const response = await axiosSecure.get(`/reports/categories-sales`);
    return response.data;
  },
  staleTime: 1200000,
  cacheTime: 3600000,
});



const chartConfigPie = categoriesSales?.salesByCategory?.reduce((acc, item, idx) => {
  acc[item.categoryName] = {
    label: item.categoryName,
    color: categoryColors[idx % categoryColors.length], // cycle through colors
  };
  return acc;
}, {}) || {};





// Calculate percentage change from the last month to this month (for example, from May to June)
const latestMonthSales = categoriesSales?.monthlySales[categoriesSales?.monthlySales?.length - 1]?.totalRevenue;
const previousMonthSales = categoriesSales?.monthlySales[categoriesSales?.monthlySales?.length - 2]?.totalRevenue;
const percentageChange = ((latestMonthSales - previousMonthSales) / previousMonthSales) * 100;

// Find the highest revenue month dynamically
const highestMonthData = categoriesSales?.monthlySales?.reduce((prev, current) => (prev.totalRevenue > current.totalRevenue ? prev : current), {});
const highestMonth = highestMonthData?.month;
const highestRevenue = highestMonthData?.totalRevenue;

const totalSales = categoriesSales?.salesByCategory?.reduce(
  (sum, item) => sum + item.totalSalesCount,
  0
);

const totalAddedStock = chartData?.reduce((sum, item) => sum + item.totalAddedStock, 0);
const totalSoldProduct = chartData?.reduce((sum, item) => sum + item.totalSoldProduct, 0);

  return (
    <div className="p-3 grid gap-6">
      {/* Yearly Stock vs Sales Report */}
   




      <Card>
  <CardHeader>
    <CardTitle>Stock & Sales</CardTitle>
    <CardDescription>January - December</CardDescription>
  </CardHeader>
  <CardContent>
    {isChartLoading ? (
      <p className="text-sm text-muted-foreground">Loading chart...</p>
    ) : isChartError ? (
      <p className="text-sm text-red-500">Failed to load chart data.</p>
    ) : (
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
    )}
  </CardContent>

  <CardFooter className="flex-col items-start gap-2 text-sm">
  {/* Calculate the total of totalAddedStock */}
  
  {/* Conditional Message for Yearly Sales */}
  {totalAddedStock > 500 && (
    <div className="flex gap-2 font-medium leading-none text-green-500">
      <TrendingUp className="h-4 w-4" />
      <span>Excellent sales performance this year! You&apos;ve exceeded your sales target.</span>
    </div>
  )}

  {/* Calculate the total of totalSoldProduct */}

  {totalSoldProduct <= 250 && totalSoldProduct > 500 && (
    <div className="flex gap-2 font-medium leading-none text-yellow-500">
      <ShoppingCart className="h-4 w-4" />
      <span>Good sales performance this year. Keep pushing to reach your sales goal.</span>
    </div>
  )}

  {/* Conditional Message for slower sales */}
  {chartData?.some(item => item.totalSalesCount <= 100) && (
    <div className="flex gap-2 font-medium leading-none text-red-500">
      <Box className="h-4 w-4" />
      <span>Sales are slower than expected. Consider reviewing your strategy for improvement.</span>
    </div>
  )}
</CardFooter>

    </Card>








      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
      <CardHeader className="items-center pb-0">
  <CardTitle>Category-wise Sales Overview</CardTitle>
  <CardDescription>Analyze with categories </CardDescription>
</CardHeader>

      </CardHeader>
      <CardContent className="flex-1 pb-0">
  {isCategoryLoading ? (
    <p className="text-sm text-muted-foreground">Loading pie chart...</p>
  ) : isCategoryError ? (
    <p className="text-sm text-red-500">Failed to load category sales data.</p>
  ) : (
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
          data={categoriesSales?.salesByCategory}
          dataKey="totalSalesCount"
          nameKey="categoryName"
          innerRadius={60}
          strokeWidth={5}
        >
          {categoriesSales?.salesByCategory?.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={chartConfigPie?.[entry?.categoryName]?.color || "#8884d8"}
            />
          ))}
         
         
  {categoriesSales?.salesByCategory?.map((entry, index) => (
    <Cell
      key={index}
      fill={chartConfigPie?.[entry?.categoryName]?.color || "#8884d8"}
    />
  ))}
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
              {totalSales}
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
  )}
</CardContent>


<CardFooter className="flex-col gap-2 text-sm">


  {/* Most & Least Sold Categories */}
  {categoriesSales?.salesByCategory?.length > 0 && (() => {
    const sorted = [...categoriesSales.salesByCategory].sort(
      (a, b) => b.totalSalesCount - a.totalSalesCount
    );
    const most = sorted[0];
    const least = sorted[sorted.length - 1];

    return (
      <>
        <div className="flex items-center gap-2 text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-green-500" />
          Most sold category:{" "}
          <span className="font-semibold text-foreground">
            {most.categoryName} ({most.totalSalesCount} sales)
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <TrendingDown className="h-4 w-4 text-red-500" />
          Least sold category:{" "}
          <span className="font-semibold text-foreground">
            {least.categoryName} ({least.totalSalesCount} sales)
          </span>
        </div>
      </>
    );
  })()}
</CardFooter>

    </Card>





        {/* Total Earned Revenue */}
 
        <Card>
  <CardHeader>
    <CardTitle>Monthly Sales Revenue</CardTitle>
    <CardDescription>Your Total Sales Renenue</CardDescription>
  </CardHeader>
  <CardContent>
  {isCategoryLoading ? (
    <p className="text-sm text-muted-foreground">Loading revenue chart...</p>
  ) : isCategoryError ? (
    <p className="text-sm text-red-500">Unable to fetch revenue data.</p>
  ) : (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={categoriesSales?.monthlySales}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => String(value).slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey="totalRevenue"
          type="monotone"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          dot={{ fill: "var(--color-revenue)" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  )}
</CardContent>

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
</Card>









      </div>

      {
          isInventoryLoading ? (
            <p className="text-sm text-muted-foreground">Loading inventory summary...</p>
          ):(
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
                <div className="mt-2">
                  <p className="text-xl font-semibold text-muted-foreground">Total Weight: <span className="font-bold text-green-500">{data?.totalWeight} G</span></p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  <span className="font-extrabold">৳ </span>{data?.totalRevenue}
                </p>
              </CardContent>
            </Card>
          </div>
          

          )
        }
 


    </div>
  );
}
