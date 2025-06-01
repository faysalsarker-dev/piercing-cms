import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import BookingCalendar from "@/components/custom/BookingCalendar";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import BookingDialog from "@/components/custom/BookingDialog";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [data, setData] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  




  const handleEventClick = (info) => {
    setSelectedDate(info.event.startStr);
    setSelectedSlots(info.event.extendedProps.slots);
    setDialogOpen(true);
  };

  const getFormattedDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "EEEE, MMMM d, yyyy");
    } catch  {
      return "Invalid Date";
    }
  };


 
  return (
    <div className="p-4">
         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
     <DialogContent
  className="w-full max-w-lg p-6 rounded-2xl shadow-xl border bg-white  
             top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed"
>

      

          {/* Title */}
          <h2 className="text-2xl font-semibold text-center text-primary mb-3">
            Booking Details
          </h2>

          {/* Formatted Date */}
          <div className="text-center text-base font-medium text-gray-600 mb-6">
            {getFormattedDate(selectedDate)}
          </div>

          {/* Booking List */}
          {selectedSlots.length > 0 ? (
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted-foreground/30">
              {selectedSlots.map((slot, idx) => (
                
               <Card
        key={idx}
        className="transition-all hover:shadow-md border border-border shadow-sm rounded-2xl bg-muted/40"
      >
  <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg text-primary">Booking Details</CardTitle>
            <p className="text-sm text-muted-foreground">Time: {slot.time}</p>
          </div>
     <button onClick={() => {
  setData(slot.clientDetails);
  setBookingDialogOpen(true);
  setDialogOpen(false);
}}>
  <Pencil className="w-4 h-4 text-primary" />
</button>

          

        </CardHeader>

        <Separator />

        <CardContent className="pt-4 space-y-3 text-sm text-gray-700">
          <div>
            <span className="font-medium text-primary">Name:</span>{" "}
            {slot?.clientDetails?.name || "Unknown"}
          </div>
          <div>
            <span className="font-medium text-primary">Phone:</span>{" "}
            {slot?.clientDetails?.phone || "N/A"}
          </div>
          <div>
            <span className="font-medium text-primary">Service:</span>{" "}
            {slot?.clientDetails?.service || "N/A"}
          </div>
          <div>
            <span className="font-medium text-primary">Price:</span>{" "}
            {slot?.clientDetails?.price || "N/A"}
          </div>
          <div className="pt-2">
            <Badge className={slot?.clientDetails?.status === "confirmed"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"}>
              Status: {slot?.clientDetails?.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-sm">
              No bookings for this date.
            </p>
          )}
        </DialogContent>
      </Dialog>
      <BookingCalendar handleEventClick={handleEventClick} />

   
<BookingDialog open={bookingDialogOpen} setOpen={setBookingDialogOpen} data={data} />
    </div>
  );
}
