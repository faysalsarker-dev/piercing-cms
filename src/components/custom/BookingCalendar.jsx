/* eslint-disable react/prop-types */
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { Skeleton } from "../ui/skeleton";



const BookingCalendar = ({handleEventClick}) => {
  const axiosCommon = useAxios();







  const { data, isLoading } = useQuery({
    queryKey: ["calendar-summary"],
    queryFn: async () => {
      const res = await axiosCommon.get(`/summaries`);
      return res.data;
    },
  });








 const events = data?.map((item) => ({
    title: `${item.slots.length} Booking(s)`,
    date: item.date,
    extendedProps: { slots: item.slots },
  })) || [];





  const eventDates = new Set(
    events.map((event) => format(new Date(event.date), "yyyy-MM-dd"))
  );

  const onDayCellDidMount=(info) => {
      const dateStr = format(info?.date, 'yyyy-MM-dd');
      if (eventDates.has(dateStr)) {

        info.el.style.backgroundColor = '#d1fae5'; 
      } else {
        info.el.style.backgroundColor = '#ffffff'; 
      }
    }
  


    return (
        <div className="p-4">
      {isLoading ? (
        <Skeleton className="w-full h-[500px]" />
      ) : (
        <>
       

           <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
  dayCellDidMount={onDayCellDidMount}
            height="auto"
          />  
        </>
      )}
    </div>
    );
};

export default BookingCalendar;