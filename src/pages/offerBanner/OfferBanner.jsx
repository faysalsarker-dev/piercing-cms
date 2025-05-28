import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CreateOffer from "./CreateOffer";
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmDialog";
import useAxios from "@/hooks/useAxios";
import UpdateOffer from "./UpdateOffer";
import { Pencil } from "lucide-react";

const OfferBanner = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
const [isEditOpen, setEditOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const axiosCommon = useAxios();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await axiosCommon.get("/banners");
      return res.data;
    },
  });

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Offer Banners</h1>
        <Button onClick={() => setIsCreateOpen(true)}>Add Offer Banner</Button>
      </div>

      {/* Create Dialog */}
      <CreateOffer open={isCreateOpen} setOpen={setIsCreateOpen} refetch={refetch} />

      {/* Table View */}
      {isLoading ? (
        <div className="text-center py-10 text-gray-500 font-medium">Loading offers...</div>
      ) : (
        <div className="overflow-auto rounded-md border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Redirect URL</TableHead>
                <TableHead>Display On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((offer) => (
                <TableRow key={offer._id}>
                  <TableCell>
                    <img
                      src={`${import.meta.env.VITE_API}/images/${offer?.imageUrl}`}
                      alt={offer.title}
                      className="w-20 h-14 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>{offer.title}</TableCell>
                
                  <TableCell>{offer.redirectUrl}</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-sm">
                      {offer?.displayOn?.map((path) => (
                        <li key={path}>{path}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        offer.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {offer.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
setSelectedOffer(offer)
                        setEditOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setIsDeleteOpen(true);
                        setDeleteId(offer._id);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
<UpdateOffer open={isEditOpen} setOpen={setEditOpen} offerData={selectedOffer} refetch={refetch} />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        id={deleteId}
        url="/banners"
        refetch={refetch}
      />
    </div>
  );
};

export default OfferBanner;
