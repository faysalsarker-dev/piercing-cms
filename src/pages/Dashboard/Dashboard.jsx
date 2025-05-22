

import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import useAxios from '@/hooks/useAxios';
import BookingsTrend from './BookingsTrend';
import TopServices from './TopServices';
import BookingSummary from './BookingSummary';

const Dashboard = () => {

    const axiosCommon = useAxios()
  const { data, isLoading } = useQuery({
    queryKey: ['monthlyDashboard'],
    queryFn: async () => {
      const res = await axiosCommon.get('/summaries/monthly-summary');
      return res.data;
    }
  });

  if (isLoading) return <p className="text-center">Loading...</p>;


  return (
    <div className="p-6 grid gap-6">
     <BookingSummary data={data}/>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
      


<BookingsTrend trend={data.trend}/>


<TopServices topServices={data?.topServices}/>



        
      </div>
    </div>
  );
};

export default Dashboard;
