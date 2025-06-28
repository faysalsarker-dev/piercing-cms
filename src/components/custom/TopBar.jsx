import { SidebarTrigger } from "@/components/ui/sidebar";
import {  LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import useAuth from "@/hooks/useAuth/useAuth";
import Swal from "sweetalert2";

export default function TopBar() {
  const { logOut, user } = useAuth();




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



  return (
    <div className="bg-sidebar p-4 shadow-md flex items-center justify-between  gap-4 flex-wrap">
      {/* Sidebar Toggle */}
      <SidebarTrigger />

 
    

      {/* Right Side */}
      <div className="flex items-center gap-4 lg:gap-4">




   











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
            {/* <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem> */}
            {/* <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem> */}
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
