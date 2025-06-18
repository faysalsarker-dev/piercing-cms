import PropTypes from "prop-types";
import dayjs from "dayjs";

import { useState } from "react";

import { Pencil, Trash2 } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";


import BookingDialog from "./BookingDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Button } from "../ui/button";


const BookTable = ({ data = [], total, page, limit, onPageChange ,refetch}) => {
  const totalPages = Math.ceil(total / limit);
 
  const [dataInfo, setDataInfo] = useState({});
 
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

 


  const renderStatusBadge = (status) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        status === "confirmed"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {status}
    </span>
  );

  const renderWeb = (web) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        web === "klippsodermalm"
          ? "bg-orange-100 text-orange-800"
          : "bg-gray-400 text-gray-950"
      }`}
    >
      {web}
    </span>
  );

  const renderBookingInfo = (booking, isMobile = false) => (
    <>
      <div className="font-semibold text-lg flex justify-between items-center"><div>{booking.name}</div><div>{renderWeb(booking?.web)}</div></div>
      <div className="text-sm text-gray-600">{booking?.phone}</div>
      <div className="text-sm">{booking?.email || "-"}</div>
      <div className="text-sm">Service: {booking?.service}</div>
      <div className="text-sm">Price: {booking?.price}</div>
      <div className="text-sm">
        Date: {dayjs(booking?.bookingDate).format("MMM D, YYYY")}
      </div>
      <div className="text-sm">Slot: {booking?.slot}</div>
      <div className="text-sm font-medium">{renderStatusBadge(booking?.status)}</div>
   <Button
                     onClick={() => {
                          setDeleteId(booking?._id);
                          setOpen(true);
                        }}
                
                size="icon" variant="ghost" className="text-red-500">
                  <Trash2 className="w-10 h-10" />
                </Button>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Mobile View */}
      <div className="grid md:hidden gap-4">
        {data?.length > 0 ? (
          data.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-md rounded-lg p-4 space-y-2 border border-gray-200 relative"
            >
              <button
                className="absolute top-2 right-2 text-primary hover:text-primary/80"
                onClick={() => {
                    setDataInfo(booking);
  setBookingDialogOpen(true);
  
                }}
              >
                <Pencil size={18} />
              </button>
              {renderBookingInfo(booking, true)}
            </div>
          ))
        ) : (
          <p className="text-center ">No bookings found.</p>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden bg-white md:block overflow-x-auto rounded-md border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {["Name", "Info","Web", "Service", "Price", "Booking Date", "Slot", "Status", "Edit"].map((head) => (
                <TableHead className='bg-gray-200' key={head}>{head}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.length > 0 ? (
              data?.map((booking) => (
                <TableRow key={booking?._id} className="h-16">
                  <TableCell>{booking?.name}</TableCell>
                  <TableCell>
                    {booking?.phone}
                    <br />
{booking?.email || "-"}

                  </TableCell>
                 
                  <TableCell>{renderWeb(booking?.web)}</TableCell>
                  <TableCell>{booking?.service}</TableCell>
                  <TableCell>{booking?.price}</TableCell>
                  <TableCell>{dayjs(booking?.bookingDate).format("MMM D, YYYY")}</TableCell>
                  <TableCell>{booking?.slot}</TableCell>
                  <TableCell>{renderStatusBadge(booking?.status)}</TableCell>

                  <TableCell className='flex justify-center items-center'>
                    <Button
                    size="icon" variant="ghost"
                    
              onClick={() => {
  setDataInfo(booking);
  setBookingDialogOpen(true);
  
}}>
  <Pencil className="w-4 h-4 text-primary" />
</Button>



  <Button
                     onClick={() => {
                          setDeleteId(booking?._id);
                          setOpen(true);
                        }}
                
                size="icon" variant="ghost" className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>

                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>


      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) onPageChange(page - 1);
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i + 1 === page}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) onPageChange(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

   <DeleteConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        id={deleteId}
        url="/online-booking"
        refetch={refetch}
      />


      <BookingDialog open={bookingDialogOpen} setOpen={setBookingDialogOpen} data={dataInfo} refetch={refetch}/>
      
    </div>
  );
};

BookTable.propTypes = {
  data: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  refetch: PropTypes.func,
};

export default BookTable;