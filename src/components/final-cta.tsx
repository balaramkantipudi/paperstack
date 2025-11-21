import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@heroui/react";
import { ScheduleDemoModal } from "./schedule-demo-modal";

export const FinalCTA: React.FC<{ navigateTo?: (view: string) => void }> = ({ navigateTo }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Add state for demo modal
  const [isDemoModalOpen, setIsDemoModalOpen] = React.useState(false);

  return (
    <section className="py-28 md:py-36 bg-primary-50 paper-texture relative overflow-hidden">
      <div className="absolute inset-0 blueprint-pattern opacity-10"></div>

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-gilroy font-bold text-3xl md:text-4xl text-foreground-900 mb-6">
            Start automating today
          </h2>
          <p className="text-foreground-600 text-lg mb-10">
            Join hundreds of construction companies saving time and reducing errors with Paperstack.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Button
              color="primary"
              size="lg"
              className="font-medium text-base"
              onPress={() => navigateTo && navigateTo("signup")}
            >
              Try free for 14 days
            </Button>
            <Button
              variant="bordered"
              color="default"
              size="lg"
              className="text-foreground-700 font-medium text-base"
              onPress={() => setIsDemoModalOpen(true)}
            >
              Schedule a demo
            </Button>
          </div>

          <p className="text-sm text-foreground-500 mt-5">
            No credit card required. Cancel anytime.
          </p>
        </motion.div>
      </div>

      {/* Add demo modal */}
      <ScheduleDemoModal
        isOpen={isDemoModalOpen}
        onOpenChange={setIsDemoModalOpen}
      />
    </section>
  );
};