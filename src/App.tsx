import React from "react";
import { Button } from "@heroui/react";
import { Header } from "./components/header";
import { HeroSection } from "./components/hero-section";
import { SocialProofBar } from "./components/social-proof-bar";
import { FeaturesSection } from "./components/features-section";
import { ProductShowcase } from "./components/product-showcase";
import { HowItWorks } from "./components/how-it-works";
import { TestimonialSection } from "./components/testimonial-section";
import { PricingSection } from "./components/pricing-section";
import { FinalCTA } from "./components/final-cta";
import { Footer } from "./components/footer";
import { LoginPage } from "./components/login-page";
import { DashboardPage } from "./components/dashboard-page";
import { DocumentProcessingView } from "./components/document-processing-view";
import { SignupPage } from "./components/signup-page";
import { ProfilePage } from "./components/profile-page";
import { SettingsPage } from "./components/settings-page";
import { DocumentUploadPage } from "./components/document-upload-page";
import { AccountingIntegrationView } from "./components/accounting-integration-view";

// ... existing imports ...


import { DocumentReviewPage } from "./components/document-review-page";
import { FinancialDashboardPage } from "./components/financial-dashboard-page";
import { VendorManagementPage } from "./components/vendor-management-page";
import { FloatingCTA } from "./components/floating-cta";
import { PrivacyPage } from "./components/privacy-page";
import { TermsPage } from "./components/terms-page";
import { AboutPage } from "./components/about-page";
import { ContactPage } from "./components/contact-page";

function App() {
  // Change from hardcoded to state-based view management
  const [view, setView] = React.useState("landing");

  // Function to handle navigation between views
  const navigateTo = (targetView: string) => {
    setView(targetView);
    // Update URL without page reload
    window.history.pushState({}, "", `/${targetView === "landing" ? "" : targetView}`);
  };

  // Check URL on initial load
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path === "/login") setView("login");
    if (path === "/signup") setView("signup");
    if (path === "/dashboard") setView("dashboard");
    if (path === "/document-processing") setView("document-processing");
    if (path === "/document-upload") setView("document-upload");
    if (path === "/document-review") setView("document-review");
    if (path === "/financial-dashboard") setView("financial-dashboard");
    if (path === "/vendor-management") setView("vendor-management");
    if (path === "/profile") setView("profile");
    if (path === "/settings") setView("settings");
    if (path === "/accounting") setView("accounting");
    if (path === "/privacy") setView("privacy");
    if (path === "/terms") setView("terms");
    if (path === "/about") setView("about");
    if (path === "/contact") setView("contact");

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/") setView("landing");
      else if (path === "/login") setView("login");
      else if (path === "/signup") setView("signup");
      else if (path === "/dashboard") setView("dashboard");
      else if (path === "/document-processing") setView("document-processing");
      else if (path === "/document-upload") setView("document-upload");
      else if (path === "/document-review") setView("document-review");
      else if (path === "/financial-dashboard") setView("financial-dashboard");
      else if (path === "/vendor-management") setView("vendor-management");
      else if (path === "/profile") setView("profile");
      else if (path === "/settings") setView("settings");
      else if (path === "/accounting") setView("accounting");
      else if (path === "/privacy") setView("privacy");
      else if (path === "/terms") setView("terms");
      else if (path === "/about") setView("about");
      else if (path === "/contact") setView("contact");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="min-h-screen bg-background font-roboto text-foreground">
      {view === "landing" && (
        <>
          <Header navigateTo={navigateTo} />
          <main className="space-y-0">
            <HeroSection navigateTo={navigateTo} />
            <SocialProofBar />
            <FeaturesSection />
            <ProductShowcase />
            <HowItWorks />
            <TestimonialSection />
            <PricingSection navigateTo={navigateTo} />
            <FinalCTA navigateTo={navigateTo} />
          </main>
          <Footer navigateTo={navigateTo} />
          <FloatingCTA navigateTo={navigateTo} />
        </>
      )}

      {view === "login" && <LoginPage navigateTo={navigateTo} />}
      {view === "signup" && <SignupPage navigateTo={navigateTo} />}
      {view === "dashboard" && <DashboardPage navigateTo={navigateTo} />}
      {view === "document-processing" && <DocumentProcessingView navigateTo={navigateTo} />}
      {view === "document-upload" && <DocumentUploadPage navigateTo={navigateTo} />}
      {view === "document-review" && <DocumentReviewPage navigateTo={navigateTo} />}
      {view === "financial-dashboard" && <FinancialDashboardPage navigateTo={navigateTo} />}
      {view === "vendor-management" && <VendorManagementPage navigateTo={navigateTo} />}
      {view === "profile" && <ProfilePage navigateTo={navigateTo} />}
      {view === "settings" && <SettingsPage navigateTo={navigateTo} />}
      {view === "accounting" && <AccountingIntegrationView navigateTo={navigateTo} />}
      {view === "privacy" && <PrivacyPage navigateTo={navigateTo} />}
      {view === "terms" && <TermsPage navigateTo={navigateTo} />}
      {view === "about" && <AboutPage navigateTo={navigateTo} />}
      {view === "contact" && <ContactPage navigateTo={navigateTo} />}
    </div>
  );
}

export default App;