

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import RichTextEditor from '@/components/custom/RichTextEditor';

const BlogPost = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [previewImage, setPreviewImage] = useState(null);
  const [content, setContent] = useState(null);

  const titleValue = watch('title');
  const slugValue = watch('slug');

  // Automatically set slug from title if slug is empty
  useEffect(() => {
    if (titleValue && !slugValue) {
      setValue('slug', titleValue);
    }
  }, [titleValue, slugValue, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    if (!content || !content.content?.length) {
      alert('Content cannot be empty');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('slug', data.slug);
    formData.append('image', data.image[0]);
    formData.append('content', JSON.stringify(content));
    formData.append('seo[title]', data.seoTitle || '');
    formData.append('seo[description]', data.seoDescription || '');
    formData.append('seo[keywords]', data.seoKeywords || '');
    formData.append('seo[canonicalUrl]', data.seoCanonicalUrl || '');

    console.log('Submitting Blog:', Object.fromEntries(formData.entries()));
    // Submit formData to API here
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Create Blog Post</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input {...register('title', { required: 'Title is required' })} placeholder="Blog title" />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div>
              <Label>Slug</Label>
              <Input {...register('slug', { required: 'Slug is required' })} placeholder="Blog slug" />
              {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
            </div>

            <div>
              <Label>Blog Image</Label>
              <Input type="file" {...register('image', { required: 'Image is required' })} onChange={handleImageChange} />
              {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-3 h-40 rounded-md object-cover border"
                />
              )}
            </div>

            <div>
              <Label>Content</Label>
              <div className="border p-3 rounded-md min-h-[200px]">
                <RichTextEditor onChange={(data) => setContent(data)} />
              </div>
              {!content?.content?.length && (
                <p className="text-sm text-red-500 mt-1">Content cannot be empty</p>
              )}
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
              <Input {...register('seoTitle')} placeholder="SEO Title" />
            </div>

            <div>
              <Label>SEO Description</Label>
              <Textarea {...register('seoDescription')} placeholder="Meta description..." />
            </div>

            <div>
              <Label>Keywords (comma separated)</Label>
              <Input {...register('seoKeywords')} placeholder="e.g. react, blog, javascript" />
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
