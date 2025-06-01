import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import useAxios from "@/hooks/useAxios";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";


export default function BookingDialog({ open, setOpen, data }) {
  const axiosCommon = useAxios();

  const [status, setStatus] = useState(data?.status || "");

 
  useEffect(() => {
    setStatus(data?.status || "");
  }, [data]);

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus) => {
      const res = await axiosCommon.put(`/online-booking/${data._id}`, { status: newStatus });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Updated!", "Status has been updated successfully.", "success");
    },
    onError: (error) => {
      toast.error("Error", error?.response?.data?.message || "Something went wrong", "error");
    },
  });



  const toggleActiveCancel = () => {
    setOpen(false);
    const newStatus = status === "cancelled" ? "confirmed" : "cancelled";
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${newStatus === "cancelled" ? "cancel" : "reactivate"} this booking.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f766e",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate(newStatus);
      }
    });
  };

  return (
<>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex justify-start items-center">
                Booking Details
             
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <p>
                  <strong>Name:</strong> {data?.name || "N/A"}
                </p>
              </div>
              <p>
                <strong>Email:</strong> {data?.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {data?.phone || "N/A"}
              </p>
              <p>
                <strong>Service:</strong> {data?.service || "N/A"}
              </p>
              <p>
                <strong>Price:</strong> ${data?.price ?? "N/A"}
              </p>
              <p>
                <strong>Booking Date:</strong> {data?.bookingDate || "N/A"}
              </p>
              <p>
                <strong>Slot:</strong> {data?.slot || "N/A"}
              </p>
    
              <div className="pt-2 flex justify-between items-center">
                <Badge
                  className={
                    status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  Status: {status || "N/A"}
                </Badge>
          
              </div>
    
              <div className="mt-4 pt-4 border-t flex justify-center">
                <Button
                  variant="secondary"
                  onClick={toggleActiveCancel}
                  className={status === "confirmed" ? "bg-red-700 text-white hover:bg-red-500 hover:text-white" : "bg-green-700 text-white hover:bg-green-500 hover:text-white"}
                  
                >
                  {updateStatusMutation.isLoading
                    ? "Updating..."
                    : status === "cancelled"
                    ? "Mark as Active"
                    : "Cancel Booking"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    
    

    
</>


  );
}

BookingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    service: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bookingDate: PropTypes.string,
    slot: PropTypes.string,
    status: PropTypes.string,
  }),
};

BookingDialog.defaultProps = {
  data: {},
};
