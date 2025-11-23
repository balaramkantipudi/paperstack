import React from "react";
import { Button } from "@heroui/react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Icon } from "@iconify/react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export const Header: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "py-3 bg-background/90 backdrop-blur-md ambient-shadow"
        : "py-6 bg-transparent"
        }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-6 md:px-8 flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={() => navigateTo("landing")}>
          <Icon
            icon="lucide:layers"
            className="text-primary h-7 w-7 mr-2"
          />
          <span className="font-gilroy font-bold text-xl">Paperstack</span>
        </div>

        <nav className="hidden md:flex items-center space-x-10">
          <SignedOut>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How it works</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">Testimonials</a>
          </SignedOut>
          <SignedIn>
            <button onClick={() => navigateTo("dashboard")} className="text-sm font-medium hover:text-primary transition-colors">Dashboard</button>
            <button onClick={() => navigateTo("financial-dashboard")} className="text-sm font-medium hover:text-primary transition-colors">Financials</button>
            <button onClick={() => navigateTo("settings")} className="text-sm font-medium hover:text-primary transition-colors">Settings</button>
          </SignedIn>
        </nav>

        <div className="flex items-center space-x-5">
          <SignedOut>
            <Button
              variant="flat"
              color="default"
              size="sm"
              className="hidden md:flex"
              onPress={() => navigateTo("login")}
            >
              Log in
            </Button>
            <Button
              color="primary"
              size="sm"
              onPress={() => navigateTo("signup")}
            >
              Try free
            </Button>
          </SignedOut>

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </SignedIn>

          <Button
            isIconOnly
            variant="light"
            className="md:hidden"
            aria-label="Menu"
          >
            <Icon icon="lucide:menu" className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};