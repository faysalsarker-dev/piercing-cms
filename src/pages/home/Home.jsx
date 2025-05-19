import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import BookingCalendar from "@/components/custom/BookingCalendar";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEventClick = (info) => {
    setSelectedDate(info.event.startStr);
    setSelectedSlots(info.event.extendedProps.slots);
    setDialogOpen(true);
  };

  const getFormattedDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "EEEE, MMMM d, yyyy");
    } catch (error) {
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
                <div
                  key={idx}
                  className="bg-muted/40 rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow transition"
                >
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold text-primary">Time:</span>{" "}
                    {slot.time}
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold text-primary">Name:</span>{" "}
                    {slot.user?.name || "Unknown"}
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold text-primary">Phone:</span>{" "}
                    {slot.user?.phone || "N/A"}
                  </div>
                </div>
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

   
    </div>
  );
}
