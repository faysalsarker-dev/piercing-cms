import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { debounce } from "lodash";

export default function SalesManagement() {
  const [search, setSearch] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const axiosSecure = useAxios();
  // Fetch sales data
  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ["sales", search, paymentType, minDate, maxDate, sortOrder, currentPage],
    queryFn: async () => {
      const response = await axiosSecure.get("/sale", {
        params: { search, paymentType, minDate, maxDate, sort: sortOrder, page: currentPage, limit: itemsPerPage },
      });
      return response.data;
    },
 
  });

console.log(data, "sales data");

  useEffect(() => {
    refetch();
  }, [search, paymentType, minDate, maxDate, sortOrder, currentPage, refetch]);

  // Debounced search
  const handleSearch = debounce((value) => setSearch(value), 500);


  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError) return <p className="text-center text-red-500">Error loading sales data</p>;

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Sales Management</h2>
        <Link to='/add-sales'><Button className='bg-primary'>Add New Sale</Button></Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Input placeholder="Search by phone" onChange={(e) => setSearch(e.target.value)} />
        <Button  className="bg-primary">
          Select Date Range
        </Button>
        <Select value={paymentType} onValueChange={setPaymentType}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Payment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>All</SelectItem>
            <SelectItem value="full">Full</SelectItem>
            <SelectItem value="emi">EMI</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Sort by Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>




      {/* Table */}
      <Table className="w-full text-lg">
        <TableHeader>
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
              <TableCell>{sale?.paymentType} {sale?.dueDate} </TableCell>
              <TableCell>{sale?.product.productName}</TableCell>
              <TableCell>{sale?.price}</TableCell>
              <TableCell className="flex gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/sales/${sale?._id}`}>
                    <Eye className="w-5 h-5 text-blue-500" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon">
                  <Pencil className="w-5 h-5" />
                </Button>
              
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-4">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>Previous</Button>
        <span>Page {currentPage} of {data.totalPages}</span>
        <Button disabled={currentPage === data.totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>Next</Button>
      </div>






    </div>
  );
}
