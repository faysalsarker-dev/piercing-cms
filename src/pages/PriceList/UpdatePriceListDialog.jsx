import {
  Dialog,
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
import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import PropTypes from "prop-types";

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

export default function UpdatePriceListDialog({ open, setOpen, refetch, data }) {
  const [imagePreview, setImagePreview] = useState(data?.image || null);
  const axiosCommon = useAxios();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: data?.title || "",
      regularPrice: data?.regularPrice || "",
      discountedPrice: data?.discountedPrice || "",
      description: data?.description || "",
      category: data?.category || "",
      web: data?.web || "",
      image: null,
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        regularPrice: data.regularPrice,
        discountedPrice: data.discountedPrice,
        description: data.description,
        category: data.category,
        web: data.web,
        image: null,
      });
                               

      setImagePreview(`${import.meta.env.VITE_API}/images/${data?.image}`);
    }
  }, [data, reset]);

  const imageFile = watch("image")?.[0];

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      return await axiosCommon.put(`/price/${data._id}`, formData);
    },
    onSuccess: () => {
      toast.success("Price list updated");
      setOpen(false);
      refetch();
    },
    onError: () => {
      toast.error("Failed to update price list");
    },
  });

  const onSubmit = (formDataData) => {
    const formData = new FormData();
    formData.append("title", formDataData.title);
    formData.append("regularPrice", formDataData.regularPrice);
    formData.append("discountedPrice", formDataData.discountedPrice);
    formData.append("description", formDataData.description);
    formData.append("category", formDataData.category);
    formData.append("web", formDataData.web);
    if (formDataData.image?.[0]) {
      formData.append("image", formDataData.image[0]);
    }
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Update Price List</DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto p-4 rounded-xl shadow-lg bg-white space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  placeholder="e.g. Nose Piercing"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="regularPrice">Regular Price</Label>
                <Input
                  id="regularPrice"
                  {...register("regularPrice", {
                    min: { value: 0, message: "Must be positive" },
                  })}
                  placeholder="e.g. 1000"
                />
                {errors.regularPrice && (
                  <p className="text-sm text-red-500">
                    {errors.regularPrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="discountedPrice">Discounted Price</Label>
                <Input
                  id="discountedPrice"
                  {...register("discountedPrice", {
                    required: "Discounted price is required",
                    min: { value: 0, message: "Must be positive" },
                  })}
                  placeholder="e.g. 800"
                />
                {errors.discountedPrice && (
                  <p className="text-sm text-red-500">
                    {errors.discountedPrice.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-3 space-y-1">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  {...register("description")}
                  className="w-full border rounded-md p-2 min-h-[100px]"
                  placeholder="Short description"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="web">Web</Label>
                <Controller
                  name="web"
                  control={control}
                  rules={{ required: "Web type is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  <p className="text-sm text-red-500">{errors.web.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Update Image</Label>
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

            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

UpdatePriceListDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
