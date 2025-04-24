import { LayoutDashboard, PlusCircle, Boxes, ShoppingBag, ShoppingCart, Tags, BarChart, LogOut,ClipboardList ,SquareChartGantt, CodeXml  } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

import { ScrollArea } from '../ui/scroll-area';
import logo from '../../assets/logo.png'
import developer from '../../assets/developer.jpg'

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
 
  {
    title: "Add Product",
    url: "/stock-management/add-product",
    icon: PlusCircle,
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
const {open}=useSidebar()







  return (
    <Sidebar collapsible="icon">
    <SidebarContent >
      {/* Header */}
      <SidebarHeader className="border-b ">
  <div className="flex items-center gap-3 ">
    <img src={logo} alt="logo" className="h-10 w-10 rounded-lg" />

    {/* Hide this div when sidebar is collapsed */}
{ open &&   <div className="text-left leading-tight ">
      <h1 className="font-bold text-primary">BONIK JEWELLERS</h1>
      <p className="text-xs text-gray-500">Shonjib Bonik</p>
    </div>}
  </div>
</SidebarHeader>
      {/* Scrollable Menu Area */}
      <div className="flex-1 overflow-y-auto my-4">
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
      <div className="shrink-0 border-t border-gray-300 ">
      <SidebarFooter className='my-4'>

{
  open ?
  
  
  <>
  <a
              href="https://faysal-sarker.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base mt-1 mb-2"
            >
              Developed by{" "}
              <span className="text-blue-500 font-bold">Faysal Sarker</span>
            </a>
</>

:

<>  

<a 

href="https://faysal-sarker.netlify.app"
target="_blank"
rel="noopener noreferrer"
>
  <img src={developer} alt="developer" className='h-10 w-10 rounded-lg' />
  
</a>
</>
}


  



      </SidebarFooter>
       
      </div>
    </SidebarContent>
  </Sidebar>
  );
}