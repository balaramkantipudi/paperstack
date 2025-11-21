import React from "react";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { ScheduleDemoModal } from "./schedule-demo-modal";

interface FloatingCTAProps {
  navigateTo?: (view: string) => void;
}

export const FloatingCTA: React.FC<FloatingCTAProps> = ({ navigateTo }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = React.useState(false);
  
  React.useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA after scrolling down 60% of viewport height
      const scrollThreshold = window.innerHeight * 0.6;
      setIsVisible(window.scrollY > scrollThreshold);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none"
          >
            <div className="container mx-auto max-w-5xl">
              <div className="bg-white shadow-lg rounded-lg border border-foreground-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
                <div className="flex items-center">
                  <div className="hidden sm:block h-10 w-10 rounded-full bg-primary-100 flex-shrink-0 mr-4">
                    <Icon icon="lucide:zap" className="h-5 w-5 text-primary-500 m-2.5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Ready to streamline your document workflow?</h3>
                    <p className="text-sm text-foreground-500">Start your 14-day free trial or schedule a demo</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Button
                    variant="flat"
                    color="default"
                    onPress={() => setIsDemoModalOpen(true)}
                  >
                    Schedule Demo
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => navigateTo && navigateTo("signup")}
                  >
                    Start Free Trial
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <ScheduleDemoModal 
        isOpen={isDemoModalOpen}
        onOpenChange={setIsDemoModalOpen}
      />
    </>
  );
};