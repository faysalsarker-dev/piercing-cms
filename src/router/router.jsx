import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/layout/Layout";

import ReportAnalytics from "@/pages/Analytics/ReportAnalytics";

import Login from "@/pages/Auth/Login";

import Home from "./../pages/home/Home";
import Users from "@/pages/Users/Users";
import ClientReview from "@/pages/Review/ClientReview";
import BlogPost from "@/pages/Blogs/BlogPost";
import Schedule from "@/pages/Schedule/Schedule";
import RegisterUser from "@/pages/Users/RegisterUser";
import BookingPage from "@/pages/OnlineBook/BookingPage";
import UploadMediaPage from "@/pages/Gallery/UploadMediaPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <h3>error page</h3>,
    children: [
      {
        index: true,
        element: <Home/>
      },

      {
        path: "/schedules",
        element: <Schedule />,
      },
      {
        path: "/blog",
        element: <BlogPost />,
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
        path: "/users/register",
        element: <RegisterUser />,
      },
      {
        path: "/review",
        element: <ClientReview />,
      },
      {
        path: "/reports",
        element: <ReportAnalytics />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
