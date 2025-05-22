import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#6366f1", // indigo-500
  "#ec4899", // pink-500
];

const chartConfig = {
  legend: false, // We'll show a custom legend below
  tooltip: false,
};

const TopServices = ({ topServices = [] }) => {
  const chartData = topServices.map((item, index) => ({
    name: item.service,
    value: item.count,
    color: COLORS[index % COLORS.length],
  }));

  const isEmpty = chartData.length === 0;

  return (
    <Card className="flex flex-col shadow-md rounded-2xl bg-white dark:bg-slate-900">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">
          Top Services
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Based on most booked services
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center">
        {isEmpty ? (
          <div className="text-center text-muted-foreground py-10">
            No service data available
          </div>
        ) : (
          <>
            <PieChart width={250} height={250}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TopServices;
