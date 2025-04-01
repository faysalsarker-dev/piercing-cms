import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddStock from "./AddStock";
import ManageStock from "./ManageStock";

export default function StockManagement() {
  return (
    <div className="p-6 space-y-6">
      {/* Tabs Navigation */}
      <Tabs defaultValue="manage-stock" className="w-full  ">
        <TabsList className=" py-6">
          <TabsTrigger value="manage-stock" className="px-4 py-2 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-white ">
            Manage Stock
          </TabsTrigger>
          <TabsTrigger value="add-stock" className="px-4 py-2 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-white ">
            Add Product
          </TabsTrigger>
        </TabsList>

        {/* Tabs Content */}
        <TabsContent value="manage-stock" className="mt-4">
          <ManageStock />
        </TabsContent>

        <TabsContent value="add-stock" className="mt-4">
          <AddStock />
        </TabsContent>
      </Tabs>
    </div>
  );
}
