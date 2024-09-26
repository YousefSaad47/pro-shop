import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Header />
      <main className="flex-grow py-3 px-10 container mx-auto">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      <ToastContainer />
    </div>
  );
};

export default App;
