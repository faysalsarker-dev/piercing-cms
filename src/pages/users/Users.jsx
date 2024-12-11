import { useState } from "react";
import useAxiosSecure from "@/hooks/useAxiosSecure/useAxiosSecure";
import { DataTable } from "./DataTable";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import Swal from "sweetalert2";

const Users = () => {
  const axiosSecure = useAxiosSecure();

  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // For edit dialog
  const limit = 10;

  // Fetch users
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["users", currentPage, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        search: searchTerm, // Pass the search term to the backend
      });
      const response = await axiosSecure.get(`/users?${params.toString()}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  // Mutation to update user
  const updateUser = useMutation({
    mutationFn: async (updatedUser) => {
      const response = await axiosSecure.put(`/users/${updatedUser.id}`, updatedUser);
      return response.data;
    },
    onSuccess: () => {
      toast.success("User updated successfully!");
      refetch();
    },
    onError: () => {
      toast.error("Failed to update user!");
    },
  });

  // Mutation to delete user
  const deleteUser = useMutation({
    mutationFn: async (userId) => {
      await axiosSecure.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      Swal.fire({
        title: "Deleted!",
        text: "User has been deleted.",
        icon: "success",
      });
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete user!");
    },
  });

  const onDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser.mutate(userId);
      }
    });
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page on a new search
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (data?.totalPages && currentPage < data.totalPages) setCurrentPage((prev) => prev + 1);
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ getValue }) => getValue(),
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ getValue }) => <span className="text-gray-600">{getValue()}</span>,
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: ({ getValue }) => getValue(),
    },
    {
      header: "Balance",
      accessorKey: "balance",
      cell: ({ getValue }) => getValue(),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => (
        <span
          className={`px-2 py-1 rounded ${
            getValue() === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {getValue()}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex space-x-2">
            <button
              className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={() => setSelectedUser(user)} // Open edit dialog
            >
              Edit
            </button>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => onDelete(user.uid)} // Delete user
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Users</h1>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading data.</p>}
      {data && (
        <>
          <DataTable columns={columns} data={data.users} />
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600"
            >
              Previous
            </button>
            <span className="px-4 py-2">{`Page ${currentPage} of ${data.totalPages}`}</span>
            <button
              onClick={handleNext}
              disabled={currentPage === data.totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Edit Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>Edit User</DialogHeader>
            <div className="mb-4">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Balance:</strong> {selectedUser.balance}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateUser.mutate({ id: selectedUser._id, ...selectedUser });
                setSelectedUser(null);
              }}
            >
              <div className="mb-4">
                <label>Name:</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label>Email:</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <DialogFooter>
                <button type="button" onClick={() => setSelectedUser(null)} className="px-4 py-2 bg-gray-500 text-white rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                  Save
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Users;
