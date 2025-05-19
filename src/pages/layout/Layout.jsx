import { AppSidebar } from '@/components/custom/AppSidebar';
import TopBar from '@/components/custom/TopBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';


const Layout = () => {
  return (
    <SidebarProvider >
      <AppSidebar />
      <main className='w-full bg-background'>
<TopBar/> 
     <div className='px-4'><Outlet/></div>
      </main>
    </SidebarProvider>
  );
};

export default Layout;


