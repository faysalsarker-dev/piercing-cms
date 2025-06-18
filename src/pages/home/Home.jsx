import { useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { format } from "date-fns";
import BookingCalendar from "@/components/custom/BookingCalendar";
import { Button } from "@/components/ui/button";
import { Copy, Globe, X } from "lucide-react";
import BookingDialog from "@/components/custom/BookingDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [data, setData] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);




  const handleEventClick = (info) => {
    setSelectedDate(info.event.startStr);
    setSelectedSlots(info.event.extendedProps.slots);
    setDrawerOpen(true);
  };

  const getFormattedDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "EEEE, MMMM d, yyyy");
    } catch {
      return "Invalid Date";
    }
  };


 const handleCopyEmail = (email) => {
    if (email) {
      navigator.clipboard.writeText(email);
      toast.success("copied to clipboard");
    }
  };

const statusColor = {
  
  confirmed: "bg-green-600",
  canceled: "bg-red-500",
};

  return (
    <div className="p-4">
      {/* Calendar */}
      <BookingCalendar handleEventClick={handleEventClick} />

      {/* Booking Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent
          side="right"
          className="w-full max-w-md h-screen bg-white border-l border-border shadow-xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-muted">
            <h2 className="text-lg font-semibold text-primary">Booking Info</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDrawerOpen(false)}
              className="text-muted-foreground hover:text-primary"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content with scroll */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-gray-700">
            <div><strong>Date:</strong> {getFormattedDate(selectedDate)}</div>

            {selectedSlots.length > 0 ? (
              selectedSlots.map((slot, idx) => (
                <Card key={idx} className="bg-muted/30 backdrop-blur-md border rounded-xl shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {slot?.clientDetails?.name || "Unnamed Client"}
          </CardTitle>
          {slot?.clientDetails?.web && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Globe className="h-4 w-4" /> Web
            </Badge>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          {slot?.clientDetails?.status && (
            <Badge
              className={`${statusColor[slot?.clientDetails.status?.toLowerCase()] || "bg-gray-500"} text-white capitalize`}
            >
              {slot?.clientDetails.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div><strong>Email:</strong> {slot?.clientDetails?.email || "N/A"}
          {slot?.clientDetails?.email && (
            <Button
              size="icon"
              variant="ghost"
              className="ml-2"
              onClick={()=>handleCopyEmail(slot?.clientDetails?.email)}
              title="Copy Email"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div><strong>Phone:</strong> {slot?.clientDetails?.phone || "N/A"}
         {slot?.clientDetails?.email && (
            <Button
              size="icon"
              variant="ghost"
              className="ml-2"
              onClick={()=>handleCopyEmail(slot?.clientDetails?.phone)}
              title="Copy Email"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div><strong>Service:</strong> {slot?.clientDetails?.service || "N/A"}</div>
        <div><strong>Slot:</strong> {slot?.time || "N/A"}</div>
        <div><strong>Price:</strong> {slot?.clientDetails?.price || "N/A"}</div>

        <div className="pt-4 flex justify-end">
          <Button
            size="sm"
            onClick={() => {
              setData(slot?.clientDetails);
              setBookingDialogOpen(true);
              setDrawerOpen(false);
            }}
          >
            Edit Booking
          </Button>
        </div>
      </CardContent>
    </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No bookings for this date.</p>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Booking Edit Dialog */}
      <BookingDialog
        open={bookingDialogOpen}
        setOpen={setBookingDialogOpen}
        data={data}
      />





    </div>
  );
}
