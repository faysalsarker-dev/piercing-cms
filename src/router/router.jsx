import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/layout/Layout";


import Login from "@/pages/Auth/Login";

import Home from "./../pages/home/Home";
import Users from "@/pages/Users/Users";
import ClientReview from "@/pages/Review/ClientReview";
import Schedule from "@/pages/Schedule/Schedule";
import RegisterUser from "@/pages/Users/RegisterUser";
import BookingPage from "@/pages/OnlineBook/BookingPage";
import UploadMediaPage from "@/pages/Gallery/UploadMediaPage";
import Gallery from "@/pages/Gallery/Gallery";
import PriceListPage from "@/pages/PriceList/PriceListPage";
import BlogListPage from "@/pages/Blogs/BlogListPage";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Protector from "./Protector";
import OfferBanner from "@/pages/offerBanner/OfferBanner";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Protector><Layout /></Protector>,
    errorElement: <h3>error page</h3>,
    children: [
      {
        index: true,
        element: <Dashboard/>
      },
      {
        path: "/overview",
        element:<Home/>
      },

      {
        path: "/schedules",
        element: <Schedule />,
      },
   

      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/booking",
        element: <BookingPage />,
      },
      {
        path: "/upload-media",
        element: <UploadMediaPage />,
      },
      {
        path: "/gallery",
        element: <Gallery />,
      },
      {
        path: "/users/register",
        element: <RegisterUser />,
      },
      {
        path: "/price-list",
        element: <PriceListPage />,
      },
      {
        path: "/blog-list",
        element: <BlogListPage />,
      },
   {
path: "/offer-banner",
element:<OfferBanner/>
   },
      {
        path: "/review",
        element: <ClientReview />,
      },
  
     
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
