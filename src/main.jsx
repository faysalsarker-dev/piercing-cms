import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { RouterProvider } from "react-router-dom";


import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from './router/router';
import AuthContext from "./context/AuthContext";


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContext>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="bottom-right"  reverseOrder={false} />
      </QueryClientProvider>
    </AuthContext>
  </React.StrictMode>
);