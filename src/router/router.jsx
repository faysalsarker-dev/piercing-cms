import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/layout/Layout";
import Dashboard from "@/pages/Dashboard/Dashboard";
import StockManagement from "@/pages/StockManagement/StockManagement";
import AddStock from "@/pages/StockManagement/AddStock";
import Categories from "@/pages/categories/Categories";
import SalesManagement from "@/pages/salesManagement/SalesManagement";
import ReportAnalytics from "@/pages/Analytics/ReportAnalytics";
import AddNewSale from "@/pages/salesManagement/AddNewSale";
import SalesDetails from "@/pages/SinglePage/SalesDetails";
import ProductDetails from "@/pages/SinglePage/ProductDetails";
import Login from "@/pages/Auth/Login";


const router = createBrowserRouter([
  {
    path: "/",
    element:<Layout/> ,
    errorElement: <h3>error page</h3>,
    children: [
        {
            index:true,
            element:<Dashboard/>
        },
        {
            path:'/stock-management',
            element:<StockManagement/>
        },
        {
            path:'/stock-management/add-product',
            element:<AddStock/>
        },
        {
            path:'/categories',
            element:<Categories/>
        },
        {
          path:'/sale-management',
          element:<SalesManagement/>
      },
        {
          path:'/add-sales',
          element:<AddNewSale/>
      },
        {
          path:'/reports',
          element:<ReportAnalytics/>
      },
        {
          path:'/sales/:id',
          element:<SalesDetails/>
      },
        {
          path:'/product/:id',
          element:<ProductDetails/>
      },
    
    ],
  },
  {
    path:'/login',
    element:<Login/>
},
]);

export default router;