import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";
import PropTypes from "prop-types";

const BookingSummary = ({ data }) => {
  const stats = [
    {
      label: "Total Bookings",
      value: data.totalBookings,
      icon: CalendarCheck,
      color: "text-blue-500 bg-blue-100 dark:bg-blue-900",
    },
    {
      label: "Confirmed",
      value: data.confirmedBookings,
      icon: CheckCircle,
      color: "text-green-500 bg-green-100 dark:bg-green-900",
    },
    {
      label: "Cancelled",
      value: data.cancelledBookings,
      icon: XCircle,
      color: "text-red-500 bg-red-100 dark:bg-red-900",
    },
    {
      label: "Total Revenue",
      value: `$${data.totalRevenue}`,
      icon: DollarSign,
      color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color }, index) => (
        <Card key={index} className="shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle className="text-base font-semibold text-slate-700 dark:text-white">
                {label}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Current Month</p>
            </div>
            <div className={`p-2 rounded-full ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
BookingSummary.propTypes = {
  data: PropTypes.shape({
    totalBookings: PropTypes.number.isRequired,
    confirmedBookings: PropTypes.number.isRequired,
    cancelledBookings: PropTypes.number.isRequired,
    totalRevenue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }).isRequired,
};

export default BookingSummary;
