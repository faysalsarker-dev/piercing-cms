import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import useAxios from "@/hooks/useAxios";
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmDialog";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";



export default function Users() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDiolog, setOpenDiolog] = useState(false);


  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const axiosCommon = useAxios();

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosCommon.get("/users");
      return res.data;
    },
  });


const { mutate } = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosCommon.put(`/users/${formData.uid}`, formData);
      return res.data;
    },
    onSuccess: () => {
      refetch()
      toast.success("User Update successfully!");
   setOpenDiolog(false)
    },
    onError: (error) => {
      console.error(error.massage);
      toast.error("User registration failed.");
    },
  });

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpenDiolog(true);
  };

  const handleRoleChange = (newRole) => {
    setSelectedUser((prev) => ({ ...prev, role: newRole }));
  };

  const handleSubmit = () => {
    console.log(selectedUser);
   mutate(selectedUser);
  };

  return (
    <div className="p-6">
   <div className="flex justify-between items-center">   <h2 className="text-2xl font-bold mb-6">User Management</h2>
 <Link to='/users/register'>  <Button className='bg-primary'>Add New User</Button></Link>
   </div>

      <Table>
        <TableHeader className='bg-gray-300'>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='bg-white'>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.displayName}</TableCell>
              <TableCell>{user.email}</TableCell>
          <TableCell>
  <Badge
    className={`capitalize px-3 py-1 rounded-lg
      ${user.role === "admin" 
        ? "bg-green-100 text-green-800 border border-green-400"
        : "bg-gray-100 text-gray-800 border border-gray-400"}`}
  >
    {user.role}
  </Badge>
</TableCell>

              <TableCell className="flex justify-end gap-2">
                <Button size="icon" variant="ghost" onClick={() => handleEditClick(user)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                     onClick={() => {
                          setDeleteId(user?.uid);
                          setOpen(true);
                        }}
                
                size="icon" variant="ghost" className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog for Role Update */}
      <Dialog open={openDiolog} onOpenChange={setOpenDiolog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div>
                <p><strong>Name:</strong> {selectedUser.displayName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Role</label>
                <Select value={selectedUser.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button onClick={handleSubmit} >
                  update
                  {/* {mutation.isLoading ? "Updating..." : "Update Role"} */}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>



     <DeleteConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        id={deleteId}
        url="/users"
        refetch={refetch}
      />

    </div>
  );
}
