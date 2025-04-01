import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const initialCategories = [
  { id: 1, name: "Gold", status: "Active" },
  { id: 2, name: "Silver", status: "Inactive" },
];

export default function Categories() {
  const [categories, setCategories] = useState(initialCategories);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  const onSubmit = (data) => {
    if (editingCategory) {
      setCategories(categories.map((cat) => (cat.id === editingCategory.id ? { ...data, id: editingCategory.id } : cat)));
      toast.success("Category updated successfully");
    } else {
      setCategories([...categories, { ...data, id: categories.length + 1 }]);
      toast.success("Category added successfully");
    }
    setIsOpen(false);
    reset();
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setValue("name", category.name);
    setValue("status", category.status);
    setIsOpen(true);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setCategories(categories.filter((category) => category.id !== categoryToDelete.id));
    toast.success("Category deleted successfully");
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Category Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setIsOpen(true); reset(); setEditingCategory(null); }}>Add New Category</Button>
          </DialogTrigger>
          <DialogContent className="w-full">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Label>Name</Label>
              <Input {...register("name", { required: true })} placeholder="Enter category name" />
              <Label>Status</Label>
              <Select {...register("status", { required: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button className="mt-4 w-full" type="submit">{editingCategory ? "Update" : "Add"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table className="w-full text-lg">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.status}</TableCell>
              <TableCell className="flex gap-4">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                  <Pencil className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(category)}>
                  <Trash2 className="w-5 h-5 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-800">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h3 className="text-lg font-semibold">Are you sure you want to delete this category?</h3>
            <div className="mt-4 flex justify-between">
              <Button onClick={confirmDelete} className="bg-red-500 text-white">Yes, Delete</Button>
              <Button onClick={cancelDelete} className="bg-gray-500 text-white">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
