import { AppSidebar } from '@/components/custom/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';


const Layout = () => {
  return (
    <SidebarProvider >
      <AppSidebar />
      <main className='w-full p-4'>
        <SidebarTrigger />
      <Outlet/>
      </main>
    </SidebarProvider>
  );
};

export default Layout;


