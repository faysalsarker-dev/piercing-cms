import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useForm, useFieldArray, Controller } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

import toast from 'react-hot-toast';
import useAxios from '@/hooks/useAxios';
import { ScrollArea } from '@radix-ui/react-scroll-area';

const MySwal = withReactContent(Swal);

const defaultMessage = "It's an off day. Please choose another date.";

const OverrideCalendar = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const axiosCommon = useAxios();
const lastInputRef = useRef(null);



  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: '',
      isDayOff: false,
      message: defaultMessage,
      slots: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'slots',
  });

  const watchIsDayOff = watch('isDayOff');

  // Fetch overrides
  const { data: overrides = [], isLoading, refetch } = useQuery({
    queryKey: ['override-schedules'],
    queryFn: async () => {
      const res = await axiosCommon.get('/override-schedules');
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  // Create or update override
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editing) {
        return axiosCommon.put(`/override-schedules/${data.date}`, data);
      }
      return axiosCommon.post('/override-schedules', data);
    },
    onSuccess: () => {
      toast.success(editing ? 'Override updated!' : 'Override created!');
      setOpen(false);
      reset();
      setEditing(false);
      refetch();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Failed to save override';
      toast.error(message);
    },
  });

  // Delete override
  const deleteMutation = useMutation({
    mutationFn: async (date) => axiosCommon.delete(`/override-schedules/${date}`),
    onSuccess: () => {
      toast.success('Override deleted!');
      setOpen(false);
      reset();
      setEditing(false);
      refetch();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Failed to delete override';
      toast.error(message);
    },
  });

  // Handle calendar date click
  const handleDateClick = (arg) => {
    const formattedDate = format(arg.date, 'yyyy-MM-dd');
    setSelectedDate(formattedDate);

    const existing = overrides.find((o) => o?.date === formattedDate);
    if (existing) {
      reset(existing);
      setEditing(true);
    } else {
      reset({
        date: formattedDate,
        isDayOff: false,
        message: defaultMessage,
        slots: [],
      });
      setEditing(false);
    }
    setOpen(true);
  };

  // Handle delete with SweetAlert confirm
  const handleDelete = () => {
        setOpen(false);

    MySwal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the override schedule!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626', // red
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(selectedDate);
      }
    });
  };

  // Map overrides to FullCalendar events, with slots count in title and tooltip
 const events = overrides.flatMap((o) => {
  if (o.isDayOff) {
    return [{
      title: 'Day Off',
      start: o.date,
      allDay: true,
      backgroundColor: '#f87171',
      borderColor: '#f87171',
    }];
  }
  return o.slots.map((slot) => ({
    title: slot,
    start: o.date,
    allDay: true,
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  }));
});


  // Custom event render to show tooltip with slots details
  const eventDidMount = (info) => {
    const { slots, message } = info.event.extendedProps;
    let tooltipContent = '';
    if (info.event.title === 'Day Off') {
      tooltipContent = message || defaultMessage;
    } else if (slots?.length > 0) {
      tooltipContent = `Slots:\n${slots.map((s) => `• ${s}`).join('\n')}`;
    }
    if (tooltipContent) {
      info.el.setAttribute('title', tooltipContent);
      info.el.style.cursor = 'help';
    }
  };



const handleEventClick = (info) => {
  const clickedDate = format(info.event.start, 'yyyy-MM-dd');
  const existing = overrides.find((o) => o.date === clickedDate);
  if (existing) {
    reset(existing);
    setEditing(true);
    setSelectedDate(clickedDate);
    setOpen(true);
  }
};


useEffect(() => {
  if (lastInputRef.current) {
    lastInputRef.current.focus();
  }
}, [fields?.length]); 

const eventDates = new Set(
  events?.map((event) => format(new Date(event.start), 'yyyy-MM-dd'))
);




