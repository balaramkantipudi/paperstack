import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Icon } from "@iconify/react";

export const FeaturesSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const features = [
    {
      icon: "lucide:clock",
      title: "85% less time processing",
      description: "Our AI extracts and categorizes document data in seconds, not hours.",
      color: "primary",
    },
    {
      icon: "lucide:check-circle",
      title: "99.8% accuracy rate",
      description: "Advanced machine learning ensures precise data extraction with minimal errors.",
      color: "secondary",
    },
    {
      icon: "lucide:link",
      title: "Seamless integrations",
      description: "Connect with your existing tools and workflows without disruption.",
      color: "primary",
    },
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
  
  return (
    <section id="features" className="py-28 md:py-36 bg-background paper-texture">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-gilroy font-bold text-3xl md:text-4xl mb-5"
          >
            Powerful automation for construction documents
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-foreground-500 text-lg max-w-2xl mx-auto"
          >
            Focus on building, not paperwork. Our platform handles the document processing so you can focus on what matters.
          </motion.p>
        </div>
        
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center p-8"
            >
              <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-7 bg-${feature.color === "primary" ? "primary" : "secondary"}-50 border border-${feature.color === "primary" ? "primary" : "secondary"}-100`}>
                <Icon 
                  icon={feature.icon} 
                  className={`h-7 w-7 text-${feature.color === "primary" ? "primary" : "secondary"}-500`} 
                />
              </div>
              <h3 className="font-dmsans font-semibold text-xl mb-4">{feature.title}</h3>
              <p className="text-foreground-500">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};