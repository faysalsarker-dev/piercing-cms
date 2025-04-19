import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Trash, Pencil, ArrowBigLeft } from "lucide-react";
import { format } from "date-fns";
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmDialog";
import { useState } from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
        Failed to load product details.
      </div>
    );
  }

  return (
   <div className="p-3">
      <div className="max-w-5xl mx-auto p-6 sm:p-10 bg-white rounded-2xl shadow-lg">
        {/* Product Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex gap-3">
          <Link to='/stock-management'>
          <Button  size="icon" variant="outline" >
            <ArrowBigLeft />
                        </Button>
  </Link>
          <div>
              <h1 className="md:text-3xl font-bold text-gray-800 mb-1">
              Product Name: {product?.productName}
              </h1>
            
              <p className="text-gray-500 text-sm">
                Category: <span className="font-medium">{product?.category}</span>
              </p>
          </div>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
     <Link to={`/stock-management/${id}`}>
              <Button variant="outline" className="flex items-center gap-2 text-blue-600">
                <Pencil size={16} /> Edit
              </Button>
     </Link>
            <Button
              onClick={() => {
                setDeleteId(product._id);
                setOpen(true);
              }}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash size={16} /> Delete
            </Button>
          </div>
        </div>
  
        {/* Product Image */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Product Image</h2>
          {product?.image ? (
            <img
              src={`${import.meta.env.VITE_BASE_URL}/images/${product.image}`}
              alt={product?.productName}
              className="w-full max-h-[400px] object-contain rounded-xl border"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-100 border rounded-xl text-gray-400 italic">
              No image available
            </div>
          )}
        </div>
  
        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Product Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p><strong>Barcode:</strong> {product?.barcode}</p>
              <p><strong>Weight:</strong> {product?.weight}g</p>
              <p><strong>Karat:</strong> {product?.karat}</p>
              <p><strong>Cost:</strong> ${product?.cost}</p>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Additional Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p><strong>Bhori:</strong> {product?.bhori || "N/A"}</p>
              <p><strong>ana:</strong> {product?.ana || "N/A"}</p>
              <p><strong>Roti:</strong> {product?.roti || "N/A"}</p>
              <p>
                <strong>Added On:</strong>{" "}
                {format(new Date(product?.createdAt), "EEEE, MMMM d, yyyy")}
              </p>
            </CardContent>
          </Card>
        </div>
  
        {/* Delete Dialog */}
        <DeleteConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          id={deleteId}
          url={`/stocks`}
          navigateLink={-1}
        />
      </div>
   </div>
  );
};

export default ProductDetails;
