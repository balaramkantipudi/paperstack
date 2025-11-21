import React from "react";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Checkbox
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface ScheduleDemoModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const ScheduleDemoModal: React.FC<ScheduleDemoModalProps> = ({ isOpen, onOpenChange }) => {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    jobTitle: "",
    companySize: "",
    projectTypes: [] as string[],
    currentSolution: "",
    preferredDate: "",
    preferredTime: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    message: "",
    marketingConsent: false
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const companyOptions = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-500", label: "201-500 employees" },
    { value: "501+", label: "501+ employees" }
  ];

  const projectTypeOptions = [
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "industrial", label: "Industrial" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "renovation", label: "Renovation" }
  ];

  const currentSolutionOptions = [
    { value: "manual", label: "Manual process" },
    { value: "spreadsheets", label: "Spreadsheets" },
    { value: "accounting", label: "Accounting software" },
    { value: "erp", label: "ERP system" },
    { value: "other", label: "Other solution" }
  ];

  const timezoneOptions = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "America/Anchorage", label: "Alaska Time (AKT)" },
    { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" }
  ];

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const toggleProjectType = (type: string) => {
    if (formData.projectTypes.includes(type)) {
      setFormData({
        ...formData,
        projectTypes: formData.projectTypes.filter(t => t !== type)
      });
    } else {
      setFormData({
        ...formData,
        projectTypes: [...formData.projectTypes, type]
      });
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setStep(1);
        onOpenChange(false);
      }, 3000);
    }, 1500);
  };

  const handleClose = () => {
    // Reset state when modal is closed
    setStep(1);
    setIsSuccess(false);
    onOpenChange(false);
  };

  const isStep1Valid = formData.firstName && formData.lastName && formData.email && formData.companyName;
  const isStep2Valid = formData.companySize && formData.projectTypes.length > 0 && formData.currentSolution;

  // Get today's date in YYYY-MM-DD format for the date input min value
  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-montserrat font-bold">Schedule a Personalized Demo</h2>
              <p className="text-sm text-foreground-500 font-normal">
                See how our platform can streamline your construction document management
              </p>
            </ModalHeader>
            
            <ModalBody>
              {!isSuccess ? (
                <div className="relative">
                  {/* Progress Steps */}
                  <div className="flex justify-between mb-8 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-foreground-100 -translate-y-1/2 z-0"></div>
                    
                    {[1, 2, 3].map((stepNumber) => (
                      <div 
                        key={stepNumber}
                        className="flex flex-col items-center relative z-10"
                      >
                        <div 
                          className={`h-8 w-8 rounded-full flex items-center justify-center mb-2 ${
                            step >= stepNumber 
                              ? 'bg-primary text-white' 
                              : 'bg-foreground-100 text-foreground-500'
                          }`}
                        >
                          {stepNumber}
                        </div>
                        <span className="text-xs text-foreground-500">
                          {stepNumber === 1 ? 'Basic Info' : 
                           stepNumber === 2 ? 'Company Details' : 
                           'Schedule'}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Step 1: Basic Information */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-semibold">Tell us about yourself</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          placeholder="Enter your first name"
                          value={formData.firstName}
                          onValueChange={(value) => handleInputChange("firstName", value)}
                          isRequired
                        />
                        
                        <Input
                          label="Last Name"
                          placeholder="Enter your last name"
                          value={formData.lastName}
                          onValueChange={(value) => handleInputChange("lastName", value)}
                          isRequired
                        />
                      </div>
                      
                      <Input
                        label="Work Email"
                        placeholder="Enter your work email"
                        type="email"
                        value={formData.email}
                        onValueChange={(value) => handleInputChange("email", value)}
                        isRequired
                      />
                      
                      <Input
                        label="Phone Number"
                        placeholder="Enter your phone number"
                        type="tel"
                        value={formData.phone}
                        onValueChange={(value) => handleInputChange("phone", value)}
                      />
                      
                      <Input
                        label="Company Name"
                        placeholder="Enter your company name"
                        value={formData.companyName}
                        onValueChange={(value) => handleInputChange("companyName", value)}
                        isRequired
                      />
                      
                      <Input
                        label="Job Title"
                        placeholder="Enter your job title"
                        value={formData.jobTitle}
                        onValueChange={(value) => handleInputChange("jobTitle", value)}
                      />
                    </motion.div>
                  )}
                  
                  {/* Step 2: Company Details */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-semibold">Tell us about your company</h3>
                      
                      <Select
                        label="Company Size"
                        placeholder="Select company size"
                        selectedKeys={formData.companySize ? [formData.companySize] : []}
                        onChange={(e) => handleInputChange("companySize", e.target.value)}
                        isRequired
                      >
                        {companyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Project Types <span className="text-danger">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {projectTypeOptions.map((option) => (
                            <Checkbox
                              key={option.value}
                              isSelected={formData.projectTypes.includes(option.value)}
                              onValueChange={() => toggleProjectType(option.value)}
                            >
                              {option.label}
                            </Checkbox>
                          ))}
                        </div>
                      </div>
                      
                      <Select
                        label="Current Document Management Solution"
                        placeholder="Select current solution"
                        selectedKeys={formData.currentSolution ? [formData.currentSolution] : []}
                        onChange={(e) => handleInputChange("currentSolution", e.target.value)}
                        isRequired
                      >
                        {currentSolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                      
                      <Textarea
                        label="What challenges are you looking to solve?"
                        placeholder="Tell us about your current document management challenges"
                        value={formData.message}
                        onValueChange={(value) => handleInputChange("message", value)}
                      />
                    </motion.div>
                  )}
                  
                  {/* Step 3: Schedule */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-semibold">Schedule your demo</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Input
                            type="date"
                            label="Preferred Date"
                            min={today}
                            value={formData.preferredDate}
                            onValueChange={(value) => handleInputChange("preferredDate", value)}
                            isRequired
                          />
                        </div>
                        
                        <div>
                          <Select
                            label="Preferred Time"
                            placeholder="Select a time"
                            selectedKeys={formData.preferredTime ? [formData.preferredTime] : []}
                            onChange={(e) => handleInputChange("preferredTime", e.target.value)}
                            isRequired
                          >
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                      </div>
                      
                      <Select
                        label="Time Zone"
                        selectedKeys={[formData.timezone]}
                        onChange={(e) => handleInputChange("timezone", e.target.value)}
                      >
                        {timezoneOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                      
                      <div className="bg-foreground-50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">What to expect during your demo</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <Icon icon="lucide:check" className="h-4 w-4 text-primary-500 mr-2 mt-0.5" />
                            <span>Personalized walkthrough of our document automation platform</span>
                          </li>
                          <li className="flex items-start">
                            <Icon icon="lucide:check" className="h-4 w-4 text-primary-500 mr-2 mt-0.5" />
                            <span>Q&A session with our product specialists</span>
                          </li>
                          <li className="flex items-start">
                            <Icon icon="lucide:check" className="h-4 w-4 text-primary-500 mr-2 mt-0.5" />
                            <span>Custom pricing information based on your needs</span>
                          </li>
                          <li className="flex items-start">
                            <Icon icon="lucide:check" className="h-4 w-4 text-primary-500 mr-2 mt-0.5" />
                            <span>Demo typically lasts 30-45 minutes</span>
                          </li>
                        </ul>
                      </div>
                      
                      <Checkbox
                        isSelected={formData.marketingConsent}
                        onValueChange={(value) => handleInputChange("marketingConsent", value)}
                      >
                        <span className="text-sm">
                          I agree to receive marketing communications from DocuBuild. You can unsubscribe at any time.
                        </span>
                      </Checkbox>
                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-6"
                >
                  <div className="h-16 w-16 bg-success-100 rounded-full flex items-center justify-center mb-4">
                    <Icon icon="lucide:check" className="h-8 w-8 text-success-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Demo Scheduled!</h3>
                  <p className="text-center text-foreground-600 mb-4 max-w-md">
                    Thank you for scheduling a demo. We've sent a confirmation email to <span className="font-medium">{formData.email}</span> with all the details.
                  </p>
                  <div className="bg-foreground-50 p-4 rounded-md w-full max-w-md">
                    <div className="flex items-center mb-2">
                      <Icon icon="lucide:calendar" className="h-4 w-4 text-primary-500 mr-2" />
                      <span className="font-medium">Demo Details</span>
                    </div>
                    <p className="text-sm text-foreground-600">
                      {formData.preferredDate} at {formData.preferredTime} ({formData.timezone})
                    </p>
                  </div>
                </motion.div>
              )}
            </ModalBody>
            
            <ModalFooter>
              {!isSuccess && (
                <>
                  {step > 1 && (
                    <Button 
                      variant="flat" 
                      onPress={handleBack}
                      startContent={<Icon icon="lucide:arrow-left" className="h-4 w-4" />}
                    >
                      Back
                    </Button>
                  )}
                  
                  {step < 3 ? (
                    <Button 
                      color="primary" 
                      onPress={handleNext}
                      isDisabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                      endContent={<Icon icon="lucide:arrow-right" className="h-4 w-4" />}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button 
                      color="primary" 
                      onPress={handleSubmit}
                      isLoading={isSubmitting}
                    >
                      Schedule Demo
                    </Button>
                  )}
                </>
              )}
              
              {isSuccess && (
                <Button 
                  color="primary" 
                  onPress={onClose}
                >
                  Close
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};