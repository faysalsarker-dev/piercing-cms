import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import useAxios from "@/hooks/useAxios";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function AddOrder() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [date, setDate] = useState(null);

  const axiosSecure = useAxios();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return res.data || [];
    },
  });
  const { data: order_number } = useQuery({
    queryKey: ["order-number"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders/order-number");
      return res.data || [];
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (orderData) => {
      const { data } = await axiosSecure.post("/orders", orderData);
      return data;
    },
    onSuccess: () => {
      toast.success("Order added successfully!");
      reset();
      setDate(null);
    },
    onError: () => toast.error("Failed to add order."),
  });

  const onSubmit = async (data) => {
    if (!date) {
      return toast.error("Please select a delivery date");
    }
    const orderData = {
      ...data,
      deliveryDate: date,
      orderNumber:order_number
    };
    await mutateAsync(orderData);
  };

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-5xl shadow-lg p-6">
      <CardHeader className="flex justify-between">
  <div>
    <CardTitle className="text-3xl font-semibold">Add New Order</CardTitle>
  </div>
  <div className="text-right">
    <p className="text-muted-foreground text-sm font-medium">Order Number (অর্ডার নাম্বার)</p>
    <CardTitle className="text-2xl font-bold text-primary">#{order_number || 0}</CardTitle>
  </div>
</CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Client Name */}
            <div className="flex flex-col gap-1">
              <Label>Client Name (গ্রাহকের নাম) <span className="text-red-500">*</span></Label>
              <Input
                {...register("clientName", { required: "Client name is required" })}
                placeholder="Enter client name"
                className="h-12 text-lg"
              />
              {errors.clientName && <p className="text-sm text-red-500">{errors.clientName.message}</p>}
            </div>

            {/* Client Phone */}
            <div className="flex flex-col gap-1">
              <Label>Client Phone (ফোন নম্বর) <span className="text-red-500">*</span></Label>
              <Input
                {...register("clientPhone", { required: "Phone number is required" })}
                placeholder="Enter client phone"
                className="h-12 text-lg"
              />
              {errors.clientPhone && <p className="text-sm text-red-500">{errors.clientPhone.message}</p>}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <Label>Category (বিভাগ) <span className="text-red-500">*</span></Label>
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
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            {/* Product Name */}
            <div className="flex flex-col gap-1">
              <Label>Product Name (পণ্যের নাম)  <span className="text-red-500">*</span></Label>
              <Input
                {...register("productName")}
                placeholder="Enter product name"
                className="h-12 text-lg"
              />
            </div>

            {/* Weight */}
            <div className="flex flex-col gap-1">
              <Label>Bhori (ভরি)  <span className="text-red-500">*</span></Label>
              <Input type="number" step="any" min="0" {...register("bhori")} className="h-12 text-lg" />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Ana (আনা)  <span className="text-red-500">*</span></Label>
              <Input type="number" step="any" min="0" {...register("ana")} className="h-12 text-lg" />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Roti (রতি)  <span className="text-red-500">*</span></Label>
              <Input type="number" step="any" min="0" {...register("roti")} className="h-12 text-lg" />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Point (পয়েন্ট)  <span className="text-red-500">*</span></Label>
              <Input type="number" step="any" min="0" {...register("point")} className="h-12 text-lg" />
            </div>

            {/* Cost */}
            <div className="flex flex-col gap-1">
              <Label>Cost (মোট খরচ)  <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                step="any"
                min="0"
                {...register("cost", { required: "Cost is required" })}
                className="h-12 text-lg"
              />
              {errors.cost && <p className="text-sm text-red-500">{errors.cost.message}</p>}
            </div>

            {/* Advance Paid */}
            <div className="flex flex-col gap-1">
              <Label>Advance Paid (অগ্রিম প্রদান)  <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                step="any"
                min="0"
                defaultValue={0}
                {...register("advancePaid")}
                className="h-12 text-lg"
              />
            </div>

            {/* Delivery Date */}
            <div className="flex flex-col gap-2">
              <Label>Delivery Date (ডেলিভারির তারিখ)  <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full h-12 justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date (তারিখ নির্বাচন করুন)</span>}
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

            {/* Status */}
            <div className="flex flex-col gap-1">
              <Label>Status (অবস্থা)  <span className="text-red-500">*</span></Label>
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
                </SelectContent>
              </Select>
            </div>

            {/* Delivery Status */}
            <div className="flex flex-col gap-1">
              <Label>Delivery Status (ডেলিভারির অবস্থা)  <span className="text-red-500">*</span></Label>
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

            {/* Notes */}
            <div className="flex flex-col gap-1">
              <Label>Notes (মন্তব্য)  <span className="text-red-500">*</span></Label>
              <Input
                {...register("notes")}
                placeholder="Enter any notes..."
                className="h-12 text-lg"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full text-xl h-14 bg-primary text-white"
                disabled={isPending}
              >
                {isPending ? "Submitting..." : "Submit Order"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}