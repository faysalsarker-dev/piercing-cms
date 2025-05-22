import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import PropTypes from "prop-types";

const chartConfig = {
  legend: true,
  tooltip: true,
  datasets: {
    totalBookings: {
      label: "Total Bookings",
      color: "#3b82f6",
      gradientId: "fillTotal",
    },
    confirmedBookings: {
      label: "Confirmed",
      color: "#10b981",
      gradientId: "fillConfirmed",
    },
    cancelledBookings: {
      label: "Cancelled",
      color: "#ef4444",
      gradientId: "fillCancelled",
    },
  },
};

const BookingsTrend = ({ trend = [] }) => {
  const formattedData = trend.map((item) => ({
    ...item,
    monthLabel: new Date(item.month).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    }),
  }));

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left">
          <CardTitle>Bookings Trend</CardTitle>
          <CardDescription>
            Track confirmed and cancelled bookings over recent months.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={formattedData}>
            <defs>
              {Object.entries(chartConfig.datasets).map(([key, { gradientId, color }]) => (
                <linearGradient id={gradientId} key={key} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="monthLabel"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              minTickGap={16}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Month: ${value}`}
                  indicator="dot"
                />
              }
            />

            {Object.entries(chartConfig.datasets).map(([key, { label, gradientId }]) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={label}
                stroke={chartConfig.datasets[key].color}
                fill={`url(#${gradientId})`}
              />
            ))}

            <ChartLegend />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

BookingsTrend.propTypes = {
  trend: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      totalBookings: PropTypes.number,
      confirmedBookings: PropTypes.number,
      cancelledBookings: PropTypes.number,
    })
  ),
};

export default BookingsTrend;
