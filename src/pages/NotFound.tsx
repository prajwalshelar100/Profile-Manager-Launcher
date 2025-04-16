
import React from 'react';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/10">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-7xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! We couldn't find the page you're looking for.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          The page at <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code> does not exist.
        </p>
        <Button asChild className="flex items-center gap-2">
          <a href="/">
            <Home className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
