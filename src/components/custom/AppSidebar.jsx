
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
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

import { ScrollArea } from "../ui/scroll-area";
import logo from "../../assets/logo.png";
import developer from "../../assets/developer.jpg";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaTags } from "react-icons/fa6";
import { BsFillBarChartFill } from "react-icons/bs";
import {
  AiFillBoxPlot, // for Stocks

} from "react-icons/ai";
import {
  BsPlusCircle, // for Add Product / Add Order
  BsFillBoxSeamFill, // for Stock Management
  BsClipboardCheck, // for Add Order
  BsGraphUp, // for Order Management
  BsBagCheckFill, // for Sales Management
} from "react-icons/bs";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { FaClipboardList } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { IoMdListBox } from "react-icons/io";
import { BsDatabaseFillAdd } from "react-icons/bs";


const topItem =[
  {
    title: "Dashboard",
    url: "/",
    icon: TbLayoutDashboardFilled,
  }
]
// Menu items.
const items = [

  {
    title: "Categories",
    url: "/categories",
    icon: FaTags,
  },
  {
    title: "Reports & Analytics",
    url: "/reports",
    icon: BsFillBarChartFill,
  },
];

const collapsibleItems = [
  {
    headTitle: "Stocks",
    icon: AiFillBoxPlot,
    items: [
      {
        title: "Add Product",
        url: "/stock-management/add-product",
        icon: BsDatabaseFillAdd,
      },
      {
        title: "Stock Management",
        url: "/stock-management",
        icon: IoMdListBox,
      },
    ],
  },
  {
    headTitle: "Orders",
    icon: FaClipboardList,
    items: [
      {
        title: "Add Order",
        url: "/add-order",
        icon: BsClipboardCheck,
      },
      {
        title: "Order Management",
        url: "/manage-orders",
        icon: BsGraphUp,
      },
    ],
  },
  {
    headTitle: "Sales",
    icon: FaBagShopping,
    items: [
      {
        title: "Sales Products",
        url: "/sale-management/add-sales",
        icon: RiShoppingBag3Fill,
      },
      {
        title: "Sales Management",
        url: "/sale-management",
        icon: BsBagCheckFill,
      },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Header */}
        <SidebarHeader className="border-b ">
          <div className="flex items-center gap-3 ">
            <img src={logo} alt="logo" className="h-10 w-10 rounded-lg" />

            {/* Hide this div when sidebar is collapsed */}
            {open && (
              <div className="text-left leading-tight ">
                <h1 className="font-bold text-primary">BONIK JEWELLERS</h1>
                <p className="text-xs text-gray-500">Shonjib Bonik</p>
              </div>
            )}
          </div>
        </SidebarHeader>
        {/* Scrollable Menu Area */}
        <div className="flex-1 overflow-y-auto my-4">
          <ScrollArea className="h-full">
            <SidebarGroup>
              <SidebarGroupContent>


              <SidebarMenu>
                  {topItem.map((item) => {
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
                             
                            />
                            <span
                              className={`${
                                isActive ? "font-bold" : "font-medium"
                              }`}
                            >
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>






              <SidebarMenu>







                  {collapsibleItems.map((section, index) => (
                    <Collapsible
                      key={index}
                      className="group/collapsible"
                      defaultOpen={false}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            size="lg"
                            className={`${
                         
                                "text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            <section.icon className="mr-2" size={10} />
                            <span className="text-sm font-medium">  
                            {section.headTitle || section.title}
                            </span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="pl-4 mt-1 flex flex-col gap-1">
                          {section.items.map((item, idx) => {
                            const isActive = location.pathname === item.url;

                            return (
                              <SidebarMenuSubItem key={idx}>
                                <SidebarMenuButton
                                  asChild
                                  className={`rounded-md px-3 py-2 flex items-center gap-2 ${
                                    isActive
                                      ? "bg-orange-100 text-primary font-extrabold"
                                      : "text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  <Link to={item.url}>
                                    <item.icon
                                      size={16}
                                      color="currentColor"
                                    
                                    />
                                    <span
                                      className={
                                        isActive ? "font-bold" : "font-medium"
                                      }
                                    >
                                      {item.title}
                                    </span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ))}
                </SidebarMenu>


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
                            <span
                              className={`${
                                isActive ? "font-bold" : "font-medium"
                              }`}
                            >
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
          <SidebarFooter className="my-4">
            {open ? (
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
            ) : (
              <>
                <a
                  href="https://faysal-sarker.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={developer}
                    alt="developer"
                    className="h-10 w-10 rounded-lg"
                  />
                </a>
              </>
            )}
          </SidebarFooter>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
