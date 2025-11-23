import { HeroUIProvider, ToastProvider } from "@heroui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import './index.css';

import App from "./App.tsx";

// Get Clerk publishable key from environment
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key. Add VITE_CLERK_PUBLISHABLE_KEY to your .env.local file");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: '#006FEE',
          fontFamily: 'Gilroy, sans-serif',
          borderRadius: '0.5rem',
        },
        layout: {
          socialButtonsPlacement: 'bottom',
          socialButtonsVariant: 'blockButton',
        },
        elements: {
          card: "shadow-none border border-foreground-200",
          navbar: "hidden",
          navbarMobileMenuButton: "hidden",
          headerTitle: "font-gilroy font-bold",
          headerSubtitle: "font-dmsans",
        }
      }}
    >
      <HeroUIProvider>
        <ToastProvider />
        <main className="text-foreground bg-background">
          <App />
        </main>
      </HeroUIProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
