// components/BookingHandler.jsx
import PropTypes from "prop-types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";

const BookingHandler = ({ booking, open, onClose, refetch }) => {
  const axiosCommon = useAxios();

  const updateBooking = useMutation({
    mutationFn: async (updatedData) =>
      axiosCommon.put(`/online-booking/${updatedData._id}`, updatedData),
    onSuccess: () => {
      toast.success("Booking updated!");
      onClose();
      refetch?.();
    },
    onError: () => toast.error("Failed to update booking."),
  });

  const deleteBooking = useMutation({
    mutationFn: async ({ _id }) =>
      axiosCommon.put(`/online-booking/${_id}`, { status: "deleted" }),
    onSuccess: () => {
      toast.success("Booking deleted!");
      onClose();
      refetch?.();
    },
    onError: () => {
      toast.error("Failed to delete booking");
      onClose();
    },
  });

  const handleStatusChange = (e) => {
    const updated = { ...booking, status: e.target.value };
    updateBooking.mutate(updated);
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this booking.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBooking.mutate(booking);
      }
    });
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Booking Details</DialogTitle>
          <DialogDescription>View and update booking status below.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4 text-sm text-gray-700">
          <p><strong>Name:</strong> {booking.name}</p>
          <p><strong>Phone:</strong> {booking.phone}</p>
          <p><strong>Email:</strong> {booking.email}</p>
          <p><strong>Service:</strong> {booking.service}</p>
          <p><strong>Price:</strong> ${booking.price}</p>
          <p><strong>Slot:</strong> {booking.slot}</p>
          <p><strong>Date:</strong> {dayjs(booking.bookingDate).format("MMM D, YYYY")}</p>

          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <select
              defaultValue={booking.status}
              onChange={handleStatusChange}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

BookingHandler.propTypes = {
  booking: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
};

export default BookingHandler;
