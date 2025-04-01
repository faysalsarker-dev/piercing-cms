import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", sales: 400, stock: 2400 },
  { name: "Feb", sales: 300, stock: 2210 },
  { name: "Mar", sales: 200, stock: 2290 },
  { name: "Apr", sales: 278, stock: 2000 },
  { name: "May", sales: 189, stock: 2181 },
  { name: "Jun", sales: 239, stock: 2500 },
];

export default function Dashboard() {
  return (
    <div className="p-6 grid gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$12,340</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5,420</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$3,890</p>
          </CardContent>
        </Card>
      </div>

      {/* Y-Axis Line Chart */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Sales & Stock Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={2} />
            <Line type="monotone" dataKey="stock" stroke="#22C55E" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

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
