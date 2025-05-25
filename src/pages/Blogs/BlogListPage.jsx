import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAxios from "@/hooks/useAxios";
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmDialog";

export default function BlogListPage() {
  const axiosCommon = useAxios();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const {
    data: blogs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axiosCommon.get("/blogs");
      return res.data;
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Blogs</h2>
        <Button onClick={() => navigate("/blog-post")} className="bg-primary hover:bg-blue-600 text-white">
          + Create New Blog
        </Button>
      </div>

      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-300 text-black hover:bg-primary">
              <TableHead>Image</TableHead>
              <TableHead >Title</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                  No blogs found.
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow className="bg-white" key={blog._id}>
                  <TableCell >
                    {blog.image ? (
                      <img
                        src={`${import.meta.env.VITE_API}/images/${blog.image}`}
                        alt={blog.title}
                        className="w-20 h-14 object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-muted-foreground italic">No Image</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => navigate(`/blogs-update/${blog.slug}`)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        setDeleteId(blog.slug);
                        setOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        id={deleteId}
        url="/blogs"
        refetch={refetch}
      />
    </div>
  );
}
