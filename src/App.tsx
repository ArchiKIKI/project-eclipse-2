import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import { HelmetProvider } from "react-helmet-async"
import Index from "./pages/Index"
import { Navigate } from "react-router-dom"
import ServicesPage from "./pages/ServicesPage"
import ContactsPage from "./pages/ContactsPage"
import PrintOrderPage from "./pages/PrintOrderPage"
import ScanOrderPage from "./pages/ScanOrderPage"
import CertificatesPage from "./pages/CertificatesPage"
import EquipmentPage from "./pages/EquipmentPage"
import ScrollTapes from "./components/landing/ScrollTapes"

const queryClient = new QueryClient()

const InnerPageTapes = () => {
  const { pathname } = useLocation()
  if (pathname === "/") return null
  return <ScrollTapes key={pathname} />
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <InnerPageTapes />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/print-order" element={<PrintOrderPage />} />
            <Route path="/scan-order" element={<ScanOrderPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
)

export default App