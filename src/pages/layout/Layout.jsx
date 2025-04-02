import { AppSidebar } from '@/components/custom/AppSidebar';
import TopBar from '@/components/custom/TopBar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';


const Layout = () => {
  return (
    <SidebarProvider >
      <AppSidebar />
      <main className='w-full'>
<TopBar/> 
     <Outlet/>
      </main>
    </SidebarProvider>
  );
};

export default Layout;


