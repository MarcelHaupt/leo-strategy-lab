import { Switch, Route, Router, useLocation } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SessionProvider } from '@/lib/session-store';
import { SessionHeader } from '@/components/SessionHeader';
import { SiteFooter } from '@/components/SiteFooter';
import NotFound from '@/pages/not-found';
import Welcome from '@/pages/Welcome';
import Modules from '@/pages/Modules';
import Module from '@/pages/Module';
import Report from '@/pages/Report';
import About from '@/pages/About';
import Tiny from '@/pages/Tiny';

function AppRouter() {
  const [location] = useLocation();
  const hideHeader = location === '/' || location === '';

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {!hideHeader && <SessionHeader />}
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Welcome} />
          <Route path="/modules" component={Modules} />
          <Route path="/module/:id" component={Module} />
          <Route path="/report" component={Report} />
          <Route path="/about" component={About} />
          <Route path="/tiny" component={Tiny} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <SiteFooter />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SessionProvider>
          <TooltipProvider>
            <Toaster />
            <Router hook={useHashLocation}>
              <AppRouter />
            </Router>
          </TooltipProvider>
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
