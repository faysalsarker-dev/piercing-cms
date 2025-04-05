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

export default function SalesManagement() {
  const [search, setSearch] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [minDate] = useState("");
  const [maxDate] = useState("");
  const [category, setCategory] = useState("all");

  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const axiosSecure = useAxios();
  // Fetch sales data
  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: [
      "sales",
      search,
      paymentType,
      minDate,
      maxDate,
      sortOrder,
      currentPage,
    ],
    queryFn: async () => {
      const response = await axiosSecure.get("/sale", {
        params: {
          search,
          paymentType,
          minDate,
          maxDate,
          sort: sortOrder,
          page: currentPage,
          limit: itemsPerPage,
          category,
        },
      });
      return response.data;
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axiosSecure.get("/categories");
      return response.data || [];
    },
  });

  useEffect(() => {
    refetch();
  }, [
    search,
    paymentType,
    minDate,
    maxDate,
    sortOrder,
    currentPage,
    category,
    refetch,
  ]);

  // Debounced search
  const handleSearch = debounce((value) => setSearch(value), 500);

  if (isError)
    return <p className="text-center text-red-500">Error loading sales data</p>;

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Sales Management</h2>
        <Link to="/sale-management/add-sales">
          <Button className="bg-primary">Add New Sale</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search Bar takes half the width on larger screens, full width on smaller screens */}
        <div className="w-full md:w-1/2">
          <Input
            className="h-12 w-full"
            placeholder="Search by phone or name"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Other Selects take full width on small screens, and each takes 1/3 width on larger screens */}
        <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-4">
          <Select
            value={category}
            onValueChange={(value) => setCategory(value)}
            className="w-full md:w-1/3"
          >
            <SelectTrigger className="h-12 text-lg">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={paymentType}
            onValueChange={setPaymentType}
            className="w-full md:w-1/3"
          >
            <SelectTrigger className="h-12 text-lg">
              <SelectValue placeholder="Payment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All</SelectItem>
              <SelectItem value="full">Full</SelectItem>
              <SelectItem value="emi">EMI</SelectItem>
              <SelectItem value="dueDate">Today&apos;s EMI Due</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={setSortOrder}
            className="w-full md:w-1/3"
          >
            <SelectTrigger className="h-12 text-lg">
              <SelectValue placeholder="Sort by Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto mt-10">
        {isLoading ? (
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(8)].map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-6 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {[...Array(8)].map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : data?.sales?.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No stocks available.</p>
          </div>
        ) : (
          <Table className="w-full text-lg">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Client Phone</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.sales?.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell>{sale?.clientName}</TableCell>
                  <TableCell>{sale?.clientPhone}</TableCell>
                  <TableCell className="flex  jusfify-center items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`w-fit px-3 py-1 text-sm font-semibold ${
                        sale?.paymentType.toLowerCase() === "full"
                          ? "text-green-600 bg-green-100"
                          : "text-red-600 bg-red-100"
                      }`}
                    >
                      {sale?.paymentType}
                    </Badge>

                    {sale?.paymentType.toLowerCase() === "emi" &&
                      sale?.dueDate && (
                        <span className="text-sm text-gray-600">
                          {format(new Date(sale.dueDate), "EEEE, MMMM d, yyyy")}
                        </span>
                      )}
                  </TableCell>

                  <TableCell>{sale?.product.productName}</TableCell>
                  <TableCell>{sale?.price}</TableCell>
                  <TableCell className="flex gap-4">
                    <Link to={`/sales/${sale?._id}`}>
                      <Button variant="ghost" size="icon" >
                        <Eye className="w-5 h-5 text-blue-500" />
                      </Button>{" "}
                    </Link>
                    <Link to={`/sale-management/${sale?._id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-5 h-5" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {data?.sales?.length !== 0 && (
        <Pagination className={"mt-5"}>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={data?.totalPages === 1}
              />
            </PaginationItem>
            {[...Array(data?.totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  className={
                    currentPage === index + 1 ? "bg-blue-500 text-white" : ""
                  }
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, data?.totalPages))
                }
                disabled={currentPage === data?.totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
