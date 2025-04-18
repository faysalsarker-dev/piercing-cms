import { LayoutDashboard, PlusCircle, Boxes, ShoppingBag, ShoppingCart, Tags, BarChart, LogOut,ClipboardList ,SquareChartGantt  } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth/useAuth";
import { ScrollArea } from '../ui/scroll-area';

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Add Order",
    url: "/add-order",
    icon: ClipboardList,
  },
  {
    title: "Order Management",
    url: "/manage-orders",
    icon: SquareChartGantt,
  },
  {
    title: "Add Product",
    url: "/stock-management/add-product",
    icon: PlusCircle,
  },
  {
    title: "Stock Management",
    url: "/stock-management",
    icon: Boxes,
  },
  {
    title: "Sales Management",
    url: "/sale-management",
    icon: ShoppingBag,
  },
  {
    title: "Sales Products",
    url: "/sale-management/add-sales",
    icon: ShoppingCart,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: Tags,
  },
  {
    title: "Reports & Analytics",
    url: "/reports",
    icon: BarChart,
  },
];

export function AppSidebar() {
  const location = useLocation();
const {logOut} = useAuth()


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
    <Sidebar collapsible="icon">
    <SidebarContent className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0">
        <SidebarGroupLabel collapsible className="text-lg font-bold text-primary mb-3 px-4 pt-4">
          SHONJIB JEWELLERY
        </SidebarGroupLabel>
        <div className="border-b border-gray-300 mb-1" />
      </div>

      {/* Scrollable Menu Area */}
      <div className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        size="lg"
                        className={`${
                          isActive
                            ? "bg-orange-100 text-primary font-extrabold"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                        asChild
                      >
                        <Link to={item.url}>
                          <item.icon
                            size={10}
                            color="currentColor"
                            strokeWidth={isActive ? 3 : 2}
                          />
                          <span className={`${isActive ? "font-bold" : "font-medium"}`}>
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-gray-300 px-4 py-3">
        {/* <SidebarMenuButton
          className="flex items-center gap-3 w-full text-gray-700 px-4 py-3 rounded-md hover:bg-red-500 hover:text-white transition-all"
          asChild
        >
          <button onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </SidebarMenuButton> */}
        <SidebarGroupLabel collapsible className="flex justify-start p-2 mt-4">
          <a
            href="https://faysal-sarker.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base"
          >
            Developed by{" "}
            <span className="text-blue-500 font-bold">Faysal Sarker</span>
          </a>
        </SidebarGroupLabel>
      </div>
    </SidebarContent>
  </Sidebar>
  );
}
