import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Boxes,
  DollarSign,
  PackageCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Label,
  Cell,
} from "recharts";

const chartConfig = {
  totalAddedStock: {
    label: "Stock",
    color: "hsl(var(--chart-1))",
  },
  totalSoldProduct: {
    label: "Sold",
    color: "hsl(var(--chart-2))",
  },
  totalAddedOrder: {
    label: "Orders",
    color: "hsl(var(--chart-3))",
  },
  totalCompletedOrder: {
    label: "Orders Completed",
    color: "hsl(var(--chart-4))",
  },
};



const chartConfigRevenue = {
  totalRevenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
dot :{
  color: "hsl(var(--chart-4))",
}

};




const categoryColors = [
  "hsl(var(--chart-1))", 
  "hsl(var(--chart-2))", 
  "hsl(var(--chart-3))", 
  "hsl(var(--chart-4))", 
  "hsl(var(--chart-5))",  
  "hsl(var(--chart-6))",  
  "hsl(var(--chart-7))",  
  "hsl(var(--chart-8))",  
   

];

export default function ReportAnalytics() {
  const axiosSecure = useAxios();

  const {
    data: chartData,
    isLoading: isChartLoading,
    isError: isChartError,
  } = useQuery({
    queryKey: ["full-report"],
    queryFn: async () => {
      const response = await axiosSecure.get(`/reports/full-report`);
      return response.data;
    },
    staleTime: 1200000,
    cacheTime: 3600000,
  });

  const {
    data,
    isLoading: isInventoryLoading,
    isError: isInventoryError,
  } = useQuery({
    queryKey: ["inventory-summary"],
    queryFn: async () => {
      const response = await axiosSecure.get(`/reports/inventory-summary`);
      return response.data;
    },
    staleTime: 1200000,
    cacheTime: 3600000,
  });

  const {
    data: categoriesSales,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useQuery({
    queryKey: ["categories-sales"],
    queryFn: async () => {
      const response = await axiosSecure.get(`/reports/categories-sales`);
      return response.data;
    },
    staleTime: 1200000,
    cacheTime: 3600000,
  });




  const chartConfigPie =
    categoriesSales?.pieChartData?.reduce((acc, item, idx) => {
      acc[item.category] = {
        label: item.category,
        color: categoryColors[idx % categoryColors.length], 
      };
      return acc;
    }, {}) || {};




  const formatCurrencyShort = (num) => {
    if (num >= 1e7) return `৳ ${(num / 1e7).toFixed(1)}Cr`; 
    if (num >= 1e5) return `৳ ${(num / 1e5).toFixed(1)}L`; 
    if (num >= 1e3) return `৳ ${(num / 1e3).toFixed(1)}K`; 
    return `৳ ${num?.toLocaleString()}`;
  };


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
              <BarChart accessibilityLayer data={chartData?.monthlyReport}>
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
                <Bar
                  dataKey="totalAddedStock"
                  fill="var(--color-totalAddedStock)"
                  radius={4}
                />
                <Bar
                  dataKey="totalSoldProduct"
                  fill="var(--color-totalSoldProduct)"
                  radius={4}
                />
                <Bar
                  dataKey="totalAddedOrder"
                  fill="var(--color-totalAddedOrder)"
                  radius={4}
                />
                <Bar
                  dataKey="totalCompletedOrder"
                  fill="var(--color-totalCompletedOrder)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 text-sm">
          {console.log("Chart Data:", chartData?.totals?.totalAddedOrderNumber)}
          {/* Message for Low Stock */}
          {chartData?.totals?.totalAddedStockNumber < 100 && (
            <div className="flex gap-2 font-medium leading-none text-red-500">
              <Box className="h-4 w-4" />
              <span>
                Your stock is running low. Consider restocking to avoid
                shortages.
              </span>
            </div>
          )}

          {/* Message for Low Sales */}
          {chartData?.totals?.totalSoldProductNumber < 100 && (
            <div className="flex gap-2 font-medium leading-none text-yellow-500">
              <ShoppingCart className="h-4 w-4" />
              <span>
                Sales have been slower than expected. Consider revising your
                marketing strategy.
              </span>
            </div>
          )}

          {/* Message for Good Stock Level */}
          {chartData?.totals?.totalAddedOrderNumber >= 100 &&
            chartData?.totals?.totalAddedStock <= 500 && (
              <div className="flex gap-2 font-medium leading-none text-yellow-500">
                <ShoppingCart className="h-4 w-4" />
                <span>
                  Stock levels are good, but keep an eye on it to avoid running
                  out.
                </span>
              </div>
            )}

          {/* Message for Excellent Sales */}
          {chartData?.totals?.totalSoldProductNumber > 500 && (
            <div className="flex gap-2 font-medium leading-none text-green-500">
              <TrendingUp className="h-4 w-4" />
              <span>
                Excellent sales performance! You&apos;re exceeding expectations.
              </span>
            </div>
          )}

          {/* Message for Low Orders */}
          {chartData?.totals?.totalAddedOrderNumber < 50 && (
            <div className="flex gap-2 font-medium leading-none text-red-500">
              <Box className="h-4 w-4" />
              <span>
                Your orders are lower than expected. Review your strategies to
                increase conversions.
              </span>
            </div>
          )}

          {/* Message for High Completed Orders */}
          {chartData?.totals?.totalCompletedOrderNumber > 200 && (
            <div className="flex gap-2 font-medium leading-none text-green-500">
              <TrendingUp className="h-4 w-4" />
              <span>
                Great job! You have successfully completed many orders this
                period.
              </span>
            </div>
          )}
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Category-wise Sales Overview</CardTitle>
            <CardDescription>Analyze with categories</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 pb-0">
            {isCategoryLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading pie chart...
              </p>
            ) : isCategoryError ? (
              <p className="text-sm text-red-500">
                Failed to load category sales data.
              </p>
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
                    data={categoriesSales?.pieChartData}
                    dataKey="revenue"
                    nameKey="category"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {categoriesSales?.pieChartData?.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          chartConfigPie?.[entry?.category]?.color || "#8884d8"
                        }
                      />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          const total = categoriesSales?.totalRevenue;

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
                                {formatCurrencyShort(total)}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground text-sm"
                              >
                                Total Revenue
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-2 text-sm">
            {/* Highest & Lowest Revenue Category Message */}
            {categoriesSales?.highestRevenueCategory &&
              categoriesSales?.lowestRevenueCategory && (
                <>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Highest revenue category:
                    <span className="font-semibold text-foreground">
                      {categoriesSales.highestRevenueCategory.category} (
                      {formatCurrencyShort(
                        categoriesSales.highestRevenueCategory.revenue
                      )}
                      )
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    Lowest revenue category:{" "}
                    <span className="font-semibold text-foreground">
                      {categoriesSales.lowestRevenueCategory.category} (
                      {formatCurrencyShort(
                        categoriesSales.lowestRevenueCategory.revenue
                      )}
                      )
                    </span>
                  </div>
                </>
              )}
          </CardFooter>
        </Card>

        {/* Total Earned Revenue */}

        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Revenue</CardTitle>
            <CardDescription>Your Total Sales Revenue</CardDescription>
          </CardHeader>

          <CardContent>
            {isCategoryLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading revenue chart...
              </p>
            ) : isCategoryError ? (
              <p className="text-sm text-red-500">
                Unable to fetch revenue data.
              </p>
            ) : (
              <ChartContainer config={chartConfigRevenue}>
                <LineChart
                  accessibilityLayer
                  data={chartData?.totalRevenueResult}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="monthName" 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => String(value).slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent  />}
                  />
                  <Line
                    dataKey="totalRevenue"
                    type="monotone"
                    stroke="var(--color-totalRevenue)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-dot)" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>

          <CardFooter className="flex-col items-start gap-2 text-sm">
  {chartData?.totalRevenueResult?.length > 0 && (() => {
    const sorted = [...chartData.totalRevenueResult].sort(
      (a, b) => b.totalRevenue - a.totalRevenue
    );

    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];

    return (
      <>
        <div className="flex gap-2 font-medium leading-none text-green-500">
          <span className="font-semibold">{highest.monthName}:</span>
          <span>had the highest revenue of ${highest.totalRevenue.toLocaleString()}.</span>
        </div>
        <div className="flex gap-2 font-medium leading-none text-red-500">
          <span className="font-semibold">{lowest.monthName}:</span>
          <span>had the lowest revenue of ${lowest.totalRevenue.toLocaleString()}.</span>
        </div>
      </>
    );
  })()}
</CardFooter>


        </Card>
      </div>

      {isInventoryLoading ? (
        <p className="text-sm text-muted-foreground">
          Loading inventory summary...
        </p>
      ) : isInventoryError ? (
   
  <p className="text-sm text-red-500">
  Failed to load inventory data.
</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Sales */}
          <Card className="bg-blue-50 border border-blue-200 shadow-md rounded-2xl">
            <CardHeader className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <CardTitle className="text-blue-800 font-semibold">
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-700">
                {data?.totalSalesCount}
              </p>
            </CardContent>
          </Card>

          {/* Total Stock */}
          <Card className="bg-green-50 border border-green-200 shadow-md rounded-2xl">
            <CardHeader className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <Boxes className="h-6 w-6" />
              </div>
              <CardTitle className="text-green-800 font-semibold">
                Total Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-700">
                {data?.totalStockCount}
              </p>
              <p className="mt-2 text-sm text-green-600">
                Weight: {data?.totalWeight} G
              </p>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="bg-yellow-50 border border-yellow-200 shadow-md rounded-2xl">
            <CardHeader className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <CardTitle className="text-yellow-800 font-semibold">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-700">
                ৳ {data?.totalRevenue}
              </p>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card className="bg-purple-50 border border-purple-200 shadow-md rounded-2xl">
            <CardHeader className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                <PackageCheck className="h-6 w-6" />
              </div>
              <CardTitle className="text-purple-800 font-semibold">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-700">
                {data?.totalOrderCount}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
