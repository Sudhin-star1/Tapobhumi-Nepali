import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPackages from "./pages/admin/Packages";
import AdminServices from "./pages/admin/Services";
import AdminTreks from "./pages/admin/Treks";
import AdminTours from "./pages/admin/Tours";
import AdminGallery from "./pages/admin/Gallery";
import AdminContact from "./pages/admin/Contact";
import AdminEnquiries from "./pages/admin/Enquiries";
import AdminExperts from "./pages/admin/Experts";
import { AdminAuthProvider } from "@/admin/auth";
import { RequireAdmin } from "@/admin/RequireAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="experts" element={<AdminExperts />} />
                <Route path="packages" element={<AdminPackages />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="treks" element={<AdminTreks />} />
                <Route path="tours" element={<AdminTours />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="contact" element={<AdminContact />} />
              </Route>
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
