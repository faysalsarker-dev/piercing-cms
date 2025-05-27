import { useEffect, useState } from "react";
import { useFieldArray, useForm ,Controller} from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
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
import { ScrollArea } from "@/components/ui/scroll-area";

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function UpdateBlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const axiosCommon = useAxios();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      seoTitle: "",
      seoDescription: "",
      ogType: "article",
      robots: "index, follow",
keywords: [{ value: "" }],
      description: "",
    },
  });
const {
  fields,
  append,
  remove,
} = useFieldArray({
  control,
  name: "keywords",
});


  const [previewImage, setPreviewImage] = useState(null);
  const [editorContent, setEditorContent] = useState("");

  // Fetch existing blog post
  const { data: blogData, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const res = await axiosCommon.get(`/blogs/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });

useEffect(() => {
  if (blogData) {
    const description = blogData?.content || "";

   
       const keywordsArray = Array.isArray(blogData.seo?.keywords)
      ? blogData.seo.keywords.join(",").split(",")
      : (blogData.seo?.keywords || "").split(",");

    const keywords = keywordsArray.map((keyword) => ({
      value: keyword.trim(),
    }));

    reset({
      title: blogData.title,
      seoTitle: blogData.seo?.title || "",
      seoDescription: blogData.seo?.description || "",
      keywords,
      ogType: blogData.seo?.ogType || "article",
      robots: blogData.seo?.robots || "index, follow",
      description,
    });

    setEditorContent(description);
    setPreviewImage(`${import.meta.env.VITE_API}/images/${blogData.image}`);
  }
}, [blogData, reset]);


  // Update blog post mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosCommon.put(`/blogs/${slug}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Blog post updated");
      navigate("/blogs-list");
    },
    onError: () => toast.error("Update failed"),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("slug", slugify(data.title));
    formData.append("content", editorContent);

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

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    mutate(formData);
  };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  return (
    <Card className="max-w-4xl mx-auto my-10 shadow-lg">
      <CardHeader>
        <CardTitle>Update Blog Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input placeholder="Blog title" {...register("title", { required: true })} />
            {errors.title && <p className="text-sm text-red-500 mt-1">Title is required</p>}
          </div>

          {/* Image Preview */}
          <div className="relative w-full">
            {previewImage ? (
              <img src={previewImage} alt="Uploaded" className="w-full rounded-lg" />
            ) : (
              <div className="border-dashed flex justify-center items-center border-2 border-gray-300 bg-gray-50 w-full h-64 rounded-lg">
                <h3 className="text-center text-xl font-semibold flex items-center gap-2 text-gray-500">
                  Upload your image
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </h3>
              </div>
            )}
            <Input
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              type="file"
              accept="image/*"
              {...register("image")}
              onChange={handleImageChange}
            />
          </div>

          {/* RichTextEditor */}
          <div>
            <Label>Content</Label>
            <RichTextEditor
              className="w-full"
              value={editorContent || ""}
              onChange={(val) => {
                setEditorContent(val);
                setValue("description", val); 
              }}
            />
          </div>

          {/* SEO Section */}
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



<div className="space-y-2">
  <Label>SEO Keywords</Label>

  <ScrollArea className="h-48 rounded-md border px-2 py-1">
    <div className="space-y-2 pr-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 items-center">
          <Controller
            control={control}
            name={`keywords.${index}.value`}
            render={({ field }) => (
              <Input {...field} placeholder="e.g. marketing" />
            )}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => remove(index)}
          >
            ✕
          </Button>
        </div>
      ))}
    </div>
  </ScrollArea>

  <Button
    type="button"
    variant="outline"
    onClick={() => append({ value: "" })}
  >
    + Add Keyword
  </Button>
</div>






            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>OG Type</Label>
                <Input placeholder="article, website..." {...register("ogType")} />
              </div>
              <div>
                <Label>Robots</Label>
                <Input placeholder="index, follow" {...register("robots")} />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Updating..." : "Update Blog"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
