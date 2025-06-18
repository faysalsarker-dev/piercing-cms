import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CreateOffer from "./CreateOffer";
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmDialog";
import useAxios from "@/hooks/useAxios";
import UpdateOffer from "./UpdateOffer";
import { Pencil, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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
      <div className="overflow-auto rounded-md border border-border bg-muted/30 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Redirect URL</TableHead>
            <TableHead>Display On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((offer) => (
            <TableRow key={offer._id}>
              <TableCell>
                <img
                  src={`${import.meta.env.VITE_API}/images/${offer.imageUrl}`}
                  alt={offer.title}
                  className="w-20 h-14 object-cover rounded-md shadow"
                />
              </TableCell>

              <TableCell className="font-medium">{offer.title}</TableCell>

              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm underline text-primary cursor-pointer">
                      {offer.redirectUrl}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{offer.redirectUrl}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {offer.displayOn.map((path) => (
                    <Badge
                      key={path}
                      variant="outline"
                      className="text-xs font-normal"
                    >
                      {path === "/" ? "Home" : path.replace("/", "").replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  className={`text-xs ${offer.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                  variant="secondary"
                >
                  {offer.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedOffer(offer);
                    setEditOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setIsDeleteOpen(true);
                    setDeleteId(offer._id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
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
