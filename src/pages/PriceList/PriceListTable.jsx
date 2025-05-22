"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import useAxios from "@/hooks/useAxios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmDialog";

export default function PriceListTable() {
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const axiosCommon = useAxios();

  const { data: priceList = [], isLoading, refetch } = useQuery({
    queryKey: ["pricelist"],
    queryFn: async () => {
      const res = await axiosCommon.get("/price");
      return res.data;
    },
  });

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Price List</CardTitle>
        <Select defaultValue="all">
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="needles piercing">Needles Piercing</SelectItem>
            <SelectItem value="piercing with gun">Piercing with Gun</SelectItem>
            <SelectItem value="microlidding">Microlidding</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p className="text-center py-6">Loading...</p>
        ) : (
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Web</TableHead>
                  <TableHead>Regular Price</TableHead>
                  <TableHead>Discounted Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceList.map((item) => (
                  <TableRow key={item?._id}>
                    <TableCell>
                      {item?.image ? (
                        <img
                          src={item.image}
                          alt="thumb"
                          className="w-14 h-14 object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-muted-foreground italic">
                          No image
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item?.title}</TableCell>
                    <TableCell className="capitalize">{item?.category}</TableCell>
                    <TableCell className="capitalize">{item?.web}</TableCell>
                    <TableCell className="text-red-500 font-semibold">
                      {item?.regularPrice}
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {item?.discountedPrice}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast("Open edit dialog")}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setDeleteId(item?._id);
                          setOpen(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {priceList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No items in this category.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <DeleteConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        id={deleteId}
        url="/price"
        refetch={refetch}
      />
    </Card>
  );
}
