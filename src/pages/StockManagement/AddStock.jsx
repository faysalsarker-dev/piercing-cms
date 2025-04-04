import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import toast from "react-hot-toast";
import Barcode from "react-barcode";

export default function AddStock() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const axiosSecure = useAxios();


  const { data:barcode } = useQuery({
    queryKey: ["barcode"],
    queryFn: async () => {
      const response = await axiosSecure.get("/stocks/barcode"  
      );
      
      return response.data.barcode;
    },
 
  });







console.log(barcode,'barcode');











  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axiosSecure.get("/categories");
      return response.data || [];
    },
  });













  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosSecure.post(`/stocks`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Stock added successfully!");
    },
    onError: () => {
      toast.error("An error occurred while adding stock.");
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
   
    // Append regular fields
    Object.keys(data).forEach((key) => {
      if (key !== "image") {
        formData.append(key, data[key]);
      }
    });
  
    // Append image properly
    if (data.image) {
      formData.append("image", data.image);
    } 
  
    mutateAsync(formData);
  };
  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("image", file); 
    }
  };
  
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full  shadow-xl rounded-lg p-6 bg-white">
        <CardHeader>
          <CardTitle className="text-start text-3xl font-semibold text-gray-700">Add New Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Product Name <span className="text-red-500">*</span></Label>
              <Input {...register("productName", { required: "Product name is required" })} placeholder="Enter product name" className="h-12 text-lg" />
              {errors.productName && <p className="text-red-500 text-sm">{errors.productName.message}</p>}
            </div>

    <div>
              <Label>Barcode <span className="text-red-500">*</span></Label>
              <Input value={barcode} {...register("barcode")} placeholder="Enter barcode" className="h-12 text-lg" />
              {errors.barcode && <p className="text-red-500 text-sm">{errors.barcode.message}</p>}
            
              <Barcode value={barcode} 
              
              // displayValue={false}
              
              
              />
            </div>

            <div>
              <Label>Category <span className="text-red-500">*</span></Label>
              <Select value={watch("category")} onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

        

            <div>
              <Label>Weight (grams) <span className="text-red-500">*</span></Label>
              <Input
               defaultValue={0}
              type="number" step="any" {...register("weight", { required: "Weight is required" })} placeholder="Enter weight" className="h-12 text-lg" />
              {errors.weight && <p className="text-red-500 text-sm">{errors.weight.message}</p>}
            </div>

            <div>
              <Label>Karat <span className="text-red-500">*</span></Label>
              <Input 
              
              step="any" {...register("karat", { required: "Karat is required" })} placeholder="Enter karat" className="h-12 text-lg" />
              {errors.karat && <p className="text-red-500 text-sm">{errors.karat.message}</p>}
            </div>

            <div>
              <Label>Bhori</Label>
              <Input
               defaultValue={0}
              type="number" step="any" {...register("bhori")} placeholder="Enter bhori" className="h-12 text-lg" />
            </div>

            <div>
              <Label>Tola</Label>
              <Input 
               defaultValue={0}
              type="number" step="any" {...register("tola")} placeholder="Enter tola" className="h-12 text-lg" />
            </div>

            <div>
              <Label>Roti</Label>
              <Input
               defaultValue={0}
               type="number" step="any" {...register("roti")} placeholder="Enter roti" className="h-12 text-lg" />
            </div>

            <div>
              <Label>Cost <span className="text-red-500">*</span></Label>
              <Input type="number" step="any" {...register("cost", { required: "Cost is required" })} placeholder="Enter cost" className="h-12 text-lg" />
              {errors.cost && <p className="text-red-500 text-sm">{errors.cost.message}</p>}
            </div>

            <div className="col-span-2">
              <Label>Upload Image <span className="text-red-500">*</span></Label>

              <Input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  className="h-12 text-lg"
/>


              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg shadow-md" />}
            </div>

            <div className="col-span-2">
              <Button type="submit" className="w-full text-xl h-14 bg-blue-600 hover:bg-blue-700 text-white transition-all">
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
