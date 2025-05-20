import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useAxios from "@/hooks/useAxios";
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmDialog";
import { Link } from "react-router-dom";
import { EditGalleryDialog } from "@/components/custom/EditGalleryDialog";
import { Badge } from "@/components/ui/badge";

const Gallery = () => {
      const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editItem, setEditItem] = useState(null);

    const axiosCommon = useAxios()
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["review"],
    queryFn: async () => {
      const { data } = await axiosCommon.get(`/gallery`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-10 rounded-md" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading gallery.</div>;
  }

  return (
    <div className="p-4">
     <div className="flex justify-between"> <h2 className="text-2xl font-semibold mb-4">Gallery List</h2>
     
<Link to='/upload-media'>     <Button>Post</Button></Link>
     
     </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Media</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                {item.type === "image" ? (
                  <img
                    src={`${import.meta.env.VITE_API}/images/${item.url}`}
                    alt="lery"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ) : item.type === "video" ?(
                  <video
                    controls
                    className="w-20 h-20 object-cover rounded-md"
                    src={`${import.meta.env.VITE_API}/images/${item.url}`}
                  />
                ):(

                       <iframe
        src={item.url}
        title="Media Preview"
        className="w-20 h-20 rounded"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
                )}
              </TableCell>
<TableCell>
  <Badge
    className={
      item.status === "active"
        ? "bg-green-500 hover:bg-green-600"
        : item.status === "inactive"
        ? "bg-yellow-500 hover:bg-yellow-600"
        : item.status === "blocked"
        ? "bg-red-500 hover:bg-red-600"
        : "bg-gray-500"
    }
  >
    {item.status}
  </Badge>
</TableCell>              <TableCell className="text-right">
                <Button size="icon" variant="ghost"
                
                onClick={() => setEditItem(item)}
                >
                  <Pencil className="w-5 h-5 text-muted-foreground" />
                </Button>
              </TableCell>
              <TableCell className="text-right">
                  <Button
              onClick={() => {
                setDeleteId(item?._id);
                setOpen(true);
              }}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash size={16} /> Delete
            </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


{editItem && (
  <EditGalleryDialog
    item={editItem}
    onClose={() => setEditItem(null)}
    refetch={refetch}
  />
)}

      <DeleteConfirmDialog
      
      
      open={open}
          onClose={() => setOpen(false)}
          id={deleteId}
          url={`/gallery`}
        refetch={refetch}
      
      />
    </div>
  );
};

export default Gallery;
