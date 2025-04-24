import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import toast from "react-hot-toast";
import TagPrint from "@/components/custom/TagPrint";

export default function AddStock() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [imagePreview, setImagePreview] = useState(null);
  const axiosSecure = useAxios();
  const [tagData, setTagData] = useState(null);

  // Fetch Barcode
  const { data: barcode ,refetch} = useQuery({
    queryKey: ["barcode"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stocks/barcode");
      return res.data?.barcode || "";
    },
  });

  useEffect(() => {
    if (barcode) {
      setValue("barcode", barcode);
    }
  }, [barcode, setValue]);

  // Fetch Categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return res.data || [];
    },
  });

  // Mutation
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosSecure.post("/stocks", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (_data, variables) =>{
      setTagData({
        barcode: variables.get("barcode"),
        weight: variables.get("weight"),
        bhori: variables.get("bhori"),
        ana: variables.get("ana"),
        roti: variables.get("roti"),
      });
      reset();
      setImagePreview(null);
      refetch()
      setValue("image", null)
      toast.success("Stock added successfully!")},
    onError: () => toast.error("An error occurred while adding stock."),
  });

  // Submit
  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append("image", value);
      } else {
        formData.append(key, value);
      }
    });
    await mutateAsync(formData);
  };

  // Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">

{tagData && (
  <TagPrint
    {...tagData}
    onPrintDone={() => setTagData(null)}
  />
)}
      <Card className="w-full shadow-xl rounded-lg p-6 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-gray-700">Add New Stock</CardTitle>
        </CardHeader>
        <CardContent>
  <form
    onSubmit={handleSubmit(onSubmit)}
    
  >
   <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Product Name */}
      <div className="flex flex-col gap-1">
        <Label>Product Name (পণ্যের নাম) <span className="text-red-500">*</span></Label>
        <Input
          {...register("productName", {
            required: "Product name is required",
          })}
          placeholder="Enter product name"
          className="h-12 text-lg"
        />
        {errors.productName && (
          <p className="text-red-500 text-sm">{errors.productName.message}</p>
        )}
      </div>
  
      {/* Barcode */}
      <div className="flex flex-col gap-1">
        <Label>Barcode (বারকোড) <span className="text-red-500">*</span></Label>
        <Input
          {...register("barcode")}
          value={barcode || ""}
          readOnly
          className="h-12 text-lg bg-gray-100"
        />
      </div>
  
      {/* Category */}
      <div className="flex flex-col gap-1">
        <Label>Category (বিভাগ) <span className="text-red-500">*</span></Label>
        <Select
          value={watch("category") || ""}
          onValueChange={(value) => setValue("category", value)}
        >
          <SelectTrigger className="h-12 text-lg">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((cat) => (
              <SelectItem key={cat._id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>
  
      {/* Weight */}
      <div className="flex flex-col gap-1">
        <Label>Weight (ওজন - গ্রাম) <span className="text-red-500">*</span></Label>
        <Input
          type="number"
          step="any"
          min="0"
          {...register("weight", { required: "Weight is required" })}
          placeholder="Enter weight"
          className="h-12 text-lg"
        />
        {errors.weight && (
          <p className="text-red-500 text-sm">{errors.weight.message}</p>
        )}
      </div>
  
      {/* Karat */}
      <div className="flex flex-col gap-1">
        <Label>Karat (কারেট) <span className="text-red-500">*</span></Label>
        <Input
          type="text"
          step="any"
          {...register("karat", { required: "Karat is required" })}
          placeholder="Enter karat"
          className="h-12 text-lg"
        />
        {errors.karat && (
          <p className="text-red-500 text-sm">{errors.karat.message}</p>
        )}
      </div>
  
      {/* Bhori */}
      <div className="flex flex-col gap-1">
        <Label>Bhori (ভরি)</Label>
        <Input
          type="number"
          step="any"
          min="0"
          {...register("bhori")}
          className="h-12 text-lg"
        />
      </div>
  
      {/* ana */}
      <div className="flex flex-col gap-1">
        <Label>Ana (আনা)</Label>
        <Input
          type="number"
          step="any"
          min="0"
          {...register("ana")}
          className="h-12 text-lg"
        />
      </div>
      <div className="flex flex-col gap-1">
              <Label>Point (পয়েন্ট)  <span className="text-red-500">*</span></Label>
              <Input type="number" step="any" min="0" {...register("point")} className="h-12 text-lg" />
            </div>

  
      {/* Roti */}
      <div className="flex flex-col gap-1">
        <Label>Roti (রতি)</Label>
        <Input
          type="number"
          step="any"
          min="0"
          {...register("roti")}
          className="h-12 text-lg"
        />
      </div>
  
      {/* Cost */}
      <div className="flex flex-col gap-1">
        <Label>Cost (মূল্য) <span className="text-red-500">*</span></Label>
        <Input
          type="number"
          step="any"
          min="0"
          {...register("cost", { required: "Cost is required" })}
          className="h-12 text-lg"
        />
        {errors.cost && (
          <p className="text-red-500 text-sm">{errors.cost.message}</p>
        )}
      </div>
  
      {/* Image Upload */}
      <div className="flex flex-col gap-2">
        <Label>Upload Image (ছবি আপলোড করুন) <span className="text-red-500">*</span></Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="h-12 text-lg"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded-lg shadow-md"
          />
        )}
      </div>
  
   </div>
    {/* Submit Button */}
    <div className="flex flex-col gap-4 col-span-2 mt-9">
      <Button
        type="submit"
        className="w-full text-xl h-14 bg-primary text-white "
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit"}
      </Button>
    </div>
  </form>


</CardContent>

      </Card>
    </div>
  );
}
