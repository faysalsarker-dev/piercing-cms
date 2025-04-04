
import { Link } from "react-router-dom";
import ManageStock from "./ManageStock";
import { Button } from "@/components/ui/button";

export default function StockManagement() {
  return (
 <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Stock Management</h2>
        <Link to='/stock-management/add-product'><Button className='bg-primary'>Add New Sale</Button></Link>
      </div>

<ManageStock />

 </div>
  );
}
