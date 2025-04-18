import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Pencil, Trash2 ,ArrowBigLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { useState } from "react";
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmDialog";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();
 const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { data: order } = useQuery({
    queryKey: ["order-details", id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/orders/${id}`);
      return response.data || {};
    },
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-600";
      case "pending":
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDeliveryColor = (deliveryStatus) => {
    return deliveryStatus === "delivered"
      ? "bg-blue-100 text-blue-600"
      : "bg-gray-100 text-gray-700";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">

      <div className="flex gap-3"> 
        
  <Link to='/manage-orders'>
          <Button  size="icon" variant="outline" >
            <ArrowBigLeft />
                        </Button>
  </Link>
         <h1 className="text-3xl font-bold text-primary">Order Details</h1>
         
         </div>
        <div className="flex gap-3 ">
     

          <TooltipProvider>
         <Link to={`/update-orders/${order?._id}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button  size="icon" variant="outline">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Order</p>
                  </TooltipContent>
                </Tooltip>
         </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                
                onClick={() => {
                    setDeleteId(order?._id);
                    setOpen(true);
                  }}
                size="icon" variant="destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Order</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Card className="rounded-2xl shadow-md border border-muted">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <div className="md:col-span-2">
            <p className="font-semibold text-sm text-gray-500">Order Number:</p>
            <p className="text-xl font-mono bg-primary/10 text-primary px-4 py-2 rounded-lg w-fit shadow-sm">
              #{order?.orderNumber}
            </p>
          </div>

          <div>
            <p className="font-semibold">Client Name:</p>
            <p>{order?.clientName}</p>
          </div>
          <div>
            <p className="font-semibold">Client Phone:</p>
            <p>{order?.clientPhone}</p>
          </div>
          <div>
            <p className="font-semibold">Category:</p>
            <p>{order?.category}</p>
          </div>
          <div>
            <p className="font-semibold">Product Name:</p>
            <p>{order?.productName}</p>
          </div>
          <div>
            <p className="font-semibold">Weight:</p>
            <p>
              {order?.bhori || 0} Bhori, {order?.ana || 0} Ana, {order?.roti || 0} Roti, {order?.point || 0} Point
            </p>
          </div>
          <div>
            <p className="font-semibold">Cost:</p>
            <p className="text-gray-800 font-medium">৳ {order?.cost}</p>
          </div>
          <div>
            <p className="font-semibold">Advance Paid:</p>
            <p className="text-green-600 font-semibold">৳ {order?.advancePaid}</p>
          </div>
          <div>
            <p className="font-semibold">Due:</p>
            <p className="text-red-600 font-semibold">৳ {order?.due}</p>
          </div>
          <div>
            <p className="font-semibold">Delivery Date:</p>
            <p>{format(new Date(order?.deliveryDate || 0), "PPP")}</p>
          </div>
          <div>
            <p className="font-semibold">Order Status:</p>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(order?.status)}`}>
              {order?.status}
            </span>
          </div>
          <div>
            <p className="font-semibold">Delivery Status:</p>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${getDeliveryColor(order?.deliveryStatus)}`}>
              {order?.deliveryStatus}
            </span>
          </div>
          <div className="md:col-span-2">
            <p className="font-semibold">Notes:</p>
            <p className="whitespace-pre-line text-muted-foreground">{order?.notes || "No additional notes"}</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="text-sm text-muted-foreground text-center">
        Created At: {new Date(order?.createdAt).toLocaleString()} | Updated At:{" "}
        {new Date(order?.updatedAt).toLocaleString()}
      </div>



 <DeleteConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          id={deleteId}
          url={`/orders`}
          navigateLink={-1}
        />


    </div>
  );
};

export default OrderDetailsPage;
