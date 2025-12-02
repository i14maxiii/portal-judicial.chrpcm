import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/protected-route";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import DashboardPage from "@/pages/dashboard";
import SearchPage from "@/pages/search";
import CausesPage from "@/pages/causes";
import CauseNewPage from "@/pages/cause-new";
import CauseDetailPage from "@/pages/cause-detail";
import CauseEditPage from "@/pages/cause-edit";
import TrashPage from "@/pages/trash";
import ProfilePage from "@/pages/profile";
import BackgroundPage from "@/pages/background";
import CertificatePage from "@/pages/certificate";
import ConfiscationNewPage from "@/pages/confiscation-new";
import CitationNewPage from "@/pages/citation-new";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && <Navbar />}
      <Switch>
        <Route path="/">
          {isAuthenticated ? (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          ) : (
            <LandingPage />
          )}
        </Route>

        <Route path="/dashboard">
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        </Route>

        <Route path="/busqueda">
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        </Route>

        <Route path="/causas">
          <ProtectedRoute>
            <CausesPage />
          </ProtectedRoute>
        </Route>

        <Route path="/causas/nueva">
          <ProtectedRoute>
            <CauseNewPage />
          </ProtectedRoute>
        </Route>

        <Route path="/causas/:id">
          <ProtectedRoute>
            <CauseDetailPage />
          </ProtectedRoute>
        </Route>

        <Route path="/causas/:id/editar">
          <ProtectedRoute>
            <CauseEditPage />
          </ProtectedRoute>
        </Route>

        <Route path="/papelera">
          <ProtectedRoute>
            <TrashPage />
          </ProtectedRoute>
        </Route>

        <Route path="/perfil">
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        </Route>

        <Route path="/hoja-de-vida">
          <ProtectedRoute>
            <BackgroundPage />
          </ProtectedRoute>
        </Route>

        <Route path="/certificado">
          <ProtectedRoute>
            <CertificatePage />
          </ProtectedRoute>
        </Route>

        <Route path="/incautacion/nueva">
          <ProtectedRoute>
            <ConfiscationNewPage />
          </ProtectedRoute>
        </Route>

        <Route path="/citacion/nueva">
          <ProtectedRoute>
            <CitationNewPage />
          </ProtectedRoute>
        </Route>

        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