const onDayCellDidMount=(info) => {
    const dateStr = format(info.date, 'yyyy-MM-dd');
    if (eventDates.has(dateStr)) {
      // Apply green background for event dates
      info.el.style.backgroundColor = '#d1fae5'; // Tailwind's green-100
    } else {
      // Apply gray background for non-event dates
      info.el.style.backgroundColor = '#ffffff'; // Tailwind's gray-100
    }
  }




  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">Override Schedule Calendar</h2>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading calendar...</p>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventDidMount={eventDidMount}
            eventClick={handleEventClick} 
            
          height="auto"
          className="rounded-md shadow-lg border border-gray-200"

  dayCellDidMount={onDayCellDidMount}


        />
      )}

      <Dialog open={open} onOpenChange={(openState) => {
        setOpen(openState);
        if (!openState) {
          reset();
          setEditing(false);
        }
      }}>
        <DialogContent className="max-w-lg ">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editing ? 'Edit Override Schedule' : 'Create Override Schedule'}
            </DialogTitle>
          </DialogHeader>

          <form
           onSubmit={handleSubmit((data) => {
  if (!data.isDayOff && data.slots.length === 0) {
    toast.error('Please add at least one slot.');
    return;
  }
  saveMutation.mutate(data);
})}
            className="space-y-6"
            noValidate
          >
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                value={format(new Date(selectedDate ? selectedDate : null), 'PPP')}
                readOnly
                tabIndex={-1}
                className="cursor-not-allowed bg-gray-100 "
              />
              {/* Ensure form date is synced */}
              <input
                type="hidden"
                {...(watch('date') !== selectedDate && setValue('date', selectedDate))}
              />
            </div>




            <div className="flex items-center space-x-3 ">
              <Controller
                name="isDayOff"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isDayOff"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="isDayOff" className="cursor-pointer select-none">
                Mark as Day Off
              </Label>
            </div>

            {watchIsDayOff ? (
              <div>
                <Label htmlFor="message">Message</Label>
                <Controller
                  name="message"
                  control={control}
                  rules={{ required: 'Message is required for a day off' }}
                  render={({ field }) => (
                    <Textarea
                      id="message"
                      {...field}
                      placeholder="Enter message for the day off"
                      className={errors.message ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.message && (
                  <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>
            ) : (


<div>
  <Label>Slots</Label>

  {fields.length === 0 && (
    <p className="text-gray-500 mb-2">No slots added. Please add slots.</p>
  )}

  {/* ✅ Scrolls only when content exceeds max-h */}
  <div className="max-h-48 overflow-y-auto w-full rounded-md border px-4 py-2">
   {fields.map((slot, index) => (
  <div key={slot.id} className="flex gap-2 items-center mb-3">
    <Controller
      name={`slots.${index}`}
      control={control}
      rules={{ required: 'Slot time is required' }}
      render={({ field }) => (
        <Input
          {...field}
          ref={index === fields.length - 1 ? lastInputRef : null}
          placeholder="e.g. 10:00 AM - 11:00 AM"
          className={errors.slots?.[index] ? 'border-red-500' : ''}
        />
      )}
    />
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={() => remove(index)}
      aria-label="Remove slot"
      className="text-red-500 hover:text-red-600"
    >
      ✕
    </Button>
  </div>
))}

  </div>

  {errors.slots && typeof errors.slots.message === 'string' && (
    <p className="text-red-600 text-sm">{errors.slots.message}</p>
  )}

  <Button
    type="button"
    variant="outline"
    onClick={() => append('')}
    className="mt-2"
  >
    + Add Slot
  </Button>
</div>



            
            )}

            <div className="flex justify-between pt-4">
              {editing && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  type="button"
                  disabled={deleteMutation.isLoading}
                >
                  {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                </Button>
              )}

              <div className="ml-auto flex gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    reset();
                    setEditing(false);
                  }}
                  disabled={saveMutation.isLoading || deleteMutation.isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saveMutation.isLoading || deleteMutation.isLoading}
                >
                  {editing
                    ? saveMutation.isLoading
                      ? 'Updating...'
                      : 'Update'
                    : saveMutation.isLoading
                    ? 'Creating...'
                    : 'Create'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OverrideCalendar;
