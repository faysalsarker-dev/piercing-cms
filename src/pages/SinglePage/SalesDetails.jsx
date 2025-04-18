import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Trash, Pencil, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmDialog";
import { useState } from "react";

const SalesDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const {
    data: sale,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sales", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await axiosSecure.get(`/sale/${id}`);
      return response.data.sale;
    },
    staleTime: 1200000,
    cacheTime: 3600000,
  });










  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load sale details.
      </div>
    );
  }

  return (
    <div className="relative max-w-xl mx-auto p-6 mt-5 bg-white rounded-lg shadow-md md:max-w-2xl">
      {/* Payment Alert */}


      <div className="absolute md:top-4 -top-6 -left-16 cursor-pointer" onClick={() => window.history.back()}>
        <ArrowLeft className="w-8 h-8 text-gray-500 hover:text-gray-700" />
      
      </div>
      {sale?.paymentType === "full" ? (
        <Alert className="bg-green-100 border-green-500 text-green-700">
          <AlertTitle>Payment Complete</AlertTitle>
          <AlertDescription>This sale has been fully paid.</AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-red-100 border-red-500 text-red-700">
          <AlertTitle>Payment Pending</AlertTitle>
          <AlertDescription>
             <p><strong>EMI Due On:</strong> {sale?.dueDate ? format(new Date(sale.dueDate), "EEEE, MMMM d, yyyy") : "N/A"}</p>
          </AlertDescription>
        </Alert>
      )}

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Sales Receipt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Client Information</h2>
              <p><strong>Name:</strong> {sale?.clientName}</p>
              <p><strong>Phone:</strong> {sale?.clientPhone}</p>
              <p><strong>Payment Type:</strong> {sale?.paymentType}</p>
              {
                sale?.paymentType === "emi" && (
                 <div>
                    <p><strong>Paid Amount:</strong> ৳ {sale?.paidAmount}</p>
                    <p><strong>Due Amount:</strong> ৳ {sale?.due}</p>
                 </div>
                )
              }
             
            </div>
            <div>
              <h2 className="text-lg font-semibold">Product Details</h2>
              <p><strong>Name:</strong> {sale?.product?.productName}</p>
              <p><strong>Category:</strong> {sale?.product?.category}</p>
              <p><strong>Weight:</strong> {sale?.product?.weight}g</p>
              <p><strong>Karat:</strong> {sale?.product?.karat}</p>
              <p><strong>Cost:</strong> ৳  {sale?.product?.cost}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Transaction Info</h2>
              <p><strong>Total Price:</strong> ৳ {sale?.price}</p>
              <p><strong>Sold At:</strong> <p><strong>Sold At:</strong> {sale?.soldAt ? format(new Date(sale.soldAt), "EEEE, MMMM d, yyyy") : "N/A"}</p></p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
       <Link to={`/sale-management/${sale._id}`} >
          <Button variant="outline" className="flex items-center text-blue-600">
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </Button>
       </Link >
        <Button
        
        onClick={() => {
            setDeleteId(sale._id);
            setOpen(true);         
          }}
        
        variant="destructive" className="flex items-center  text-white">
          <Trash className="w-4 h-4 mr-2" /> Delete
        </Button>
      </div>



      <DeleteConfirmDialog
  open={open}
  onClose={() => setOpen(false)}
  id={deleteId}
  url={`/sale`} 
  navigateLink={-1}
/>

    </div>
  );
};

export default SalesDetails;