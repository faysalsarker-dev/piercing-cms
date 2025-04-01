import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function AddNewSale() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const paymentType = watch("paymentType");

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Add New Sale</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Barcode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Barcode</label>
              <Input {...register("barcode", { required: "Barcode is required" })} placeholder="Enter barcode" className="text-lg p-3" />
              {errors.barcode && <p className="text-red-500 text-xs">{errors.barcode.message}</p>}
            </div>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Client Name</label>
              <Input {...register("clientName", { required: "Client name is required" })} placeholder="Enter client name" className="text-lg p-3" />
              {errors.clientName && <p className="text-red-500 text-xs">{errors.clientName.message}</p>}
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Client Phone</label>
              <Input {...register("clientPhone", { required: "Client phone is required" })} placeholder="Enter phone number" className="text-lg p-3" />
              {errors.clientPhone && <p className="text-red-500 text-xs">{errors.clientPhone.message}</p>}
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Product Name</label>
              <Input {...register("productName", { required: "Product name is required" })} placeholder="Product Name" className="text-lg p-3" />
              {errors.productName && <p className="text-red-500 text-xs">{errors.productName.message}</p>}
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Category</label>
              <Input {...register("category")} placeholder="Category" className="text-lg p-3" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Karat</label>
              <Input {...register("karat")} placeholder="Karat" className="text-lg p-3" />
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Payment Type</label>
              <select {...register("paymentType", { required: "Payment type is required" })} className="text-lg p-3 border rounded-md">
                <option value="">Select Payment Type</option>
                <option value="full">Full</option>
                <option value="emi">EMI</option>
              </select>
              {errors.paymentType && <p className="text-red-500 text-xs">{errors.paymentType.message}</p>}
            </div>
            {paymentType === "emi" && (
              <div className="flex flex-col">
                <label className="text-sm font-medium">Due Date</label>
                <Input type="date" {...register("dueDate")} className="text-lg p-3" />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full text-lg p-3" disabled={loading}>
            {loading ? "Adding..." : "Add Sale"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
