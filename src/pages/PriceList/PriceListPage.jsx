import CreatePriceListDialog from "./CreatePriceListDialog";
import PriceListTable from "./PriceListTable";


export default function PriceListPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Price List</h1>
        <CreatePriceListDialog />
      </div>
      <PriceListTable />
    </div>
  );
}
