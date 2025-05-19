

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { debounce } from 'lodash';
import 'react-day-picker/dist/style.css';
import dayjs from 'dayjs';
import useAxios from '@/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import BookTable from '@/components/custom/BookTable';

export default function BookingPage() {
  const axiosCommon = useAxios();

  const {
    register,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      search: '',
      sort: 'newest',
      status: 'all',
    },
  });

  const [dateRange, setDateRange] = useState({});
  const [page, setPage] = useState(1);
  const limit = 10;
console.log(dateRange,'date rangee');
  const watchedFields = watch();

  // Construct query parameters
  const queryParams = useMemo(() => {
    const params= {
      page,
      limit,
      sort: watchedFields.sort,
    };

    if (watchedFields.search?.trim()) {
      params.search = watchedFields.search.trim();
    }

    if (watchedFields.status !== 'all') {
      params.status = watchedFields.status;
    }

    if (dateRange.from) {
      params.from = dayjs(dateRange.from).format('YYYY-MM-DD');
    }
    if (dateRange.to) {
      params.to = dayjs(dateRange.to).format('YYYY-MM-DD');
    }

    return params;
  }, [watchedFields, dateRange, page]);

  const {
    data: bookingsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['bookings', queryParams],
    queryFn: async () => {
      const response = await axiosCommon.get('/online-booking', {
        params: queryParams,
      });
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });


  
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setValue('search', value);
        setPage(1); // reset page on search change
      }, 500),
    [setValue]
  );

  // Manually watch search input value change (no immediate refetch)
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'search') {
        debouncedSearch(value.search);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedSearch]);

  
  useEffect(() => {
    refetch();
  }, [queryParams, refetch]);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Online Booking Management</h1>

      {/* Filter Form */}
      <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="search" className="block mb-1 font-medium">
            Search (Name or Phone)
          </label>
          <Input
            id="search"
            placeholder="Search by name or phone"
            defaultValue=""
            {...register('search')}
          />
        </div>

        <div>
          <label htmlFor="sort" className="block mb-1 font-medium">Sort By</label>
          <Select
            defaultValue="newest"
            onValueChange={(val) => {
              setValue('sort', val);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="status" className="block mb-1 font-medium">Status</label>
          <Select
            defaultValue="all"
            onValueChange={(val) => {
              setValue('status', val);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Date Range</label>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                {dateRange.from && dateRange.to
                  ? `${dayjs(dateRange.from).format('MMM D')} - ${dayjs(dateRange.to).format('MMM D')}`
                  : 'Select Date Range'}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-auto p-4">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range ?? {});
                  setPage(1);
                }}
                numberOfMonths={1}
              />
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setDateRange({});
                  setPage(1);
                }}
              >
                Clear Date Range
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </form>

      {/* Display loading and error */}
      {isLoading && <p className="text-center mt-6">Loading bookings...</p>}
      {isError && <p className="text-center text-red-500 mt-6">Failed to load bookings.</p>}

      {bookingsData && (
        <BookTable
          data={bookingsData?.bookings}
          total={bookingsData?.total}
          page={bookingsData?.page}
          limit={bookingsData?.limit}
          refetch={refetch}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
}
