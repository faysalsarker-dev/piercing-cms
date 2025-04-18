import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import useAxios from "@/hooks/useAxios";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateOrder() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const [date, setDate] = useState(null);
  const { id } = useParams();
  const axiosSecure = useAxios();
const navigate = useNavigate()
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return res.data || [];
    },
  });

  const { data: orderDetails, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (orderDetails) {
      reset(orderDetails);
      setDate(new Date(orderDetails?.deliveryDate));
    }
  }, [orderDetails, reset]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(`/orders/${id}`, {
        ...updatedData,
        deliveryDate: date,
      });
      return res.data;
    },
    onSuccess: () => {
      navigate(-1)
      toast.success("Order updated successfully!");
    },
    onError: () => toast.error("Failed to update order."),
  });

  const onSubmit = async (data) => {
    if (!date) return toast.error("Please select a delivery date");
    await mutateAsync(data);
  };

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-5xl shadow-lg p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            Update Order #{orderDetails?.orderNumber}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="flex flex-col gap-1">
              <Label>Client Name</Label>
              <Input {...register("clientName", { required: true })} />
              {errors.clientName && <p className="text-red-500 text-sm">Client name is required</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Client Phone</Label>
              <Input {...register("clientPhone", { required: true })} />
              {errors.clientPhone && <p className="text-red-500 text-sm">Phone number is required</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Category</Label>
              <Select
                value={watch("category") || ""}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat._id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm">Category is required</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Product Name</Label>
              <Input {...register("productName")} />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Bhori</Label>
              <Input type="number" step="any" {...register("bhori")} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Ana</Label>
              <Input type="number" step="any" {...register("ana")} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Roti</Label>
              <Input type="number" step="any" {...register("roti")} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Point</Label>
              <Input type="number" step="any" {...register("point")} />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Cost</Label>
              <Input type="number" step="any" {...register("cost", { required: true })} />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Advance Amount (আগে কত টাকা দিয়েছে)</Label>
              <Input type="number" step="any" {...register("advancePaid")} />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Due (বাকি)</Label>
              <Input type="number" step="any" {...register("due")} />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Now Paying Amount (আজকে কত টাকা দিবে)</Label>
              <Input type="number" step="any" {...register("todaysPaidAmount")} />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Delivery Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Status</Label>
              <Select
                value={watch("status") || "pending"}
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Delivery Status</Label>
              <Select
                value={watch("deliveryStatus") || "not-delivered"}
                onValueChange={(value) => setValue("deliveryStatus", value)}
              >
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Select delivery status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-delivered">Not Delivered</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Notes</Label>
              <Input {...register("notes")} />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" className="w-full text-xl h-14 bg-primary text-white">
                {isPending ? "Updating..." : "Update Order"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
