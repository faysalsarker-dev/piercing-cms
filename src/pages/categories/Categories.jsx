import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios/useAxios";

export default function Categories() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const axiosSecure = useAxios();

  // Fetch Categories
  const { data: categories = [], isLoading ,isError} = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axiosSecure.get("/categories");
      return response.data;
    },
    staleTime: 1200000,
    cacheTime: 3600000,
  });

  // Add or Update Category
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (info) => {
      if (editingCategory) {
        return await axiosSecure.put(`/categories/${editingCategory.id}`, info);
      }
      return await axiosSecure.post(`/categories`, info);
    },
    onSuccess: () => {
      toast.success(editingCategory ? "Category updated successfully." : "Category added successfully.");
      reset();
      setIsOpen(false);
      setEditingCategory(null);
    },
    onError: (error) => {
      console.log(error);
      toast.error("An error occurred while processing the request.");
    },
  });

  // Delete Category
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      toast.success("Category deleted successfully.");
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete category.");
    },
  });

  const onSubmit = async (data) => {
    await mutateAsync(data);
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
    deleteMutation.mutate(categoryToDelete.id);
  };
  if(isError){
    return <p>Error loading categories.</p>;
  }

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
              <Input className="h-12" {...register("name", { required: true })} placeholder="Enter category name" />
              <Label>Status</Label>
              <Select value={watch("status") || ""} onValueChange={(value) => setValue("status", value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button className="mt-4 w-full bg-primary" type="submit" disabled={isPending}>
                {isPending ? "Processing..." : editingCategory ? "Update" : "Add"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <p>Loading categories...</p>
      ) : (
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
            {categories?.map((category) => (
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
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-800">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h3 className="text-lg font-semibold">Are you sure you want to delete this category?</h3>
            <div className="mt-4 flex justify-between">
              <Button onClick={confirmDelete} className="bg-red-500 text-white" disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
              </Button>
              <Button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
