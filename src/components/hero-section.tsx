import React from "react";
import { Button, Image } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { ScheduleDemoModal } from "./schedule-demo-modal";

export const HeroSection: React.FC<{ navigateTo?: (view: string) => void }> = ({ navigateTo }) => {
  // Add state for demo modal
  const [isDemoModalOpen, setIsDemoModalOpen] = React.useState(false);

  return (
    <section className="relative gradient-blue overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="absolute inset-0 blueprint-pattern opacity-20"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2 text-foreground">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 text-foreground">
                Document automation built for construction
              </h1>
              <p className="text-xl md:text-2xl text-foreground-500 mb-8 max-w-xl">
                From invoice to insight in seconds. Save time, reduce errors, and focus on what matters.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <Button
                  color="secondary"
                  size="lg"
                  className="font-medium text-base"
                  onPress={() => navigateTo && navigateTo("signup")}
                >
                  Try free for 14 days
                </Button>
                <Button
                  variant="flat"
                  color="default"
                  size="lg"
                  className="bg-white/10 text-white font-medium text-base"
                  startContent={<Icon icon="lucide:calendar" className="h-4 w-4" />}
                  onPress={() => setIsDemoModalOpen(true)}
                >
                  Schedule demo
                </Button>
              </div>

              <p className="text-sm text-white/60 mt-4">
                No credit card required. Cancel anytime.
              </p>
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative"
            >
              <DocumentAnimation />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add demo modal */}
      <ScheduleDemoModal
        isOpen={isDemoModalOpen}
        onOpenChange={setIsDemoModalOpen}
      />
    </section>
  );
};

const DocumentAnimation: React.FC = () => {
  // Add state to track which insight is currently shown
  const [currentInsight, setCurrentInsight] = React.useState(0);
  const [currentCategory, setCurrentCategory] = React.useState(0);

  // Array of insights to cycle through
  const insights = [
    "Similar to last month's expenses. Consider bulk ordering for 12% savings.",
    "3 invoices from this vendor in the last 30 days. Consider negotiating terms.",
    "This expense category is 15% higher than your quarterly average."
  ];

  // Array of categories to cycle through
  const categories = [
    { name: "Materials", percentage: "75%" },
    { name: "Labor", percentage: "62%" },
    { name: "Equipment", percentage: "48%" }
  ];

  // Projects to cycle through
  const projects = [
    "Office Tower",
    "Harbor Bridge",
    "City Center Mall"
  ];

  // Effect to cycle through insights
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [insights.length]);

  // Effect to cycle through categories
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCategory((prev) => (prev + 1) % categories.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [categories.length]);

  return (
    <div className="relative aspect-video bg-white/95 backdrop-blur-sm rounded-lg p-6 ambient-shadow overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-secondary-400"></div>

      <div className="flex items-start gap-8">
        <motion.div
          className="w-1/2 bg-white rounded-md ambient-shadow p-5 relative"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {/* Simplified Invoice */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-primary-50 rounded-md flex items-center justify-center mr-3 border border-primary-100">
                <Icon icon="lucide:file-text" className="h-5 w-5 text-primary-600" />
              </div>
              <div className="font-medium">Invoice</div>
            </div>
            <div className="text-xs font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              #2458
            </div>
          </div>

          {/* Simplified Invoice Content */}
          <div className="space-y-4 mb-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Icon icon="lucide:building" className="h-4 w-4 text-foreground-500 mr-2" />
                <span className="text-sm">BuildSupply Inc.</span>
              </div>
              <span className="text-sm font-medium">May 15, 2023</span>
            </div>

            <div className="h-px w-full bg-foreground-100"></div>

            <motion.div
              className="flex justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="font-medium">Total Amount</span>
              <span className="font-bold text-primary-600">$6,275.00</span>
            </motion.div>
          </div>

          {/* Line Items */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="flex items-center">
              <Icon icon="lucide:package" className="h-4 w-4 text-foreground-500 mr-2" />
              <div className="text-sm flex-1">Construction Materials</div>
            </div>
            <div className="flex items-center">
              <Icon icon="lucide:hard-hat" className="h-4 w-4 text-foreground-500 mr-2" />
              <div className="text-sm flex-1">Equipment Rental</div>
            </div>
            <div className="flex items-center">
              <Icon icon="lucide:truck" className="h-4 w-4 text-foreground-500 mr-2" />
              <div className="text-sm flex-1">Delivery Services</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="w-1/2 bg-primary-50 rounded-md ambient-shadow p-5"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {/* Simplified Processed Document */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-white rounded-md flex items-center justify-center mr-3 border border-primary-100">
                <Icon icon="lucide:check-circle" className="h-5 w-5 text-primary-500" />
              </div>
              <div className="font-medium">Processed</div>
            </div>
            <motion.div
              className="text-xs font-medium text-success-600 bg-success-50 px-3 py-1 rounded-full flex items-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
            >
              <Icon icon="lucide:check" className="h-3 w-3 mr-1" />
              COMPLETE
            </motion.div>
          </div>

          {/* Animated Category Card */}
          <div className="space-y-4 mb-6">
            <motion.div
              className="bg-white rounded-md p-4 border border-primary-100"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Icon icon="lucide:tag" className="h-4 w-4 text-primary-500 mr-2" />
                  <span className="font-medium">Category</span>
                </div>
                <AnimatedText items={categories.map(c => c.name)} interval={3000} />
              </div>
              <div className="h-1.5 w-full bg-foreground-100 rounded-full">
                <motion.div
                  className="h-full bg-primary-500 rounded-full"
                  animate={{ width: categories[currentCategory].percentage }}
                  transition={{ duration: 1 }}
                />
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-md p-4 border border-foreground-100"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Icon icon="lucide:building-2" className="h-4 w-4 text-secondary-500 mr-2" />
                  <span className="font-medium">Project</span>
                </div>
                <AnimatedText items={projects} interval={3500} />
              </div>
              <div className="flex items-center text-xs mt-1">
                <div className="bg-success-100 text-success-600 px-2 py-0.5 rounded-full">
                  Tax Deductible
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Insights with animation */}
          <motion.div
            className="bg-white rounded-md p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <div className="flex items-center mb-3">
              <div className="h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                <Icon icon="lucide:sparkles" className="h-3 w-3 text-primary-600" />
              </div>
              <span className="text-sm font-medium">AI Insights</span>
            </div>

            <div className="h-[40px] relative overflow-hidden">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0 text-xs text-foreground-600 bg-foreground-50 p-2 rounded"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: currentInsight === index ? 1 : 0,
                    y: currentInsight === index ? 0 : 20
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {insight}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-white/90"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.div
          animate={{
            rotate: [0, 0, 180, 180, 0],
            scale: [1, 0.8, 0.8, 1, 1],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <Icon icon="lucide:file-text" className="h-16 w-16 text-primary-400" />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-4 right-4 flex items-center gap-2 text-foreground-600 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Icon icon="lucide:zap" className="h-4 w-4 text-primary-500" />
        <span>AI-powered extraction</span>
      </motion.div>
    </div>
  );
};

// Animated text component that cycles through items
const AnimatedText: React.FC<{ items: string[], interval: number }> = ({ items, interval }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval]);

  return (
    <div className="relative h-5 overflow-hidden w-24 text-right">
      {items.map((item, index) => (
        <motion.span
          key={index}
          className="absolute right-0 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: currentIndex === index ? 1 : 0,
            y: currentIndex === index ? 0 : 10
          }}
          transition={{ duration: 0.3 }}
        >
          {item}
        </motion.span>
      ))}
    </div>
  );
};