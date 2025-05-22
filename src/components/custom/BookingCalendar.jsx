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

// Always correct today’s full date
const [currentDate, setCurrentDate] = useState(format(new Date(), "yyyy-MM-dd"));
console.log('formatted',currentDate );



// const today = new Date();
// console.log(format(today, "yyyy-MM-dd"),'today');




  const { data, isLoading } = useQuery({
    queryKey: ["calendar-summary", currentDate],
    queryFn: async () => {
      const res = await axiosCommon.get(`/summaries?date=${currentDate}`);
      return res.data;
    },
  });








 const events = data?.map((item) => ({
    title: `${item.slots.length} Booking(s)`,
    date: item.date,
    extendedProps: { slots: item.slots },
  })) || [];


  // const handleMonthChange = (info) => {
  //   const month = format(info.start, "yyyy-MM-dd");
  //   setCurrentDate(month);
  
  // };

const handleMonthChange = (selectedDate) => {
  // console.log(format(new Date(selectedDate.start), "yyyy-MM-dd"));
  // setCurrentDate(format(new Date(selectedDate.start), "yyyy-MM-dd"));
};


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
            datesSet={handleMonthChange}
          />  
        </>
      )}
    </div>
    );
};

export default BookingCalendar;