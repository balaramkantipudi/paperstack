import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export const SocialProofBar: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const companies = [
    { name: "BuildCorp", icon: "logos:airbnb" },
    { name: "ConstructX", icon: "logos:dropbox" },
    { name: "MegaBuild", icon: "logos:slack" },
    { name: "UrbanDev", icon: "logos:zoom" },
    { name: "StructureTech", icon: "logos:asana" },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  return (
    <section className="py-20 bg-background border-b border-divider">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center"
        >
          <motion.p 
            variants={itemVariants}
            className="text-sm uppercase tracking-wider text-foreground-500 font-medium mb-10"
          >
            Trusted by leading contractors
          </motion.p>
          
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10">
            {companies.map((company, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="opacity-50 hover:opacity-90 transition-opacity duration-300"
              >
                <div className="h-8 w-28 bg-foreground-200 rounded-sm"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};