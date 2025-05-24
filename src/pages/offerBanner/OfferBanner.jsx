import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import OfferBannerCard from "@/components/custom/OfferBannerCard";
import CreateOffer from "./CreateOffer";
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmDialog";
import useAxios from "@/hooks/useAxios";

const OfferBanner = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

      {/* Create Offer Dialog */}
      <CreateOffer open={isCreateOpen} setOpen={setIsCreateOpen} refetch={refetch} />

      {/* Loading or Offer Grid */}
      {isLoading ? (
        <div className="text-center py-10 text-gray-500 font-medium">Loading offers...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data?.map((offer) => (
            <OfferBannerCard
              key={offer._id}
              offer={offer}
              setOpen={setIsDeleteOpen}
              setDeleteId={setDeleteId}
            />
          ))}
        </div>
      )}

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
