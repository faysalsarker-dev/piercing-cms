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
import { useParams } from "react-router-dom";

export default function UpdateStock() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const {id} = useParams();

  const [imagePreview, setImagePreview] = useState(null);
  const axiosSecure = useAxios();

  // Fetch Product Data by Product ID
  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/stocks/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (productData) {
      // Set form values from the fetched product data
      setValue("productName", productData.productName);
      setValue("barcode", productData.barcode);
      setValue("category", productData.category);
      setValue("weight", productData.weight);
      setValue("karat", productData.karat);
      setValue("bhori", productData.bhori);
      setValue("tola", productData.tola);
      setValue("roti", productData.roti);
      setValue("cost", parseFloat(productData.cost));
      setImagePreview(productData.imageUrl);
    }
  }, [productData, setValue]);

  // Fetch Categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return res.data || [];
    },
  });

  // Mutation for updating stock
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosSecure.put(`/stocks/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => toast.success("Stock updated successfully!"),
    onError: () => toast.error("An error occurred while updating stock."),
  });

  // Submit update
  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append("image", value);
      }  else {
        formData.append(key, value);
      }
    });
    console.log(formData);
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

  if (productLoading) return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl shadow-xl rounded-lg p-6 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-gray-700">Update Stock</CardTitle>
        </CardHeader>


        <CardContent>
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="grid gap-6 md:grid-cols-2 grid-cols-1"
  >
    {/* Product Name */}
    <div className="flex flex-col gap-1">
      <Label>
        Product Name (পণ্যের নাম) <span className="text-red-500">*</span>
      </Label>
      <Input
        {...register("productName", {
          required: "Product name is required",
        })}
        placeholder="Enter product name"
        className="h-12 text-base md:text-lg"
      />
      {errors.productName && (
        <p className="text-red-500 text-sm">{errors.productName.message}</p>
      )}
    </div>

    {/* Barcode */}
    <div className="flex flex-col gap-1">
      <Label>
        Barcode (বারকোড) <span className="text-red-500">*</span>
      </Label>
      <Input
        {...register("barcode")}
        readOnly
        className="h-12 text-base md:text-lg bg-gray-100"
      />
    </div>

    {/* Category */}
    <div className="flex flex-col gap-1">
      <Label>
        Category (বিভাগ) <span className="text-red-500">*</span>
      </Label>
      <Select
        value={watch("category") || ""}
        onValueChange={(value) => setValue("category", value)}
      >
        <SelectTrigger className="h-12 text-base md:text-lg">
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
      <Label>
        Weight (ওজন - গ্রাম) <span className="text-red-500">*</span>
      </Label>
      <Input
        type="number"
        step="any"
        min="0"
        {...register("weight", { required: "Weight is required" })}
        placeholder="Enter weight"
        className="h-12 text-base md:text-lg"
      />
      {errors.weight && (
        <p className="text-red-500 text-sm">{errors.weight.message}</p>
      )}
    </div>

    {/* Karat */}
    <div className="flex flex-col gap-1">
      <Label>
        Karat (কারেট) <span className="text-red-500">*</span>
      </Label>
      <Input
        type="text"
        step="any"
        {...register("karat", { required: "Karat is required" })}
        placeholder="Enter karat"
        className="h-12 text-base md:text-lg"
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
        className="h-12 text-base md:text-lg"
      />
    </div>

    {/* Tola */}
    <div className="flex flex-col gap-1">
      <Label>Tola (তোলা)</Label>
      <Input
        type="number"
        step="any"
        min="0"
        {...register("tola")}
        className="h-12 text-base md:text-lg"
      />
    </div>

    {/* Roti */}
    <div className="flex flex-col gap-1">
      <Label>Roti (রতি)</Label>
      <Input
        type="number"
        step="any"
        min="0"
        {...register("roti")}
        className="h-12 text-base md:text-lg"
      />
    </div>

    {/* Cost */}
    <div className="flex flex-col gap-1">
      <Label>
        Cost (মূল্য) <span className="text-red-500">*</span>
      </Label>
      <Input
        type="number"
        step="any"
        min="0"
        {...register("cost", { required: "Cost is required" })}
        className="h-12 text-base md:text-lg"
      />
      {errors.cost && (
        <p className="text-red-500 text-sm">{errors.cost.message}</p>
      )}
    </div>

    {/* Image Upload */}
    <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
      <Label>
        Upload Image (ছবি আপলোড করুন){" "}
        <span className="text-red-500">*</span>
      </Label>
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="h-12 text-base md:text-lg"
      />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="mt-2 w-32 h-32 object-cover rounded-lg shadow-md"
        />
      )}
    </div>

    {/* Submit Button */}
    <div className="col-span-1 md:col-span-2 mt-4">
      <Button
        type="submit"
        className="w-full text-xl h-14 bg-primary text-white"
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
