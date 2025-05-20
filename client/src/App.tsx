import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Notifications from "@/pages/notifications";
import TournamentDetail from "@/pages/tournament-detail";
import Tournaments from "@/pages/tournaments";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import NavBar from "@/components/nav-bar";
import { AuthProvider, useAuth } from "@/contexts/auth-context";

function Router() {
  const [location] = useLocation();
  const { currentUser } = useAuth();

  // If user is not logged in and not on the auth page, redirect to auth
  if (!currentUser && location !== "/") {
    window.location.href = "/";
    return null;
  }

  // If user is logged in and on the auth page, redirect to dashboard
  if (currentUser && location === "/") {
    window.location.href = "/dashboard";
    return null;
  }

  // Show navigation bar only if user is logged in
  const showNavBar = currentUser && location !== "/";

  return (
    <div className="min-h-screen bg-dark text-text-primary">
      {showNavBar && <NavBar />}
      <main className={showNavBar ? "pt-16 px-4 md:px-8 lg:px-12" : ""}>
        <Switch>
          <Route path="/" component={Auth} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/tournaments" component={Tournaments} />
          <Route path="/tournament/:id" component={TournamentDetail} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
