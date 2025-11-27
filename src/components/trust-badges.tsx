import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Icon } from "@iconify/react";

export const TrustBadges: React.FC = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const badges = [
        {
            icon: "lucide:shield-check",
            title: "Bank-Level Security",
            description: "256-bit encryption for all data",
            color: "text-primary-500"
        },
        {
            icon: "lucide:key",
            title: "Clerk Authentication",
            description: "Enterprise-grade auth & SSO",
            color: "text-secondary-500"
        },
        {
            icon: "lucide:credit-card",
            title: "Stripe Certified",
            description: "PCI compliance built-in",
            color: "text-success-500"
        },
        {
            icon: "lucide:globe",
            title: "GDPR Ready",
            description: "Full data privacy compliance",
            color: "text-warning-500"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <section className="py-20 bg-background border-y border-divider">
            <div className="container mx-auto px-6 md:px-8">
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    <motion.p
                        variants={itemVariants}
                        className="text-sm uppercase tracking-wider text-foreground-500 font-medium mb-10 text-center"
                    >
                        Your data is secure
                    </motion.p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {badges.map((badge, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="flex flex-col items-center text-center"
                            >
                                <div className={`h-14 w-14 rounded-full bg-foreground-50 border border-foreground-200 flex items-center justify-center mb-4 ${badge.color}`}>
                                    <Icon icon={badge.icon} className="h-7 w-7" />
                                </div>
                                <h4 className="font-semibold mb-1">{badge.title}</h4>
                                <p className="text-sm text-foreground-500">{badge.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
