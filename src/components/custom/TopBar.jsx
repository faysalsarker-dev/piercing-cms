import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Moon, Sun } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth/useAuth";
import Swal from "sweetalert2";

export default function TopBar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const {logOut}=useAuth()

  const [dueDate] = useState(new Date().toISOString().split("T")[0]);

  const axiosSecure = useAxios();
  const { data = [] } = useQuery({
    queryKey: ["emi"],
    queryFn: async () => {
      const response = await axiosSecure.get(`/sale?dueDate=${dueDate}`);
      return response.data.sales;
    },
    staleTime: 1200000,
    cacheTime: 3600000,
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);



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
        logOut()
      }
    });
  };


  return (
    <div className={cn("bg-sidebar p-4 shadow-lg flex items-center justify-between rounded-lg")}>
      {/* Sidebar Toggle Button */}
      <SidebarTrigger />

      {/* User Info */}
      <div className="flex items-center gap-4">
        {/* <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
        </Button> */}

        {/* Notification Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative bg-gray-300 rounded-full">
              <Bell className="w-7 h-7 text-gray-700 dark:text-gray-300   " />
              {data.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {data.length > 0 ? (
              data.map((item, index) => (
                <DropdownMenuItem key={index} className="flex justify-between">
                  <span>{index+1}</span>
                  <span>{item.clientName}</span>
                  <span className="text-sm text-gray-500">{item.clientPhone}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem>No notifications</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.1945158823.1729787142&semt=ais_hybrid&w=740" alt="User Avatar" />
              <AvatarFallback>FS</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
           
            
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
