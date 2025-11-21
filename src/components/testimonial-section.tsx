import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Icon } from "@iconify/react";

export const TestimonialSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="testimonials" className="py-28 md:py-36 bg-background-50">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="font-gilroy font-bold text-3xl md:text-4xl mb-5">
              What our clients say
            </h2>
            <p className="text-foreground-500 text-lg">
              Join hundreds of construction companies saving time with Paperstack
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="bg-white rounded-lg p-10 md:p-12 ambient-shadow border border-foreground-100"
          >
            <div className="flex items-center gap-4 mb-8">
              <Icon icon="lucide:quote" className="h-10 w-10 text-primary-400" />
            </div>

            <blockquote className="text-xl md:text-2xl font-medium mb-10 text-foreground-800">
              "Paperstack reduced our document processing time by 90%. What used to take our team days now happens in minutes, with better accuracy and insights."
            </blockquote>

            <div className="flex items-center">
              <div className="h-14 w-14 rounded-full bg-foreground-200 mr-5"></div>
              <div>
                <div className="font-semibold text-lg">Sarah Johnson</div>
                <div className="text-sm text-foreground-500">Operations Director, MegaBuild Construction</div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-foreground-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Icon key={i} icon="ph:star-fill" className="h-5 w-5 text-secondary-400" />
                    ))}
                  </div>
                  <span className="ml-3 text-foreground-500">5.0 average rating</span>
                </div>
                <div className="h-8 w-32 bg-foreground-200 rounded"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};