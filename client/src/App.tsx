import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import MoodPage from "@/pages/Mood";
import NotesPage from "@/pages/Notes";
import LettersPage from "@/pages/Letters";
import JournalPage from "@/pages/Journal";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen bg-[#FDFCF8]" />;

  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      <Route path="/">
        {!isAuthenticated ? <Redirect to="/login" /> : <Dashboard />}
      </Route>
      <Route path="/mood">
        {!isAuthenticated ? <Redirect to="/login" /> : <MoodPage />}
      </Route>
      <Route path="/notes">
        {!isAuthenticated ? <Redirect to="/login" /> : <NotesPage />}
      </Route>
      <Route path="/letters">
        {!isAuthenticated ? <Redirect to="/login" /> : <LettersPage />}
      </Route>
      <Route path="/journal">
        {!isAuthenticated ? <Redirect to="/login" /> : <JournalPage />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
