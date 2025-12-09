import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth-context-provider";
import { HomePage } from "@/components/pages/home-page";
import { TechPageWrapper } from "@/components/pages/tech-page-wrapper";
import { OGPreviewPage } from "@/pages/og-preview";
import { SharedPolaroidPage } from "@/pages/shared-polaroid";
import { AdminPolaroidsPage } from "@/components/pages/admin-polaroids-page";
import { AdminRoute } from "@/components/admin/admin-route";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tech" element={<TechPageWrapper />} />
            <Route path="/c/:slug" element={<SharedPolaroidPage />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPolaroidsPage />
                </AdminRoute>
              }
            />
            {import.meta.env.DEV && (
              <Route path="/og-preview/:slug" element={<OGPreviewPage />} />
            )}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
