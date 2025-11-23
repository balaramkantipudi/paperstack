import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const LoginPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  return (
    <div className="min-h-screen w-full bg-background paper-texture flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 blueprint-pattern opacity-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white rounded-lg ambient-shadow p-8 md:p-10 relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigateTo("landing")}
          >
            <Icon
              icon="lucide:layers"
              className="text-primary h-7 w-7 mr-2"
            />
            <span className="font-gilroy font-bold text-xl">Paperstack</span>
          </div>
        </div>

        <div className="flex justify-center">
          <SignIn
            signUpUrl="/signup"
            forceRedirectUrl="/dashboard"
          />
        </div>
      </motion.div>
    </div>
  );
};