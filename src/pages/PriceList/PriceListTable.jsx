
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

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

import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmDialog";
import UpdatePriceListDialog from "./UpdatePriceListDialog";
import PropTypes from "prop-types";
export default function PriceListTable({priceList,isLoading, refetch}) {
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedPriceItem, setSelectedPriceItem] = useState(null);


  return (
    <Card className="w-full shadow-md">
  

      <>
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
                {priceList?.map((item) => (
                  <TableRow key={item?._id}>
                    <TableCell>
                      {item?.image ? (
                        <img
                          src={`${import.meta.env.VITE_API}/images/${item?.image}`}
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
                        onClick={() => {
                          setSelectedPriceItem(item);
                          setIsUpdateOpen(true);
                        }}
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
                {priceList?.length === 0 && (
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
      </>

<UpdatePriceListDialog
  open={isUpdateOpen}
  setOpen={setIsUpdateOpen}
  refetch={refetch}
  data={selectedPriceItem}
/>




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

PriceListTable.propTypes = {
  priceList: PropTypes.array,
  isLoading: PropTypes.bool,
  refetch: PropTypes.func,
};