import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import RichTextEditor from "@/components/custom/RichTextEditor";

const BlogPost = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [previewImage, setPreviewImage] = useState(null);
const [content, setContent] = useState(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Bold,
      Italic,
      Heading,
      Paragraph,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setContent(editor.getJSON());
    },
  });

  const titleValue = watch("title");
  useEffect(() => {
    if (titleValue && !watch("slug")) {
      setValue("slug", titleValue);
    }
  }, [titleValue, setValue, watch]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("image", data.image[0]);
    formData.append("content", JSON.stringify(content));
    formData.append("seo[title]", data.seoTitle);
    formData.append("seo[description]", data.seoDescription);
    formData.append("seo[keywords]", data.seoKeywords);
    formData.append("seo[canonicalUrl]", data.seoCanonicalUrl);

    console.log("Submitting Blog:", Object.fromEntries(formData.entries()));
    
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Create Blog Post</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input {...register("title", { required: true })} placeholder="Blog title" />
              {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
            </div>

            <div>
              <Label>Slug</Label>
              <Input {...register("slug", { required: true })} placeholder="Blog slug" />
              {errors.slug && <p className="text-red-500 text-sm">Slug is required</p>}
            </div>

            <div>
              <Label>Blog Image</Label>
              <Input type="file" {...register("image", { required: true })} onChange={handleImageChange} />
              {errors.image && <p className="text-red-500 text-sm">Image is required</p>}
              {previewImage && (
                <img src={previewImage} alt="Preview" className="mt-3 h-40 rounded-md object-cover border" />
              )}
            </div>

            <div>
              <Label>Content</Label>
              <div className="border p-3 rounded-md min-h-[200px]">
<RichTextEditor onChange={(data) => setContent(data)} />
              </div>
              {!editor?.getText() && <p className="text-sm text-red-500 mt-1">Content cannot be empty</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">SEO Settings</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>SEO Title</Label>
              <Input {...register("seoTitle")} placeholder="SEO Title" />
            </div>

            <div>
              <Label>SEO Description</Label>
              <Textarea {...register("seoDescription")} placeholder="Meta description..." />
            </div>

            <div>
              <Label>Keywords (comma separated)</Label>
              <Input {...register("seoKeywords")} placeholder="e.g. react, blog, javascript" />
            </div>

            <div>
              <Label>Canonical URL</Label>
              <Input {...register("seoCanonicalUrl")} placeholder="https://yourdomain.com/blog/..." />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full mt-6">
          Publish Blog
        </Button>
      </form>
    </div>
  );
};

export default BlogPost;