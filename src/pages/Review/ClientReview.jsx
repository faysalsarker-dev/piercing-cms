import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import Rating from "react-rating";
import { FaQuoteLeft, FaRegStar, FaStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useAxios from "@/hooks/useAxios";

const ClientReview = () => {
  const axiosCommon = useAxios();
  const { register, handleSubmit, reset } = useForm();
  const [open, setOpen] = React.useState(false);

  const {
    data: testimonials,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["review"],
    queryFn: async () => {
      const { data } = await axiosCommon.get(`/review`);
      return data;
    },
  });



  const { mutateAsync: addReview, isPending } = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosCommon.post(`/review`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Review added successfully!", "success");
      reset();
      refetch();
      setOpen(false);
    },
    onError: () => {
      Swal.fire("Error", "Something went wrong!", "error");
    },
  });

  const onSubmit = async (info) => {
    const formData = new FormData();
    formData.append("name", info.name);
    formData.append("review", info.review);
    formData.append("rating", info.rating);
    if (info.image && info.image.length > 0) {
      formData.append("image", info.image[0]);
    }
    await addReview(formData);
  };

  const { mutateAsync: onDelete } = useMutation({
    mutationFn: async (id) => {
      await axiosCommon.delete(`/review/${id}`);
    },
    onSuccess: () => {
      refetch();
      Swal.fire("Deleted", "Review deleted successfully!", "success");
    },
    onError: () => {
      Swal.fire("Error", "Could not delete the review!", "error");
    },
  });

  if (isLoading) return <div className="h-screen flex justify-center items-center">loading....</div>;
  if (error) return <div>Error loading reviews!</div>;

  return (
    <div className="min-h-screen p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Client Reviews</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Add Review</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Submit Your Review</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input {...register("name", { required: true })} placeholder="Your Name" />
              <Textarea {...register("review", { required: true })} placeholder="Write your review..." />
              <Input type="number" min="0" max="5" step="0.1" {...register("rating", { required: true })} placeholder="Rating (0-5)" />
              <Input type="file" {...register("image")} />
              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={isPending} variant="success">Submit</Button>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials?.map((t) => (
          <Card key={t._id} className="relative">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 text-red-500 hover:bg-red-50"
              onClick={() => {
                Swal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to revert this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#d33",
                  cancelButtonColor: "#3085d6",
                  confirmButtonText: "Yes, delete it!",
                }).then((result) => {
                  if (result.isConfirmed) onDelete(t._id);
                });
              }}
            >
              <MdDelete className="text-xl" />
            </Button>
            <CardContent className="flex flex-col items-center p-6 space-y-4">
              <FaQuoteLeft className="text-primary text-3xl" />
              <p className="text-center italic text-muted-foreground">{t.review}</p>
              <img
                src={t.image}
                alt={t.name}
                className="w-16 h-16 rounded-full border-2 border-primary"
              />
              <h4 className="font-semibold text-lg">{t.name}</h4>
              <div className="text-yellow-500">
                <Rating
                  initialRating={t.rating}
                  emptySymbol={<FaRegStar />}
                  fullSymbol={<FaStar />}
                  readonly
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientReview;
