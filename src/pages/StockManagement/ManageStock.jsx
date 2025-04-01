
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Eye, Search, Trash2 } from "lucide-react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const stockData = [
    {
      productName: "Gold Ring",
      category: "Jewelry",
      barcode: "123456789",
      weight: 5.2,
      image: "/gold-ring.jpg",
      karat: "18K",
      bhori: 1,
      tola: 2,
      roti: 5,
      Cost: 1500,
    },
    {
      productName: "Diamond Necklace",
      category: "Jewelry",
      barcode: "987654321",
      weight: 10.5,
      image: "/diamond-necklace.jpg",
      karat: "24K",
      bhori: 0,
      tola: 1,
      roti: 3,
      Cost: 3500,
    },
  ];


const ManageStock = () => {


    const [search, setSearch] = useState("");
    const [filteredStock] = useState(stockData);
  
    const [category, setCategory] = useState("");
    const [dateSort, setDateSort] = useState("");
  
    const handleSearch = (e) => setSearch(e.target.value);
    const handleCategoryChange = (value) => setCategory(value);
    const handleDateSortChange = (value) => setDateSort(value);

   









    return (
        <div>
                <Card>
      <CardHeader>
        <CardTitle>Stock Management</CardTitle>
      </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Barcode Search Input & Button */}
        <div className="flex w-full items-center  gap-2">
          <Input
            placeholder="Search by barcode..."
            value={search}
            onChange={handleSearch}
            className="w-2/3 h-12 text-lg"
          />
          <Button className="w-1/3 h-12 flex justify-center items-center">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Category Selection */}
   <div className="flex items-center justify-center gap-4">
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full h-12 text-lg">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
  
          {/* Date Sorting */}
          <Select value={dateSort} onValueChange={handleDateSortChange}>
            <SelectTrigger className="w-full h-12 text-lg">
              <SelectValue placeholder="Sort by Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
   </div>
      </CardContent>
    </Card>

      {/* Stock Table */}
      <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Stock List</CardTitle>
       
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-full text-sm">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="p-3">Product</TableHead>
                <TableHead className="p-3">Category</TableHead>
                <TableHead className="p-3">Weight (g)</TableHead>
                <TableHead className="p-3">Karat</TableHead>
                <TableHead className="p-3">Stock (B/T/R)</TableHead>
                <TableHead className="p-3">Price ($)</TableHead>
                <TableHead className="p-3">Actions</TableHead>
                <TableHead className="p-3">Image</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockData.map((item, index) => (
                <TableRow key={index} className="border-b">
                  <TableCell className="">
                    <p className="font-medium">{item.productName}</p>
                    <span className="text-gray-500 text-xs">{item.barcode}</span>
                  </TableCell>
                  <TableCell className="p-3">{item.category}</TableCell>
                  <TableCell className="p-3">{item.weight}</TableCell>
                  <TableCell className="p-3">{item.karat}</TableCell>
                  <TableCell className="p-3">
                    {item.bhori || ''} B / {item.tola || 0} T / {item.roti || 0} R
                  </TableCell>
                  <TableCell className="p-3 font-semibold">${item.Cost}</TableCell>
                  <TableCell className="p-3 flex space-x-2 items-center">
                    <Button variant="outline" size="icon" className="p-1">
                      <Eye size={16} />
                    </Button>
                    <Button variant="outline" size="icon" className="p-1">
                      <Edit size={16} />
                    </Button>
                    <Button variant="outline" size="icon" className="p-1">
                      <Trash2 className="text-red-600" size={16} />
                    </Button>
                  </TableCell>
                  <TableCell className="p-3">
                    {item.image ? (
                      <img src={item.image} alt={item.productName} width={30} height={30} className="rounded-md" />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
        </div>
    );
};

export default ManageStock;