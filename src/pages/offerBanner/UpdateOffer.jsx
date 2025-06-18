import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useForm, Controller } from 'react-hook-form';
import RichTextEditor from "@/components/custom/RichTextEditor";
import useAxios from '@/hooks/useAxios';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const pageOptions = [
  { label: "Home", value: "/" },
   { label: "Booking", value: "/booking" },
  { label: "Needle Piercing", value: "/needle-piercing" },
  { label: "Gun Piercing", value: "/gun-piercing" },
  { label: "Microneedling", value: "/microneedling" },
  { label: "Lash Lift", value: "/lash-lift" },
  { label: "Herrfrisyr", value: "/herrfrisyr" },
 
];




export default function UpdateOffer({ open, setOpen, offerData, refetch }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      image: null,
      redirectUrl: '/',
      displayOn: [],
      isActive: true,
    },
  });

  const axiosCommon = useAxios();
  const [previewUrl, setPreviewUrl] = useState(null);
  const displayOn = watch('displayOn');

  useEffect(() => {
    if (offerData) {
      reset({
        title: offerData.title,
        content: offerData.content,
        image: null,
        redirectUrl: offerData.redirectUrl,
        displayOn: offerData.displayOn || [],
        isActive: offerData.isActive,
      });
      if (offerData.imageUrl) {
        setPreviewUrl(`${import.meta.env.VITE_API}/images/${offerData.imageUrl}`);
        
      }
    }
  }, [offerData, reset]);

  const { mutate, isLoading,isPending } = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosCommon.put(`/banners/${offerData._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Offer banner updated!");
      reset();
      setPreviewUrl(null);
      setOpen(false);
      refetch();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Update failed.");
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('image', file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };



  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("redirectUrl", data.redirectUrl);
    formData.append("isActive", data.isActive);
    if (data.image) {
      formData.append("image", data.image);
    }
    data.displayOn.forEach((path, idx) => {
      if (path.trim()) {
        formData.append(`displayOn[${idx}]`, path);
      }
    });
    mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Offer Banner</DialogTitle>
          <DialogDescription>
            Make changes to the offer banner and save.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input placeholder="Special Deal!" {...register('title', { required: true })} />
          </div>

          <div className="space-y-1">
            <Label>Upload New Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="mt-2 h-32 object-contain border rounded-md" />
            )}
          </div>

          <div className="space-y-1">
            <Label>Redirect URL</Label>
            <Input placeholder="/shop" {...register('redirectUrl')} />
          </div>

          {/* <div className="space-y-1">
            <Label>Display On Paths</Label>
            <div className="space-y-2">
              {displayOn.map((path, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={path}
                    onChange={(e) => handlePathChange(e.target.value, index)}
                    placeholder="/home"
                  />
                  <Button type="button" variant="destructive" onClick={() => handleRemovePath(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddPath}>
                Add Path
              </Button>
            </div>
          </div> */}


{/* Display On Pages with Checkbox Selection */}
<div className="space-y-1">
  <Label>Display On Pages</Label>
  <div className="grid grid-cols-2 gap-2">
    {pageOptions.map(({ label, value }) => {
      const isChecked = displayOn.includes(value);
      return (
        <div key={value} className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={value}
            checked={isChecked}
            onChange={() => {
              if (isChecked) {
                setValue('displayOn', displayOn.filter(p => p !== value));
              } else {
                setValue('displayOn', [...displayOn, value]);
              }
            }}
            className="accent-primary w-4 h-4"
          />
          <label htmlFor={value} className="text-sm cursor-pointer">
            {label}
          </label>
        </div>
      );
    })}
  </div>
</div>


          <div className="flex items-center gap-3">
            <Label htmlFor="isActive">Active</Label>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          <div className="space-y-1">
            <Label>Content</Label>
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <RichTextEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

UpdateOffer.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  offerData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
    imageUrl: PropTypes.string,
    redirectUrl: PropTypes.string,
    displayOn: PropTypes.arrayOf(PropTypes.string),
    isActive: PropTypes.bool,
  }),
};
