"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import useAxios from "@/hooks/useAxios"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useParams } from "react-router-dom"

export default function UpdateSale() {

    const {id} = useParams()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm()

  const paymentType = watch("paymentType")
  const [date, setDate] = useState(null)
  const axiosSecure = useAxios()

  // Fetching sale data for the update
  const { data: saleInfo } = useQuery({
    queryKey: ["saleInfo", id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/sale/${id}`)
      return response.data.sale
    },
    enabled: !!id,
  })


  console.log(saleInfo);

  useEffect(() => {
    if (saleInfo) {
      setValue("barcode", saleInfo?.product?.barcode || "")
      setValue("clientName", saleInfo?.clientName || "")
      setValue("clientPhone", saleInfo?.clientPhone || "")
      setValue("price", saleInfo?.price || 0)
      setValue("paidAmount", saleInfo?.paidAmount || 0)
      setValue("paymentType", saleInfo?.paymentType || "")
      setValue("dueDate", saleInfo?.dueDate || "")
      setValue("productName", saleInfo?.product?.productName || "")
      setValue("category", saleInfo?.product?.category || "")
      setValue("karat", saleInfo?.product?.karat || "")
      setValue("bhori", saleInfo?.product?.bhori || 0)
      setValue("tola", saleInfo?.product?.tola || 0)
      setValue("roti", saleInfo?.product?.roti || 0)
      setValue("cost", saleInfo?.product?.cost || 0)
    }
  }, [saleInfo, setValue])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.put(`/sale/${id}`, info)
      return data
    },
    onSuccess: () => toast.success("Sale updated successfully."),
    onError: () => toast.error("Failed to update sale."),
  })

  const onSubmit = async (data) => {
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : null;

    const newData = {
      ...data,
      dueDate: formattedDate,
      paidAmount: parseFloat(data.paidAmount),
      price: parseFloat(data.price),
    }

    await mutateAsync(newData)
  }

  return (
    <Card className="p-6 max-w-4xl mx-auto shadow-xl mt-3 mb-5">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Update Sale</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Barcode (disabled for update) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Barcode (বারকোড)</label>
            <Input
              {...register("barcode", { required: "Barcode is required" })}
              placeholder="barcode "
              className="text-lg h-12"
              disabled
            />
            {errors.barcode && <p className="text-red-500 text-xs">{errors.barcode.message}</p>}
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Client Name (ক্লায়েন্ট নাম)</label>
              <Input {...register("clientName", { required: "Client name is required" })} placeholder="Client name (ক্লায়েন্ট নাম)" className="text-lg h-12" />
              {errors.clientName && <p className="text-red-500 text-xs">{errors.clientName.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Client Phone (ক্লায়েন্ট ফোন)</label>
              <Input {...register("clientPhone", { required: "Phone is required" })} placeholder="Phone number (ফোন নম্বর)" className="text-lg h-12" />
              {errors.clientPhone && <p className="text-red-500 text-xs">{errors.clientPhone.message}</p>}
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Price (মূল্য)</label>
            <Input type="number" step="any" {...register("price", { required: "Price is required" })} placeholder="Total Price (মোট মূল্য)" className="text-lg h-12" />
            {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
          </div>

          {/* Payment Type & Date (if EMI) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Payment Type (পেমেন্ট টাইপ)</label>
              <select {...register("paymentType", { required: "Payment type is required" })} className="text-lg h-12 border rounded-md">
                <option value="">Select Payment Type </option>
                <option value="full">Full</option>
                <option value="emi">EMI</option>
              </select>
              {errors.paymentType && <p className="text-red-500 text-xs">{errors.paymentType.message}</p>}
            </div>

            {paymentType === "emi" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">First EMI Payment Date (প্রথম ইএমআই পেমেন্ট তারিখ)</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
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
            )}
          </div>

          {/* Now Paying (if EMI) */}
          {paymentType === "emi" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Now Paying Amount (একখন কত টাকা দিয়েছে)</label>
              <Input type="number" step="any" {...register("paidAmount")} placeholder="Enter current payment (বর্তমানে কত টাকা প্রদান করেছেন)" className="text-lg h-12" />
            </div>
          )}

          {/* Product Details */}
          <h3 className="text-xl font-semibold mt-8 mb-4">Product Details (পণ্য বিবরণ)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Product Name (পণ্যের নাম)</label>
              <Input {...register("productName", { required: "Product name is required" })} placeholder="Product name (পণ্যের নাম)" className="text-lg h-12" disabled />
              {errors.productName && <p className="text-red-500 text-xs">{errors.productName.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Category (শ্রেণী)</label>
              <Input {...register("category")} placeholder="Category (শ্রেণী)" className="text-lg h-12" disabled />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Karat (ক্যারাট)</label>
              <Input {...register("karat", { required: "Karat is required" })} placeholder="Karat (ক্যারাট)" className="text-lg h-12" disabled />
              {errors.karat && <p className="text-red-500 text-xs">{errors.karat.message}</p>}
            </div>
          </div>

          {/* Extra Measurements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Bhori (ভরি)</label>
              <Input type="number" step="any" {...register("bhori")} placeholder="Bhori (ভরি)" className="text-lg h-12" disabled />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Tola (তোলা)</label>
              <Input type="number" step="any" {...register("tola")} placeholder="Tola (তোলা)" className="text-lg h-12" disabled />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Roti (রতি)</label>
              <Input type="number" step="any" {...register("roti")} placeholder="Roti (রতি)" className="text-lg h-12" disabled />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium mb-2">Cost (মূল্য)</label>
              <Input type="number" step="any" {...register("cost")} placeholder="Cost (মূল্য)" className="text-lg h-12" disabled />
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full h-12 mt-6 bg-primary" disabled={isPending}>
            {isPending ? "Updating..." : "Update Sale"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
