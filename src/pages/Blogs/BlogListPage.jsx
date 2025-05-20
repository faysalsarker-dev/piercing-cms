import { useQuery, } from "@tanstack/react-query";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import useAxios from "@/hooks/useAxios";

export default function BlogListPage() {

  const axiosCommon = useAxios()
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axiosCommon.get("/blogs");
      return res.data;
    },
  });




  return (
    <Card className="p-4 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">All Blogs</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Published</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => (
              <tr key={blog._id} className="hover:bg-gray-50 transition">
                <td className="p-3 border">{index + 1}</td>
                <td className="p-3 border">{blog.title}</td>
                <td className="p-3 border">{blog.createAt || "N/A"}</td>
                <td className="p-3 border flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Edit"
                  >
                    <FiEdit className="text-blue-600" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Delete"
                  >
                    <FiTrash2 className="text-red-600" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
