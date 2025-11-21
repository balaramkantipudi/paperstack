import React from "react";
import { Button, Input, Checkbox, Divider, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Progress, Tooltip } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const SignupPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [fullName, setFullName] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [industry, setIndustry] = React.useState("Construction");
  const [companySize, setCompanySize] = React.useState("");
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [signupStep, setSignupStep] = React.useState(1);
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);

  const industries = [
    "Construction",
    "Architecture",
    "Engineering",
    "Real Estate",
    "Manufacturing",
    "Other"
  ];

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "500+ employees"
  ];

  const benefits = [
    {
      icon: "lucide:clock",
      text: "Save 85% of time spent on document processing"
    },
    {
      icon: "lucide:receipt",
      text: "Automatically identify tax deductions"
    },
    {
      icon: "lucide:check-circle",
      text: "99.8% accuracy with AI-powered extraction"
    }
  ];

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$49",
      description: "Perfect for small teams and simple projects",
      features: [
        "Process up to 100 documents/month",
        "Basic data extraction",
        "Email support",
        "1 user license"
      ],
      isPopular: false,
      color: "default"
    },
    {
      id: "professional",
      name: "Professional",
      price: "$149",
      description: "For growing teams with advanced needs",
      features: [
        "Process up to 500 documents/month",
        "Advanced data extraction & insights",
        "Priority support",
        "5 user licenses",
        "API access"
      ],
      isPopular: true,
      color: "primary"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with complex requirements",
      features: [
        "Unlimited document processing",
        "Custom AI model training",
        "Dedicated account manager",
        "Unlimited users",
        "Advanced security features"
      ],
      isPopular: false,
      color: "default"
    }
  ];

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          newErrors.fullName = "Full name is required";
        } else {
          delete newErrors.fullName;
        }
        break;
      case "companyName":
        if (!value.trim()) {
          newErrors.companyName = "Company name is required";
        } else {
          delete newErrors.companyName;
        }
        break;
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
      }
      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else {
          delete newErrors.password;
        }
        break;
      case "confirmPassword":
        if (value !== password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case "phoneNumber":
        // Phone is optional, so only validate if there's a value
        if (value && !/^\+?[0-9\s\-()]+$/.test(value)) {
          newErrors.phoneNumber = "Please enter a valid phone number";
        } else {
          delete newErrors.phoneNumber;
        }
        break;
      case "companySize":
        if (!value) {
          newErrors.companySize = "Please select company size";
        } else {
          delete newErrors.companySize;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleBlur = (name: string, value: string) => {
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return 0;

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 25;

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 25;

    // Contains number or special char
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;

    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 50) return "danger";
    if (strength < 75) return "warning";
    return "success";
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 50) return "Weak";
    if (strength < 75) return "Medium";
    return "Strong";
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordStrengthColor = getPasswordStrengthColor(passwordStrength);
  const passwordStrengthText = getPasswordStrengthText(passwordStrength);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (signupStep === 1) {
      // Validate all fields
      const fieldsToValidate = {
        fullName,
        companyName,
        email,
        password,
        confirmPassword,
        phoneNumber,
        companySize
      };

      Object.entries(fieldsToValidate).forEach(([name, value]) => {
        validateField(name, value);
        setTouched({ ...touched, [name]: true });
      });

      // Check if terms are agreed
      if (!agreeTerms) {
        setErrors({ ...errors, terms: "You must agree to the terms and conditions" });
        return;
      }

      // Check if there are any errors
      const hasErrors = Object.keys(errors).length > 0;
      if (hasErrors) {
        return;
      }

      // If all validations pass, proceed to step 2
      setSignupStep(2);
      window.scrollTo(0, 0);
    } else if (signupStep === 2) {
      // If plan is selected or skipped, proceed to step 3
      setSignupStep(3);
      window.scrollTo(0, 0);
    } else {
      // If all steps are completed, proceed to dashboard
      navigateTo("dashboard");
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const renderStep1 = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-foreground-700 mb-1">
            Full Name*
          </label>
          <Input
            id="fullName"
            value={fullName}
            onValueChange={setFullName}
            onBlur={() => handleBlur("fullName", fullName)}
            placeholder="John Doe"
            isInvalid={touched.fullName && !!errors.fullName}
            errorMessage={touched.fullName && errors.fullName}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-foreground-700 mb-1">
            Company/Business Name*
          </label>
          <Input
            id="companyName"
            value={companyName}
            onValueChange={setCompanyName}
            onBlur={() => handleBlur("companyName", companyName)}
            placeholder="Acme Construction"
            isInvalid={touched.companyName && !!errors.companyName}
            errorMessage={touched.companyName && errors.companyName}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground-700 mb-1">
            Email Address*
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onValueChange={setEmail}
            onBlur={() => handleBlur("email", email)}
            placeholder="your@email.com"
            isInvalid={touched.email && !!errors.email}
            errorMessage={touched.email && errors.email}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground-700 mb-1">
            Phone Number (optional)
          </label>
          <Input
            id="phoneNumber"
            value={phoneNumber}
            onValueChange={setPhoneNumber}
            onBlur={() => handleBlur("phoneNumber", phoneNumber)}
            placeholder="+1 (555) 123-4567"
            isInvalid={touched.phoneNumber && !!errors.phoneNumber}
            errorMessage={touched.phoneNumber && errors.phoneNumber}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground-700 mb-1">
            Password*
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onValueChange={setPassword}
            onBlur={() => handleBlur("password", password)}
            placeholder="••••••••"
            isInvalid={touched.password && !!errors.password}
            errorMessage={touched.password && errors.password}
            className="w-full"
          />
          {password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <Progress
                  value={passwordStrength}
                  maxValue={100}
                  color={passwordStrengthColor as any}
                  size="sm"
                  className="w-full"
                />
                <span className={`text-xs ml-2 text-${passwordStrengthColor}-500`}>
                  {passwordStrengthText}
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground-700 mb-1">
            Confirm Password*
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onValueChange={setConfirmPassword}
            onBlur={() => handleBlur("confirmPassword", confirmPassword)}
            placeholder="••••••••"
            isInvalid={touched.confirmPassword && !!errors.confirmPassword}
            errorMessage={touched.confirmPassword && errors.confirmPassword}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground-700 mb-1">
            Industry*
          </label>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="w-full justify-between"
                endContent={<Icon icon="lucide:chevron-down" className="h-4 w-4" />}
              >
                {industry}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Industry selection"
              onAction={(key) => setIndustry(industries[Number(key)])}
              selectedKeys={[industries.indexOf(industry).toString()]}
              selectionMode="single"
            >
              {industries.map((ind, index) => (
                <DropdownItem key={index}>{ind}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground-700 mb-1">
            Company Size*
          </label>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="w-full justify-between"
                endContent={<Icon icon="lucide:chevron-down" className="h-4 w-4" />}
                isInvalid={touched.companySize && !!errors.companySize}
              >
                {companySize || "Select company size"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Company size selection"
              onAction={(key) => {
                setCompanySize(companySizes[Number(key)]);
                handleBlur("companySize", companySizes[Number(key)]);
              }}
            >
              {companySizes.map((size, index) => (
                <DropdownItem key={index}>{size}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {touched.companySize && errors.companySize && (
            <p className="text-danger text-xs mt-1">{errors.companySize}</p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <Checkbox
          isSelected={agreeTerms}
          onValueChange={setAgreeTerms}
          color="primary"
          isInvalid={!!errors.terms}
        >
          <span className="text-sm">
            I agree to the <a href="#" className="text-primary hover:text-primary-600 transition-colors">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary-600 transition-colors">Privacy Policy</a>
          </span>
        </Checkbox>
      </div>
      {errors.terms && (
        <p className="text-danger text-xs mt-1">{errors.terms}</p>
      )}

      <Button
        color="primary"
        className="w-full font-medium py-6"
        type="submit"
      >
        Continue
      </Button>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="mb-8">
        <h3 className="font-dmsans font-semibold text-xl mb-2">Choose your plan</h3>
        <p className="text-foreground-500">Select the plan that best fits your needs. You can change or cancel anytime.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-lg p-6 cursor-pointer transition-all ${selectedPlan === plan.id
              ? 'border-primary-500 bg-primary-50'
              : 'border-foreground-200 hover:border-primary-300'
              }`}
            onClick={() => handleSelectPlan(plan.id)}
          >
            {plan.isPopular && (
              <div className="bg-primary-500 text-white text-xs font-bold py-1 px-3 rounded-full inline-block mb-3">
                MOST POPULAR
              </div>
            )}
            <h4 className="font-dmsans font-bold text-lg mb-2">{plan.name}</h4>
            <div className="flex items-end mb-3">
              <span className="text-2xl font-bold">{plan.price}</span>
              {plan.price !== "Custom" && <span className="text-foreground-500 ml-1">/month</span>}
            </div>
            <p className="text-sm text-foreground-500 mb-4">{plan.description}</p>
            <div className="space-y-2">
              {plan.features.slice(0, 3).map((feature, i) => (
                <div key={i} className="flex items-center text-sm">
                  <Icon
                    icon="lucide:check"
                    className={`h-4 w-4 mr-2 ${selectedPlan === plan.id ? 'text-primary-500' : 'text-foreground-500'}`}
                  />
                  <span>{feature}</span>
                </div>
              ))}
              {plan.features.length > 3 && (
                <div className="text-sm text-primary-500 font-medium">
                  +{plan.features.length - 3} more features
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          color="primary"
          className="flex-1 font-medium py-6"
          type="submit"
          disabled={!selectedPlan && selectedPlan !== "skip"}
        >
          Continue with {selectedPlan === "skip" ? "Free Trial" : plans.find(p => p.id === selectedPlan)?.name || "Selected Plan"}
        </Button>
        <Button
          variant="flat"
          color="default"
          className="flex-1 font-medium py-6"
          onPress={() => {
            setSelectedPlan("skip");
            setSignupStep(3);
            window.scrollTo(0, 0);
          }}
        >
          Skip for now (14-day trial)
        </Button>
      </div>

      <p className="text-center text-sm text-foreground-500 mt-4">
        You can change your plan anytime after signing up
      </p>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 mb-6">
          <Icon icon="lucide:check" className="h-10 w-10 text-primary-500" />
        </div>
        <h3 className="font-dmsans font-semibold text-xl mb-2">Account created successfully!</h3>
        <p className="text-foreground-500 mb-6">Your 14-day free trial starts now</p>

        {selectedPlan && selectedPlan !== "skip" && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <p className="font-medium">Selected Plan: {plans.find(p => p.id === selectedPlan)?.name}</p>
            <p className="text-sm text-foreground-500">You won't be charged until your trial ends</p>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-start">
          <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 mt-1">
            <Icon icon="lucide:upload" className="h-4 w-4 text-primary-500" />
          </div>
          <div>
            <p className="font-medium">Upload your first document</p>
            <p className="text-sm text-foreground-500">Start by uploading an invoice or receipt to see how it works</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 mt-1">
            <Icon icon="lucide:users" className="h-4 w-4 text-primary-500" />
          </div>
          <div>
            <p className="font-medium">Invite your team</p>
            <p className="text-sm text-foreground-500">Collaborate with your team members for better workflow</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 mt-1">
            <Icon icon="lucide:settings" className="h-4 w-4 text-primary-500" />
          </div>
          <div>
            <p className="font-medium">Complete your profile</p>
            <p className="text-sm text-foreground-500">Add your company details to personalize your experience</p>
          </div>
        </div>
      </div>

      <Button
        color="primary"
        className="w-full font-medium py-6"
        onPress={() => navigateTo("dashboard")}
      >
        Go to Dashboard
      </Button>
    </>
  );

  return (
    <div className="min-h-screen w-full bg-background paper-texture flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 blueprint-pattern opacity-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl bg-white rounded-lg ambient-shadow p-8 md:p-10 relative z-10"
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

        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <div className={`h-6 w-6 rounded-full ${signupStep >= 1 ? 'bg-primary-500 text-white' : 'bg-foreground-200'} flex items-center justify-center text-xs`}>
              1
            </div>
            <div className={`h-1 w-8 ${signupStep >= 2 ? 'bg-primary-500' : 'bg-foreground-200'}`}></div>
            <div className={`h-6 w-6 rounded-full ${signupStep >= 2 ? 'bg-primary-500 text-white' : 'bg-foreground-200'} flex items-center justify-center text-xs`}>
              2
            </div>
            <div className={`h-1 w-8 ${signupStep >= 3 ? 'bg-primary-500' : 'bg-foreground-200'}`}></div>
            <div className={`h-6 w-6 rounded-full ${signupStep >= 3 ? 'bg-primary-500 text-white' : 'bg-foreground-200'} flex items-center justify-center text-xs`}>
              3
            </div>
          </div>
        </div>

        <h1 className="font-gilroy text-2xl font-bold text-center mb-2">
          {signupStep === 1 && "Create your account"}
          {signupStep === 2 && "Choose your plan"}
          {signupStep === 3 && "You're all set!"}
        </h1>
        <p className="text-foreground-500 text-center mb-8">
          {signupStep === 1 && "Start automating your document processing"}
          {signupStep === 2 && "Select a plan that fits your needs"}
          {signupStep === 3 && "Let's get started with Paperstack"}
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {signupStep === 1 && renderStep1()}
          {signupStep === 2 && renderStep2()}
          {signupStep === 3 && renderStep3()}
        </form>

        {signupStep === 1 && (
          <>
            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-foreground-200"></div>
              <span className="flex-shrink-0 mx-4 text-foreground-400 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-foreground-200"></div>
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

            <div className="mt-8 text-center">
              <p className="text-sm text-foreground-500">
                Already have an account?{" "}
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary-600 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("login");
                  }}
                >
                  Log in
                </a>
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-foreground-200">
              <h3 className="font-dmsans font-semibold text-center mb-4">Why choose Paperstack?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 mt-1">
                      <Icon icon={benefit.icon} className="h-4 w-4 text-primary-500" />
                    </div>
                    <p className="text-sm text-foreground-600">{benefit.text}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-foreground-400 mt-6">
                Trusted by 500+ construction companies
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};