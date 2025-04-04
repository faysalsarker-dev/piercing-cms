import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Trash, Pencil } from "lucide-react";
import { format } from "date-fns"; // Import date-fns to format dates
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmDialog";
import { useState } from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();
const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  // Fetch product data from the API
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await axiosSecure.get(`/stocks/${id}`);
      return response.data;
    },
    staleTime: 1200000,
    cacheTime: 3600000,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-red-500 text-center mt-10">Failed to load product details.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Product Title and Header */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{product?.productName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-500">Category: <strong>{product?.category}</strong></p>
        </CardContent>
      </Card>

      {/* Product Image */}
      {product?.image && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Product Image</h3>
          <img src={product?.image} alt={product?.productName} className="w-full h-auto rounded-md shadow-lg" />
        </div>
      )}

      {/* Product Info Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p><strong>Barcode:</strong> {product?.barcode}</p>
            <p><strong>Weight:</strong> {product?.weight}g</p>
            <p><strong>Karat:</strong> {product?.karat}</p>
            <p><strong>Cost:</strong> ${product?.cost}</p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p><strong>Bhori:</strong> {product?.bhori || "N/A"}</p>
            <p><strong>Tola:</strong> {product?.tola || "N/A"}</p>
            <p><strong>Roti:</strong> {product?.roti || "N/A"}</p>
            <p><strong>Added At:</strong> {format(new Date(product?.createdAt), "EEEE, MMMM d, yyyy")}</p>
          </div>
        </CardContent>
      </Card>

      

      <DeleteConfirmDialog
  open={open}
  onClose={() => setOpen(false)}
  id={deleteId}
  url={`/stocks`} 
  navigateLink={-1}
/>




      <div className="flex justify-between mt-6">
        <Button variant="outline" className="flex items-center text-blue-600">
          <Pencil className="w-4 h-4 mr-2" /> Edit
        </Button>
        <Button 
          onClick={() => {
            setDeleteId(product._id); // this is the ID of the stock item
            setOpen(true);          // open the dialog
          }}
        variant="destructive" className="flex items-center text-white">
          <Trash className="w-4 h-4 mr-2" /> Delete
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
