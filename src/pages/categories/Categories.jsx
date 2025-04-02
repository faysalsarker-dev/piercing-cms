import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

import { toast } from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";

export default function Categories() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm();
const axiosSecure = useAxios()



const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axiosSecure.get("/categories");
      return response.data || [];
    },
  });
  



  // Add or Update Category
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (info) => {
      return await axiosSecure.post(`/categories`, info);
    },
    onSuccess: () => {
      toast.success("Category added successfully.");
      reset();
      setIsOpen(false);
      setEditingCategory(null);
      refetch();
    },
    onError: () => {
      toast.error("An error occurred while processing the request.");
    },
  });




  const { mutateAsync:onUpdate, isPending:onUpdatepending } = useMutation({
    mutationFn: async (info) => {
      
        return await axiosSecure.put(`/categories/${info._id}`, info);
      
      
    },
    onSuccess: () => {
      toast.success("Category updated successfully.");
      reset();
      setIsOpen(false);
      setEditingCategory(null);
      refetch();
    },
    onError: () => {
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
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete category.");
    },
  });

  const onSubmit = async (formData) => {
    if (editingCategory) {
      await onUpdate({ ...formData, _id: editingCategory._id });
    } else {
      await mutateAsync(formData);
    }
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
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete._id);
    }
  };

  if (isError) {
    return <p className="text-red-500">Error loading categories.</p>;
  }

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Category Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className='bg-primary' onClick={() => { setIsOpen(true); reset(); setEditingCategory(null); }}>Add New Category</Button>
          </DialogTrigger>
          <DialogContent className="w-full">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Label>Name</Label>
              <Input   autoComplete="off"
 className="h-12" {...register("name", { required: true })} placeholder="Enter category name" />
              <Label>Status</Label>
            
              <Select 
  value={watch("status") || editingCategory?.status || "active"} 
  onValueChange={(value) => setValue("status", value)}
>
  <SelectTrigger className="h-12">
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="inactive">Inactive</SelectItem>
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
        <Table className="w-full text-lg">
  <TableHeader>
    <TableRow>
      <TableHead>#</TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {[1, 2, 3, 4, 5].map((_, idx) => (
      <TableRow key={idx}>
        <TableCell>
          <Skeleton className="h-6 w-6 rounded-md" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-6" />
        </TableCell>
        <TableCell>
         
            <Skeleton className="h-5 w-5" />
          
        </TableCell>
        <TableCell className="flex gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

      ) : (
        <Table className="w-full text-lg">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((category,idx) => (
              <TableRow key={category?._id}>

                <TableCell>{idx+1}</TableCell>
                <TableCell>{category?.name}</TableCell>
                <TableCell>
                  
                  
                <Badge
  variant="outline"
  className={category?.status.toLowerCase() === "active" ? "text-green-600" : "text-red-600"}
>
  {category?.status}
</Badge>

                </TableCell>
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
              <Button onClick={confirmDelete} className="bg-red-500 text-white">Confirm</Button>
              <Button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
