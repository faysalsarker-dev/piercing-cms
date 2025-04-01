
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const categories = ["Gold", "Silver", "Diamond", "Platinum"];

export default function AddStock() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [imagePreview, setImagePreview] = useState(null);

  const onSubmit = (data) => {
    console.log("Stock Data:", data);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-3xl shadow-xl rounded-lg p-10 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Add New Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Label>Product Name</Label>
              <Input className="h-12 text-lg" {...register("productName", { required: "Product name is required" })} placeholder="Enter product name" />
              {errors.productName && <p className="text-red-500 text-sm">{errors.productName.message}</p>}
            </div>

            <div className="col-span-2 md:col-span-1">
              <Label>Category</Label>
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Barcode</Label>
              <Input className="h-12 text-lg" {...register("barcode", { required: "Barcode is required" })} placeholder="Enter barcode" />
              {errors.barcode && <p className="text-red-500 text-sm">{errors.barcode.message}</p>}
            </div>

            <div>
              <Label>Weight</Label>
              <Input className="h-12 text-lg" type="number" {...register("weight", { required: "Weight is required" })} placeholder="Enter weight" />
              {errors.weight && <p className="text-red-500 text-sm">{errors.weight.message}</p>}
            </div>

            <div>
              <Label>Production Year</Label>
              <Input className="h-12 text-lg" type="number" {...register("productionYear")} placeholder="Enter production year" />
            </div>

            <div>
              <Label>Image Upload</Label>
              <Input className="h-12 text-lg" type="file" accept="image/*" onChange={handleImageUpload} />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg shadow" />}
            </div>

            <div>
              <Label>Karat</Label>
              <Input className="h-12 text-lg" {...register("karat", { required: "Karat is required" })} placeholder="Enter karat" />
              {errors.karat && <p className="text-red-500 text-sm">{errors.karat.message}</p>}
            </div>

            <div>
              <Label>Bhori</Label>
              <Input className="h-12 text-lg" type="number" {...register("bhori")} placeholder="Enter bhori" />
            </div>

            <div>
              <Label>Tola</Label>
              <Input className="h-12 text-lg" type="number" {...register("tola")} placeholder="Enter tola" />
            </div>

            <div>
              <Label>Roti</Label>
              <Input className="h-12 text-lg" type="number" {...register("roti")} placeholder="Enter roti" />
            </div>

            <div className="col-span-2">
              <Label>Cost</Label>
              <Input className="h-12 text-lg" type="number" {...register("Cost", { required: "Cost is required" })} placeholder="Enter cost" />
              {errors.Cost && <p className="text-red-500 text-sm">{errors.Cost.message}</p>}
            </div>

            <div className="col-span-2">
              <Button type="submit" className="w-full text-xl h-14">Submit</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
