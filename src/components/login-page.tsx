import React from "react";
import { Button, Input, Checkbox, Divider } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const LoginPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberDevice, setRememberDevice] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    navigateTo("dashboard");
  };

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

        <h1 className="font-gilroy text-2xl font-bold text-center mb-2">Welcome back</h1>
        <p className="text-foreground-500 text-center mb-8">Sign in to your account</p>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground-700 mb-1">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onValueChange={setEmail}
              placeholder="your@email.com"
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-foreground-700">
                Password
              </label>
              <a href="#" className="text-sm font-medium text-primary hover:text-primary-600 transition-colors">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onValueChange={setPassword}
              placeholder="••••••••"
              className="w-full"
            />
          </div>

          <div className="flex items-center">
            <Checkbox
              isSelected={rememberDevice}
              onValueChange={setRememberDevice}
              color="primary"
            >
              <span className="text-sm">Remember this device</span>
            </Checkbox>
          </div>

          <Button
            color="primary"
            className="w-full font-medium py-6"
            type="submit"
          >
            Sign in
          </Button>

          <div className="relative flex items-center justify-center my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-foreground-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-foreground-400">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="bordered"
              className="flex items-center justify-center"
              isIconOnly
            >
              <Icon icon="logos:google-icon" className="h-5 w-5" />
            </Button>
            <Button
              variant="bordered"
              className="flex items-center justify-center"
              isIconOnly
            >
              <Icon icon="logos:microsoft-icon" className="h-5 w-5" />
            </Button>
            <Button
              variant="bordered"
              className="flex items-center justify-center"
              isIconOnly
            >
              <Icon icon="logos:apple" className="h-5 w-5" />
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-foreground-500">
            Don't have an account?{" "}
            <a
              href="#"
              className="font-medium text-primary hover:text-primary-600 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("signup");
              }}
            >
              Sign up for free
            </a>
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-foreground-200">
          <p className="text-xs text-center text-foreground-400">
            Trusted by 500+ construction companies
          </p>
        </div>
      </motion.div>
    </div>
  );
};