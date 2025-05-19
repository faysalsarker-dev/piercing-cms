/* eslint-disable react/prop-types */
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";



const BookingCalendar = ({handleEventClick}) => {
  const axiosCommon = useAxios();

const [currentMonth, setCurrentMonth] = useState(new Date());

console.log('formatted', format(currentMonth, "EEEE, MMMM d, yyyy"));



const today = new Date();
console.log(format(today, "EEEE, MMMM d, yyyy"),'today');




  const { data, isLoading } = useQuery({
    queryKey: ["calendar-summary", currentMonth],
    queryFn: async () => {
      const res = await axiosCommon.get(`/summaries?month=2025-05`);
      return res.data;
    },
  });








 const events = data?.map((item) => ({
    title: `${item.slots.length} Booking(s)`,
    date: item.date,
    extendedProps: { slots: item.slots },
  })) || [];


  const handleMonthChange = (info) => {
    const month = format(info.start, "yyyy-MM");
    setCurrentMonth(month);
  
  };

  const eventDates = new Set(
    events.map((event) => format(new Date(event.date), "yyyy-MM-dd"))
  );

  const onDayCellDidMount=(info) => {
      const dateStr = format(info?.date, 'yyyy-MM-dd');
      if (eventDates.has(dateStr)) {

        info.el.style.backgroundColor = '#d1fae5'; 
      } else {
        info.el.style.backgroundColor = '#f3f4f6'; 
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
            datesSet={handleMonthChange}
          />  
        </>
      )}
    </div>
    );
};

export default BookingCalendar;