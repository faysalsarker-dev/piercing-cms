import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/custom/RichTextEditor";
import useAxios from "@/hooks/useAxios";

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function CreateBlogPost() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const {
    fields: keywordFields,
    append: appendKeyword,
    remove: removeKeyword,
  } = useFieldArray({
    control,
    name: "keywords",
  });

  const axiosCommon = useAxios();
  const [previewImage, setPreviewImage] = useState(null);
  const description = watch("description");
  const keywords = watch("keywords") || [];




  
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
       const res = await axiosCommon.post("/blogs", data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
     
      return res.data;
    },
    onSuccess: () => {
      toast.success("Blog post created");
      reset();
      setPreviewImage(null);
    },
    onError: () => toast.error("Something went wrong"),
  });




const onSubmit = (data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("slug", slugify(data.title));
  formData.append("content", data.description);

  formData.append("seo[title]", data.seoTitle || data.title);
  formData.append("seo[description]", data.seoDescription || "");
formData.append(
  "seo[keywords]",
  (data.keywords || [])
    .map((k) => k?.value?.trim())
    .filter(Boolean)
    .join(",")
);

  formData.append("seo[ogType]", data.ogType || "article");
  formData.append("seo[robots]", data.robots || "index, follow");

  if (data.image && data.image.length > 0) {
    formData.append("image", data.image[0]);
  }

  console.log("Submitting blog post with data:", data);

  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  mutate(formData);
};

  return (
    <Card className="max-w-4xl mx-auto my-10 shadow-lg">
      <CardHeader>
        <CardTitle>Create Blog Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input placeholder="Blog post title" {...register("title", { required: true })} />
            {errors.title && <p className="text-sm text-red-500 mt-1">Title is required</p>}
          </div>

          {/* Image Upload */}
          <div className="relative w-full">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Uploaded"
                className="w-full rounded-lg"
              />
            ) : (
              <div className="border-dashed flex justify-center items-center border-2 border-gray-300 bg-gray-50 w-full h-64 rounded-lg">
                <h3 className="text-center text-xl font-semibold flex items-center gap-2 text-gray-500">
                  Upload your image
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </h3>
              </div>
            )}
            <Input
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              type="file"
              accept="image/*"
              {...register("image", { required: false })}
              onChange={handleImageChange}
            />
            {errors.image && <p className="text-sm text-red-500 mt-1">Image is required</p>}
          </div>

          {/* Content */}
          <div className="w-full">
           
            <RichTextEditor className='w-full' value={description} onChange={(val) => setValue("description", val)} />
          </div>

          {/* SEO Settings */}
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-lg font-semibold">SEO Settings</h3>

            <div>
              <Label>SEO Title</Label>
              <Input placeholder="SEO title" {...register("seoTitle")} />
            </div>

            <div>
              <Label>SEO Description</Label>
              <Textarea placeholder="Meta description" {...register("seoDescription")} />
            </div>

            <div>
              <Label>SEO Keywords</Label>
              {keywordFields.length === 0 && (
                <p className="text-gray-500 mb-2">
                  No keywords added. Click the button below to add one.
                </p>
              )}
              <div className="max-h-48 overflow-y-auto w-full rounded-md border px-4 py-2">
                {keywordFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center mb-3">
                    <Input
                      {...register(`keywords.${index}.value`, {
                        required: "Keyword is required",
                      })}
                      placeholder="e.g. react"
                      className={errors.keywords?.[index]?.value ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeKeyword(index)}
                      aria-label="Remove keyword"
                      className="text-red-500 hover:text-red-600"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
              {errors.keywords && typeof errors.keywords.message === "string" && (
                <p className="text-red-600 text-sm">{errors.keywords.message}</p>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendKeyword({ value: "" })}
                className="mt-2"
              >
                + Add Keyword
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>OG Type</Label>
                <Input
                  placeholder="article, website..."
                  {...register("ogType")}
                  defaultValue="article"
                />
              </div>
              <div>
                <Label>Robots</Label>
                <Input
                  placeholder="index, follow"
                  {...register("robots")}
                  defaultValue="index, follow"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Publishing..." : "Publish Blog"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
