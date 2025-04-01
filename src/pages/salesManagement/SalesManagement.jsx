import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import AddNewSale from "./AddNewSale";

// Fake Data for Sales
const fakeSalesData = [
  {
    id: 1,
    clientName: "John Doe",
    clientPhone: "123456789",
    paymentType: "full",
    dueDate: "2025-05-01",
    product: {
      productName: "Gold Ring",
      category: "Jewelry",
      barcode: "12345",
      weight: 10,
      karat: "22k",
      cost: 500,
      image: "https://via.placeholder.com/150",
      bhori: 10,
      tola: 8,
      roti: 5,
    },
    price: 1000,
    soldAt: "2025-01-01",
  },
  // Add more fake sales data here
];

export default function SalesManagement() {
  const [sales, setSales] = useState(fakeSalesData);
  const [isOpen, setIsOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  // Handle adding or editing a sale
  const onSubmit = (data) => {
    if (editingSale) {
      // Update Sale Logic
      setSales(sales.map((sale) => (sale.id === editingSale.id ? { ...data, id: editingSale.id } : sale)));
      toast.success("Sale updated successfully");
    } else {
      // Add New Sale Logic
      setSales([...sales, { ...data, id: sales.length + 1 }]);
      toast.success("Sale added successfully");
    }
    setIsOpen(false);
    reset();
    setEditingSale(null);
  };

  // Open Edit Modal
  const handleEdit = (sale) => {
    setEditingSale(sale);
    setValue("clientName", sale.clientName);
    setValue("clientPhone", sale.clientPhone);
    setValue("paymentType", sale.paymentType);
    setValue("dueDate", sale.dueDate);
    setValue("productName", sale.product.productName);
    setValue("price", sale.price);
    setIsOpen(true);
  };

  // Handle Sale Deletion
  const handleDelete = (id) => {
    setSales(sales.filter((sale) => sale.id !== id));
    toast.success("Sale deleted successfully");
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Sales Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setIsOpen(true); reset(); setEditingSale(null); }}>Add New Sale</Button>
          </DialogTrigger>
          <DialogContent className="w-full">
            <DialogHeader>
              <DialogTitle>{editingSale ? "Edit Sale" : "Add New Sale"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Label>Client Name</Label>
              <Input {...register("clientName", { required: true })} placeholder="Enter client name" />
              <Label>Client Phone</Label>
              <Input {...register("clientPhone", { required: true })} placeholder="Enter client phone" />
              <Label>Payment Type</Label>
              <select {...register("paymentType", { required: true })}>
                <option value="full">Full</option>
                <option value="emi">EMI</option>
              </select>
              <Label>Due Date</Label>
              <Input {...register("dueDate", { required: true })} type="date" />
              <Label>Product Name</Label>
              <Input {...register("productName", { required: true })} placeholder="Enter product name" />
              <Label>Price</Label>
              <Input {...register("price", { required: true })} placeholder="Enter price" />
              <Button className="mt-4 w-full" type="submit">{editingSale ? "Update" : "Add"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table className="w-full text-lg">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Client Name</TableHead>
            <TableHead>Client Phone</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.id}</TableCell>
              <TableCell>{sale.clientName}</TableCell>
              <TableCell>{sale.clientPhone}</TableCell>
              <TableCell>{sale.paymentType}</TableCell>
              <TableCell>{sale.product.productName}</TableCell>
              <TableCell>{sale.price}</TableCell>
              <TableCell className="flex gap-4">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(sale)}>
                  <Pencil className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(sale.id)}>
                  <Trash2 className="w-5 h-5 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddNewSale/>
    </div>
  );
}
