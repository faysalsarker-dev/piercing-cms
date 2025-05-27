import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";

const CATEGORY_OPTIONS = [
  { value: "needles piercing", label: "Needles Piercing" },
  { value: "piercing with gun", label: "Piercing with Gun" },
  { value: "microlidding", label: "Microlidding" },
];

const WEB_OPTIONS = [
  { value: "piercingsodermalm", label: "Piercing Södermalm" },
  { value: "klippsodermalm", label: "Klip Södermalm" },
  { value: "both", label: "Both" },
];

export default function CreatePriceListDialog() {
  const [imagePreview, setImagePreview] = useState(null);
  const axiosCommon = useAxios();
  const dialogCloseRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      regularPrice: "",
      discountedPrice: "",
      description: "",
      category: "",
      web: "",
      image: null,
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      return await axiosCommon.post("/price", formData);
    },
    onSuccess: () => {
      toast.success("Price list created");
      reset();
      setImagePreview(null);
      dialogCloseRef.current?.click();
    },
    onError: () => {
      toast.error("Failed to create price list");
    },
  });
  
  useEffect(() => {
    if (mutation.isSuccess) {
      dialogCloseRef.current?.click();
    }
  }, [mutation.isSuccess]);
  // Watch image for preview
  const imageFile = watch("image")?.[0];
  // Update preview when image changes
  React.useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("regularPrice", data.regularPrice);
    formData.append("discountedPrice", data.discountedPrice);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("web", data.web);
    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }
    console.log(formData,'formData');
    mutation.mutate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white">+ Add Price Item</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Price List</DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto p-4 rounded-xl shadow-lg bg-white space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Title */}
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  placeholder="e.g. Nose Piercing"
                  autoComplete="off"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              {/* Regular Price */}
              <div className="space-y-1">
                <Label htmlFor="regularPrice">Regular Price</Label>
                <Input
                  type="number"
                  id="regularPrice"
                  {...register("regularPrice", {
                   
                    min: { value: 0, message: "Must be positive" },
                  })}
                  placeholder="e.g. 1000"
                  min={0}
                />
                {errors.regularPrice && (
                  <p className="text-sm text-red-500">
                    {errors.regularPrice.message}
                  </p>
                )}
              </div>
              {/* Discounted Price */}
              <div className="space-y-1">
                <Label htmlFor="discountedPrice">Discounted Price</Label>
                <Input
                  type="number"
                  id="discountedPrice"
                  {...register("discountedPrice", {
                    required: "Discounted price is required",
                    min: { value: 0, message: "Must be positive" },
                  })}
                  placeholder="e.g. 800"
                  min={0}
                />
                {errors.discountedPrice && (
                  <p className="text-sm text-red-500">
                    {errors.discountedPrice.message}
                  </p>
                )}
              </div>
              {/* Description */}
              <div className="md:col-span-3 space-y-1">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="w-full border rounded-md p-2 min-h-[100px]"
                  placeholder="Short description"
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
              {/* Category */}
              <div className="space-y-1">
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue=""
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>
              {/* Web Option */}
              <div className="space-y-1">
                <Label htmlFor="web">Web</Label>
                <Controller
                  name="web"
                  control={control}
                  rules={{ required: "Web type is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue=""
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select web type" />
                      </SelectTrigger>
                      <SelectContent>
                        {WEB_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.web && (
                  <p className="text-sm text-red-500">
                    {errors.web.message}
                  </p>
                )}
              </div>
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Upload Image</Label>
                <Input
                  type="file"
                  id="image"
                  accept="image/*"
                  {...register("image")}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md border shadow"
                  />
                )}
              </div>
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
             
              <button
                ref={dialogCloseRef}
                type="button"
                className="hidden"
                tabIndex={-1}
                aria-hidden="true"
              />
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
