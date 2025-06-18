import { Button } from "@/components/ui/button";
import CreatePriceListDialog from "./CreatePriceListDialog";
import PriceListTable from "./PriceListTable";
import { useState } from "react";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";


export default function PriceListPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
      const axiosCommon = useAxios();

  const { data: priceList = [], isLoading, refetch } = useQuery({
    queryKey: ["pricelist"],
    queryFn: async () => {
      const res = await axiosCommon.get("/price");
      return res.data;
    },
  });
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Price List</h1>
          
        <Button onClick={() => setIsCreateOpen(true)} className="bg-primary text-white">+ Add Price Item</Button>
         
      </div>

   




                   <CreatePriceListDialog open={isCreateOpen} setOpen={setIsCreateOpen}  refetch={refetch}/>

      <PriceListTable priceList={priceList}  isLoading={isLoading} refetch={refetch} />
    </div>
  );
}
