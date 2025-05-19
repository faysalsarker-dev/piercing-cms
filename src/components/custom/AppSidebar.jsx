
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
import { BsFillBarChartFill } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";

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
    title: "schedules",
    url: "/schedules",
    icon: AiOutlineUser,
  },
  {
    title: "Blogs",
    url: "/blog",
    icon: AiOutlineUser,
  },
  {
    title: "booking",
    url: "/booking",
    icon: AiOutlineUser,
  },
  {
    title: "Users",
    url: "/users",
    icon: AiOutlineUser,
  },
  {
    title: "Testimonial",
    url: "/review",
    icon: AiOutlineUser,
  },


  {
    title: "Reports & Analytics",
    url: "/reports",
    icon: BsFillBarChartFill,
  },
];

const collapsibleItems = [
 
 
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
