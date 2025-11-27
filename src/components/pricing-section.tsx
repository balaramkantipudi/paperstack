import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ScheduleDemoModal } from "./schedule-demo-modal";

export const PricingSection: React.FC<{ navigateTo?: (view: string) => void }> = ({ navigateTo }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const plans = [
    {
      name: "Starter",
      price: "$49",
      description: "Perfect for solo contractors and small businesses",
      features: [
        "Process up to 100 documents/month",
        "AI-powered data extraction",
        "Smart document titles (Vendor - Date)",
        "Project budget tracking",
        "Email support"
      ],
      isPopular: false,
      color: "default"
    },
    {
      name: "Professional",
      price: "$149",
      description: "For growing businesses with higher volume",
      features: [
        "Process up to 500 documents/month",
        "Everything in Starter",
        "Weekly tax summary emails",
        "Priority email support",
        "Advanced reporting dashboard"
      ],
      isPopular: true,
      color: "primary"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with custom needs",
      features: [
        "Unlimited document processing",
        "Everything in Professional",
        "Custom integrations (QuickBooks, Xero)",
        "Dedicated account manager",
        "SLA & priority support"
      ],
      isPopular: false,
      color: "default"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  // Add state for demo modal
  const [isDemoModalOpen, setIsDemoModalOpen] = React.useState(false);

  return (
    <section id="pricing" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-gilroy font-bold text-3xl md:text-4xl mb-5"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-foreground-500 text-lg max-w-2xl mx-auto"
          >
            Choose the plan that's right for your business
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                className={`overflow-visible h-full border-2 ${plan.isPopular ? 'border-primary shadow-md' : 'border-transparent'}`}
                disableRipple
              >
                <CardBody className="p-8 flex flex-col h-full">
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold py-1 px-3 rounded-bl-lg rounded-tr-lg z-10">
                      MOST POPULAR
                    </div>
                  )}

                  <h3 className="font-dmsans font-bold text-xl mb-3 mt-4">{plan.name}</h3>
                  <div className="flex items-end mb-5">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-foreground-500 ml-1">/month</span>}
                  </div>
                  <p className="text-foreground-500 mb-8">{plan.description}</p>

                  <div className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <Icon
                          icon="lucide:check"
                          className={`h-5 w-5 mr-4 ${plan.isPopular ? 'text-primary-500' : 'text-foreground-500'}`}
                        />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    color={plan.isPopular ? "primary" : "default"}
                    variant={plan.isPopular ? "solid" : "bordered"}
                    className="w-full font-medium"
                    onPress={() => plan.price === "Custom" ? setIsDemoModalOpen(true) : navigateTo && navigateTo("signup")}
                  >
                    {plan.price === "Custom" ? "Contact sales" : "Get started"}
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-foreground-500">
            All plans include a 14-day free trial. No credit card required.
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