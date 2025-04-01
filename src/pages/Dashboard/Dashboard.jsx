import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, ShoppingCart, Box, DollarSign } from "lucide-react";
import { BarChart, Bar, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";


export default function Dashboard() {
  const chartData = [
    { month: "First Week", desktop: 186, mobile: 80 },
    { month: "Second Week", desktop: 305, mobile: 200 },
    { month: "Third Week", desktop: 237, mobile: 120 },
    { month: "Fourth Week", desktop: 73, mobile: 190 },
  ];

  const chartConfig = {
    desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
    mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
  };

  return (
    <div className="p-6 grid gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle><ShoppingCart className="inline-block mr-2" /> This Month Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$12,340</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle><Box className="inline-block mr-2" /> This Month Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5,420</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle><DollarSign className="inline-block mr-2" /> This Month Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$3,890</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <CardContent>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={chartData}>
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="month"
        tickLine={false}
        tickMargin={10}
        axisLine={false}
        tickFormatter={(value) => value?.slice(0, 3)}
      />
      <Tooltip cursor={false} />
      <Bar dataKey="desktop" fill="hsl(var(--chart-1))" radius={4} />
      <Bar dataKey="mobile" fill="hsl(var(--chart-2))" radius={4} />
    </BarChart>
  </ResponsiveContainer>
</CardContent>


      {/* Data Table */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Remaining Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2025-03-28</TableCell>
              <TableCell>Gold Necklace</TableCell>
              <TableCell>5</TableCell>
              <TableCell>95</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-03-27</TableCell>
              <TableCell>Diamond Ring</TableCell>
              <TableCell>2</TableCell>
              <TableCell>48</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
