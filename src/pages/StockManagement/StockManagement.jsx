import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddStock from "./AddStock";

const stockData = [
  { id: 1, name: "Gold Necklace", category: "Jewelry", stock: 50, price: "$1200", date: "2025-03-30" },
  { id: 2, name: "Diamond Ring", category: "Jewelry", stock: 20, price: "$3500", date: "2025-03-28" },
  { id: 3, name: "Silver Bracelet", category: "Jewelry", stock: 75, price: "$450", date: "2025-03-29" },
];

export default function StockManagement() {
  const [search, setSearch] = useState("");
  const [filteredStock, setFilteredStock] = useState(stockData);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredStock(stockData.filter((item) => item.name.toLowerCase().includes(query)));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Management</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <Input placeholder="Search product..." value={search} onChange={handleSearch} className="w-1/3" />
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Stock</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add / Update Stock</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <Input placeholder="Product Name" />
                <Input placeholder="Category" />
                <Input type="number" placeholder="Stock Quantity" />
                <Input type="text" placeholder="Price" />
                <Button type="submit">Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AddStock/>
    </div>
  );
}
