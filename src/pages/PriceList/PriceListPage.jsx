import { Button } from "@/components/ui/button";
import CreatePriceListDialog from "./CreatePriceListDialog";
import PriceListTable from "./PriceListTable";
import { useState } from "react";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardHeader, CardTitle } from "@/components/ui/card";

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

      <CardHeader className="flex flex-row justify-between items-center bg-white">
             <CardTitle>Price List</CardTitle>
             <Select defaultValue="all">
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
           </CardHeader>




                   <CreatePriceListDialog open={isCreateOpen} setOpen={setIsCreateOpen}  refetch={refetch}/>

      <PriceListTable priceList={priceList}  isLoading={isLoading} refetch={refetch} />
    </div>
  );
}
