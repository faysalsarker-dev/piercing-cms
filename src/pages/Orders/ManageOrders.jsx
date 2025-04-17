import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { debounce } from "lodash";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";

export default function ManageOrders() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [deliveryStatus, setDeliveryStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const axiosSecure = useAxios();

  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ["orders", search, category, status, deliveryStatus, currentPage],
    queryFn: async () => {
      const response = await axiosSecure.get("/orders", {
        params: {
          search,
          category,
          status,
          deliveryStatus,
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      return response.data;
    },
  });
console.log(data);
  const handleSearch = debounce((value) => {
    setSearch(value);
  }, 500);

  useEffect(() => {
    refetch();
  }, [search, category, status, deliveryStatus, currentPage, refetch]);

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Orders</h2>
        <Link to="/orders/add">
          <Button className="bg-primary">Add New Order</Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="w-full md:w-1/2 bg-sidebar">
          <Input
            className="h-12"
            placeholder="Search by name or phone"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-4 bg-sidebar">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Filter Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="ring">Ring</SelectItem>
              <SelectItem value="necklace">Necklace</SelectItem>
              {/* Add more as needed */}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={deliveryStatus} onValueChange={setDeliveryStatus}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Delivery Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="not-delivered">Not Delivered</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="w-full shadow-lg">
        <div className="overflow-x-auto">
          {isLoading ? (
            <SkeletonTable />
          ) : isError ? (
            <p className="text-center text-red-500">Error fetching data</p>
          ) : data?.orders?.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No orders found</div>
          ) : (
            <Table className="text-base">
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.orders?.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.clientName}</TableCell>
                    <TableCell>{order.clientPhone}</TableCell>
                    <TableCell>{order.productName || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize ${
                          order.status === "completed"
                            ? "bg-green-200 text-green-700"
                            : order.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize ${
                          order.deliveryStatus === "delivered"
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-500"
                        }`}
                      >
                        {order.deliveryStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.deliveryDate
                        ? format(new Date(order.deliveryDate), "PPP")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Link to={`/orders/${order._id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-5 h-5 text-blue-500" />
                        </Button>
                      </Link>
                      <Link to={`/orders/edit/${order._id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-5 h-5 text-gray-700" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      {data?.totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(data.totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, data.totalPages))
                }
                disabled={currentPage === data.totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

const SkeletonTable = () => (
  <Table>
    <TableHeader>
      <TableRow>
        {[...Array(10)].map((_, i) => (
          <TableHead key={i}>
            <Skeleton className="h-6 w-full" />
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          {[...Array(10)].map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-6 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
