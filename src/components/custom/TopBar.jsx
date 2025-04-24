import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, LogOut, User, Settings } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth/useAuth";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function TopBar() {
  const { logOut, user } = useAuth();
  const [dueDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const axiosSecure = useAxios();

  const routes = [
    { path: "/", name: "Dashboard" },
    { path: "/stock-management", name: "Stock Management" },
    { path: "/stock-management/add-product", name: "Add Product" },
    { path: "/categories", name: "Categories" },
    { path: "/sale-management", name: "Sales Management" },
    { path: "/sale-management/add-sales", name: "Add Sale" },
    { path: "/reports", name: "Reports" },
    { path: "/add-order", name: "Add Order" },
    { path: "/manage-orders", name: "Manage Orders" },
  ];

  const { data = [] } = useQuery({
    queryKey: ["emi"],
    queryFn: async () => {
      const response = await axiosSecure.get(`/sale?dueDate=${dueDate}`);
      return response.data.sales;
    },
    staleTime: 1200000,
    cacheTime: 3600000,
  });

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out and redirected to the login page.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut();
      }
    });
  };

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-sidebar p-4 shadow-md flex items-center justify-between rounded-lg gap-4 flex-wrap">
      {/* Sidebar Toggle */}
      <SidebarTrigger />

 
    

      {/* Right Side */}
      <div className="flex items-center gap-4 lg:gap-4">




      <Dialog open={showSearchModal} onOpenChange={setShowSearchModal}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="bg-gray-200 hover:bg-gray-300 rounded-full">
            <Search className="w-6 h-6 text-gray-700" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white/70 backdrop-blur-xl border-none p-4 rounded-xl w-[90vw] max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Search</h2>

          <Input
            autoFocus
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <div className="mt-2 max-h-60 overflow-y-auto">
            {filteredRoutes.length ? (
              filteredRoutes.map((route, i) => (
                <Link to={route.path} key={i} onClick={() => setShowSearchModal(false)}>
                  <div className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm">{route.name}</div>
                </Link>
              ))
            ) : (
              <div className="text-sm text-gray-500 mt-2">No results found.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>











        {/* Notification */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full bg-gray-200 hover:bg-gray-300">
              <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              {data.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full " />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 max-w-[90vw]">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {data.length > 0 ? (
              data.slice(0, 5).map((item, index) => (
                <Link to={`/sales/${item._id}`} key={index}>
                  <DropdownMenuItem className="flex flex-col items-start">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-sm">{item.clientName}</span>
                      <span className="font-medium text-sm text-red-500">${item.due}</span>
                    </div>
                    <span className="text-xs text-gray-500">{item.clientPhone}</span>
                  </DropdownMenuItem>
                </Link>
              ))
            ) : (
              <DropdownMenuItem className="text-gray-500 text-sm">No notifications</DropdownMenuItem>
            )}

{data.length > 5 && (
                <DropdownMenuItem className="text-gray-500 text-sm">More ...</DropdownMenuItem>
              )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer border border-gray-300 shadow-md">
              <AvatarImage src={user?.photoURL || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"} />
              <AvatarFallback>{user?.displayName?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-sm">
              <div className="font-semibold">{user?.displayName || "User Name"}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-100">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
