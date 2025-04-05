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
    formState: { errors },
  } = useForm();

  const [imagePreview, setImagePreview] = useState(null);
  const axiosSecure = useAxios();

  // Fetch Barcode
  const { data: barcode } = useQuery({
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
    onSuccess: () => toast.success("Stock added successfully!"),
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
      <Card className="w-full max-w-5xl shadow-xl rounded-lg p-6 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-gray-700">Add New Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <Label>Product Name <span className="text-red-500">*</span></Label>
              <Input
                {...register("productName", { required: "Product name is required" })}
                placeholder="Enter product name"
                className="h-12 text-lg"
              />
              {errors.productName && <p className="text-red-500 text-sm">{errors.productName.message}</p>}
            </div>

            {/* Barcode */}
            <div>
              <Label>Barcode <span className="text-red-500">*</span></Label>
              <Input
                {...register("barcode")}
                value={barcode || ""}
                readOnly
                className="h-12 text-lg bg-gray-100"
              />
            </div>

            {/* Category */}
            <div>
              <Label>Category <span className="text-red-500">*</span></Label>
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
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            {/* Weight */}
            <div>
              <Label>Weight (grams) <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                step="any"
                {...register("weight", { required: "Weight is required" })}
                placeholder="Enter weight"
                className="h-12 text-lg"
              />
              {errors.weight && <p className="text-red-500 text-sm">{errors.weight.message}</p>}
            </div>

            {/* Karat */}
            <div>
              <Label>Karat <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                step="any"
                {...register("karat", { required: "Karat is required" })}
                placeholder="Enter karat"
                className="h-12 text-lg"
              />
              {errors.karat && <p className="text-red-500 text-sm">{errors.karat.message}</p>}
            </div>

            {/* Bhori / Tola / Roti */}
            <div><Label>Bhori</Label><Input type="number" step="any" {...register("bhori")} className="h-12 text-lg" /></div>
            <div><Label>Tola</Label><Input type="number" step="any" {...register("tola")} className="h-12 text-lg" /></div>
            <div><Label>Roti</Label><Input type="number" step="any" {...register("roti")} className="h-12 text-lg" /></div>

            {/* Cost */}
            <div>
              <Label>Cost <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                step="any"
                {...register("cost", { required: "Cost is required" })}
                className="h-12 text-lg"
              />
              {errors.cost && <p className="text-red-500 text-sm">{errors.cost.message}</p>}
            </div>

            {/* Image Upload */}
            <div className="col-span-2">
              <Label>Upload Image <span className="text-red-500">*</span></Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="h-12 text-lg" />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-lg shadow-md"
                />
              )}
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex gap-4">
              <Button
                type="submit"
                className="w-1/2 text-xl h-14 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isPending}
              >
                {isPending ? "Submitting..." : "Submit"}
              </Button>

        
            </div>
          </form>


          <div>
      <TagPrint
        barcode="1234567890"
        weight="4.5"
        bhori="1.2"
        tola="1"
        roti="0.5"
        cost="35000"
      />
    </div>
        </CardContent>
      </Card>
    </div>
  );
}
