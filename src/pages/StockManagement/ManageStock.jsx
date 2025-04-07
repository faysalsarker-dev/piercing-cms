import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Eye,  Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { debounce } from 'lodash';
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmDialog";
import { Link } from "react-router-dom";

const ManageStock = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [dateSort, setDateSort] = useState("newest");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const axiosSecure = useAxios();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axiosSecure.get("/categories");
      return response.data || [];
    },
  });

  const { data, isLoading,refetch } = useQuery({
    queryKey: ["stock", search, category, dateSort, page],
    queryFn: async () => {
      const response = await axiosSecure.get(`/stocks?page=${page}&limit=${itemsPerPage}&search=${search}&category=${category}&date=${dateSort}`);
      return response.data || { stocks: [], total: 0 };
    },
  });
  const handleSearch = debounce((value) => setSearch(value), 500);

  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage);

  return (
    <div>
      <>
       
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Left Side: Search Input */}
  <div className="flex items-center w-full bg-sidebar">
    <Input
      placeholder="Search by product name or barcode..."
      onChange={(e) => handleSearch(e.target.value)}
      className="w-full h-12 text-lg"
    />
  </div>

  {/* Right Side: Category + Date Sort Select */}
  <div className="flex items-center gap-4 w-full bg-sidebar">
    <Select value={category} onValueChange={(value) => setCategory(value)}>
      <SelectTrigger className="w-full h-12 text-lg">
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

    <Select value={dateSort} onValueChange={(value) => setDateSort(value)}>
      <SelectTrigger className="w-full h-12 text-lg">
        <SelectValue placeholder="Sort by Date" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="oldest">Oldest First</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>

      </>

      <Card className="w-full shadow-lg mt-5">
      
        <>
        <div className="overflow-x-auto ">

{
  isLoading? (
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
  ):(


  data?.stocks?.length === 0 ? (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500">No stocks available.</p>
    </div>
  ):(
    <Table className="min-w-full text-sm">
    <TableHeader>
      <TableRow className="bg-gray-100">
        <TableHead className="p-3">Product</TableHead>
        <TableHead className="p-3">Category</TableHead>
        <TableHead className="p-3">Weight (g)</TableHead>
        <TableHead className="p-3">Karat</TableHead>
        <TableHead className="p-3">Stock (B/T/R)</TableHead>
        <TableHead className="p-3">Price ($)</TableHead>
        <TableHead className="p-3">Actions</TableHead>
        <TableHead className="p-3">Image</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data?.stocks?.map((item, index) => (
        <TableRow key={index} className="border-b">
          <TableCell>
            <p className="font-medium">{item?.productName}</p>
            <span className="text-gray-500 text-xs">{item?.barcode}</span>
          </TableCell>
          <TableCell className="p-3">{item?.category}</TableCell>
          <TableCell className="p-3">{item?.weight}(g)</TableCell>
          <TableCell className="p-3">{item?.karat}</TableCell>
          <TableCell className="p-3">{item?.bhori || ''} B / {item?.tola || 0} T / {item?.roti || 0} R</TableCell>
          <TableCell className="p-3 font-semibold">${item?.cost}</TableCell>
          <TableCell className="p-3 flex space-x-2 items-center justify-center">

             <Link to={`/product/${item?._id}`}> 
            <Button variant="outline" size="icon" className="p-1">
            <Eye size={16} />
            </Button></Link>




        <Link to={`/stock-management/${item?._id}`}>
              <Button variant="outline" size="icon" className="p-1">
                <Edit size={16} />
              </Button>
        </Link>
            <Button
  variant="outline"
  size="icon"
  className="p-1"
  onClick={() => {
    setDeleteId(item._id); // this is the ID of the stock item
    setOpen(true);          // open the dialog
  }}
>
  <Trash2 className="text-red-600" size={16} />
</Button>

          </TableCell>
          <TableCell className="p-3">
            {item.image ? <img src={`${import.meta.env.VITE_BASE_URL}/images/${item.image}`} alt={item.productName}  className="rounded-md w-14" /> : "No Image"}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  
  )







 

  )
}





           
          </div>
         
           
        </>



        <DeleteConfirmDialog
  open={open}
  onClose={() => setOpen(false)}
  id={deleteId}
  url={`/stocks`} 
  refetch={() => refetch()} 
/>




      </Card>

      {data?.total > 9 && (
  <Pagination className="mt-5">
    <PaginationContent>
      {/* Previous */}
      <PaginationItem>
        <PaginationPrevious
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        />
      </PaginationItem>

      {/* First Page */}
      {page > 2 && (
        <>
          <PaginationItem>
            <PaginationLink onClick={() => setPage(1)}>
              1
            </PaginationLink>
          </PaginationItem>
          {page > 3 && <PaginationEllipsis />}
        </>
      )}

      {/* Current -1 */}
      {page > 1 && (
        <PaginationItem>
          <PaginationLink onClick={() => setPage(page - 1)}>
            {page - 1}
          </PaginationLink>
        </PaginationItem>
      )}

      {/* Current Page */}
      <PaginationItem>
        <PaginationLink
          onClick={() => setPage(page)}
          className="bg-blue-500 text-white"
        >
          {page}
        </PaginationLink>
      </PaginationItem>

      {/* Current +1 */}
      {page < totalPages && (
        <PaginationItem>
          <PaginationLink onClick={() => setPage(page + 1)}>
            {page + 1}
          </PaginationLink>
        </PaginationItem>
      )}

      {/* Last Page */}
      {page < totalPages - 1 && (
        <>
          {page < totalPages - 2 && <PaginationEllipsis />}
          <PaginationItem>
            <PaginationLink onClick={() => setPage(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        </>
      )}

      {/* Next */}
      <PaginationItem>
        <PaginationNext
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
)}

    </div>
  );
};

export default ManageStock;
