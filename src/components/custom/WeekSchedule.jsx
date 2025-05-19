import  { useState } from 'react';
import {
  useForm,
  useFieldArray,
  Controller,
} from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import toast from 'react-hot-toast';
import useAxios from '@/hooks/useAxios';
import { Badge } from '../ui/badge';
import Swal from 'sweetalert2';

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const defaultMessage = "It's an off day. Please choose another date.";

const WeekSchedule = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const axiosCommon = useAxios();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      day: '',
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

  const { data: schedules = [] } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const res = await axiosCommon.get('/weekly-schedules');
      return res.data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editing) {
        return axiosCommon.put(`/weekly-schedules/${data.day}`, data);
      } else {
        return axiosCommon.post(`/weekly-schedules`, data);
      }
    },
    onSuccess: () => {
      toast.success(editing ? 'Schedule updated!' : 'Schedule created!');
      queryClient.invalidateQueries(['schedules']);
      setOpen(false);
      reset();
      setEditing(false);
    },
    onError: () => toast.error('Error saving schedule'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (day) => {
      return axiosCommon.delete(`/weekly-schedules/${day}`);
    },
    onSuccess: () => {
      toast.success('Schedule deleted');
      queryClient.invalidateQueries(['schedules']);
    },
    onError: () => toast.error('Error deleting schedule'),
  });

  const handleModalOpen = (day) => {
    setSelectedDay(day);
    const existing = schedules.find((s) => s?.day === day);
    if (existing) {
      reset(existing);
      setEditing(true);
    } else {
      reset({
        day,
        isDayOff: false,
        message: defaultMessage,
        slots: [],
      });
      setEditing(false);
    }
    setValue('day', day);
    setOpen(true);
  };

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {daysOfWeek.map((dayName) => {
        const current = schedules.find((s) => s?.day === dayName);
        return (
          <Card key={dayName} className="shadow-md">
            <CardHeader className="text-lg font-semibold text-blue-600">
              {dayName}
            </CardHeader>
            <CardContent className="space-y-2">
{current ? (
  current.isDayOff ? (
    <p className="text-destructive font-medium">{current.message}</p>
  ) : (
    <div className="flex flex-wrap gap-2">
      {current.slots?.length > 0 ? (
        current.slots.map((slot, index) => (
          <Badge
            key={index}
            className="bg-primary/10 text-primary border border-primary/20 rounded-xl px-3 py-1 text-sm"
          >
            {slot}
          </Badge>
        ))
      ) : (
        <p className="text-muted-foreground italic">No slots available</p>
      )}
    </div>
  )
) : (
  <p className="text-muted-foreground italic">No schedule set</p>
)}


              <div className="flex gap-2 pt-2">
                <Button onClick={() => handleModalOpen(dayName)} size="sm">
                  {current ? 'Edit' : 'Create'}
                </Button>
                {current && (
                  <Button
                    variant="destructive"
                    size="sm"
                   onClick={() => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This will permanently delete the schedule for this day.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6', 
    cancelButtonColor: '#d33',     
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      deleteMutation.mutate(dayName);
    }
  });
}}

                  >
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'Create'} Schedule</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit((data) => saveMutation.mutate(data))}
            className="space-y-4"
          >
            <div>
              <Label>Day</Label>
              <Input value={selectedDay} readOnly />
              <input type="hidden" {...watch('day') !== selectedDay && setValue('day', selectedDay)} />
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="isDayOff"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label>Is Day Off?</Label>
            </div>

            {watchIsDayOff ? (
              <div>
                <Label>Message</Label>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} />
                  )}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Slots</Label>
                {fields.map((slot, index) => (
                  <div key={slot.id} className="flex gap-2 items-center">
                    <Controller
                      name={`slots.${index}`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g. 10:00 AM - 11:00 AM" />
                      )}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => remove(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => append('')}>
                  + Add Slot
                </Button>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeekSchedule;
