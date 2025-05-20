import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import useAxios from "@/hooks/useAxios";
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmDialog";

export default function PriceListTable() {

    
         const [open, setOpen] = useState(false);
      const [deleteId, setDeleteId] = useState(null);
const axiosCommon = useAxios()
  const { data: priceList = [], isLoading,refetch } = useQuery({
    queryKey: ["pricelist"],
    queryFn: async () => {
      const res = await axiosCommon.get("/price");
      return res.data;
    },
  });




  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Price List</h2>

        <Select  defaultValue="all">
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="needles piercing">Needles Piercing</SelectItem>
            <SelectItem value="piercing with gun">Piercing with Gun</SelectItem>
            <SelectItem value="microlidding">Microlidding</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Regular Price</th>
                <th className="p-3">Discounted Price</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {priceList?.map((item) => (
                <tr key={item?._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {item?.image ? (
                      <img src={item?.image} alt="thumb" className="w-14 h-14 object-cover rounded-md" />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="p-3 font-medium">{item?.title}</td>
                  <td className="p-3 capitalize">{item?.category}</td>
                  <td className="p-3 text-red-500 font-semibold">{item?.regularPrice}</td>
                  <td className="p-3 text-green-600 font-semibold">{item?.discountedPrice}</td>
                  <td className="p-3 flex gap-3">
                    <Button size="sm" variant="outline" onClick={() => toast("Open edit dialog")}>
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                        onClick={() => {
                setDeleteId(item?._id);
                setOpen(true);
              }}
                     
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
              {priceList?.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No items in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    <DeleteConfirmDialog
      
      
      open={open}
          onClose={() => setOpen(false)}
          id={deleteId}
          url={`/price`}
        refetch={refetch}
      
      />




    </div>
  );
}
