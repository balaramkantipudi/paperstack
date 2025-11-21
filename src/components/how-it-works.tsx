import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Icon } from "@iconify/react";
import { Button, Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/react";

export const HowItWorks: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const steps = [
    {
      icon: "lucide:upload-cloud",
      title: "Upload",
      description: "Drag and drop your construction documents into the platform.",
      color: "primary",
    },
    {
      icon: "lucide:cpu",
      title: "AI processes",
      description: "Our AI extracts, categorizes, and organizes all relevant information.",
      color: "secondary",
    },
    {
      icon: "lucide:check-circle",
      title: "Done",
      description: "Access structured data, insights, and automated workflows.",
      color: "primary",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="how-it-works" className="py-28 md:py-36 bg-background paper-texture">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-gilroy font-bold text-3xl md:text-4xl mb-5"
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-foreground-500 text-lg max-w-2xl mx-auto"
          >
            Three simple steps to transform your document processing
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center text-center relative"
              >
                <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-7 bg-${step.color === "primary" ? "primary" : "secondary"}-50 border border-${step.color === "primary" ? "primary" : "secondary"}-100 z-10`}>
                  <Icon
                    icon={step.icon}
                    className={`h-7 w-7 text-${step.color === "primary" ? "primary" : "secondary"}-500`}
                  />
                </div>
                <h3 className="font-dmsans font-semibold text-xl mb-4">{step.title}</h3>
                <p className="text-foreground-500">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-24 left-full w-8 h-0.5 bg-foreground-200 transform -translate-x-4"></div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
            className="mt-20 text-center"
          >
            <Button
              variant="flat"
              color="primary"
              startContent={<Icon icon="lucide:play" className="h-4 w-4" />}
              className="font-medium py-6 px-8"
              onPress={onOpen}
            >
              See how it works
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Animation Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody className="p-0 overflow-hidden">
              <ProcessAnimation onClose={onClose} />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
};

// Process Animation Component
const ProcessAnimation: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = React.useState(0);
  const [showDashboard, setShowDashboard] = React.useState(false);
  const maxSteps = 4;

  React.useEffect(() => {
    // Auto-progress through steps
    if (step < maxSteps) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, step === 0 ? 1000 : 2000);

      return () => clearTimeout(timer);
    } else if (step === maxSteps) {
      // Show dashboard after last step
      const timer = setTimeout(() => {
        setShowDashboard(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="relative bg-background h-[600px] w-full">
      {/* Close button */}
      <Button
        isIconOnly
        variant="light"
        className="absolute top-4 right-4 z-50"
        onPress={onClose}
      >
        <Icon icon="lucide:x" className="h-5 w-5" />
      </Button>

      {/* Progress indicator */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-3/4 max-w-md z-40">
        <div className="flex justify-between mb-2">
          {["Upload", "Process", "Categorize", "Complete"].map((label, idx) => (
            <div
              key={idx}
              className={`text-xs font-medium ${step >= idx ? "text-primary-500" : "text-foreground-400"}`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="h-1 w-full bg-foreground-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / maxSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Upload animation */}
      <AnimatePresence>
        {step === 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-lg w-[80%] max-w-lg p-6">
              <div className="border-2 border-dashed border-foreground-200 rounded-lg p-8 flex flex-col items-center">
                <div className="mb-4 p-4 bg-primary-50 rounded-full">
                  <Icon icon="lucide:upload-cloud" className="h-12 w-12 text-primary-500" />
                </div>
                <h3 className="font-medium text-lg mb-2">Drag & drop documents here</h3>
                <p className="text-foreground-500 text-center mb-4">Upload invoices, receipts, or any construction document</p>

                <motion.div
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                >
                  <div className="h-20 w-16 bg-foreground-100 rounded flex items-center justify-center">
                    <Icon icon="lucide:file-text" className="h-8 w-8 text-foreground-400" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Processing animation */}
        {step === 1 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-lg w-[80%] max-w-lg p-6">
              <div className="flex flex-col items-center">
                <div className="mb-6 p-4 bg-secondary-50 rounded-full">
                  <Icon icon="lucide:cpu" className="h-12 w-12 text-secondary-500" />
                </div>
                <h3 className="font-medium text-lg mb-2">AI Processing</h3>
                <p className="text-foreground-500 text-center mb-6">Our AI is extracting information from your document</p>

                <div className="w-full max-w-sm">
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <Icon icon="lucide:scan-text" className="h-4 w-4 text-primary-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Reading document (OCR)</span>
                        <span className="text-sm">100%</span>
                      </div>
                      <div className="h-1.5 w-full bg-foreground-100 rounded-full">
                        <div className="h-full bg-success-500 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="h-8 w-8 rounded-full bg-secondary-100 flex items-center justify-center mr-3">
                      <Icon icon="lucide:file-search" className="h-4 w-4 text-secondary-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Extracting information</span>
                        <span className="text-sm">65%</span>
                      </div>
                      <div className="h-1.5 w-full bg-foreground-100 rounded-full">
                        <motion.div
                          className="h-full bg-secondary-500 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "65%" }}
                          transition={{ duration: 1 }}
                        ></motion.div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-foreground-100 flex items-center justify-center mr-3">
                      <Icon icon="lucide:list-filter" className="h-4 w-4 text-foreground-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-foreground-400">Categorizing expenses</span>
                        <span className="text-sm">Waiting...</span>
                      </div>
                      <div className="h-1.5 w-full bg-foreground-100 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Categorizing animation */}
        {step === 2 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-lg w-[80%] max-w-lg p-6">
              <div className="flex flex-col items-center">
                <div className="mb-6 p-4 bg-primary-50 rounded-full">
                  <Icon icon="lucide:list-filter" className="h-12 w-12 text-primary-500" />
                </div>
                <h3 className="font-medium text-lg mb-2">Categorizing Expenses</h3>
                <p className="text-foreground-500 text-center mb-6">Identifying and organizing line items</p>

                <div className="w-full max-w-sm space-y-4">
                  <motion.div
                    className="p-3 border border-foreground-200 rounded-md"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium">Concrete Mix (200 bags)</div>
                      <div className="text-primary-600 font-medium">$3,600.00</div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary-500 mr-2"></div>
                        <span className="text-xs text-foreground-500">Materials</span>
                      </div>
                      <div className="text-xs bg-success-100 text-success-700 px-2 py-0.5 rounded-full">Tax Deductible</div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-3 border border-foreground-200 rounded-md"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium">Electrical Wiring (1000ft)</div>
                      <div className="text-primary-600 font-medium">$2,600.00</div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-secondary-500 mr-2"></div>
                        <span className="text-xs text-foreground-500">Electrical</span>
                      </div>
                      <div className="text-xs bg-success-100 text-success-700 px-2 py-0.5 rounded-full">Tax Deductible</div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-3 border border-foreground-200 rounded-md"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium">Delivery Fee</div>
                      <div className="text-primary-600 font-medium">$75.00</div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-warning-500 mr-2"></div>
                        <span className="text-xs text-foreground-500">Equipment Rental</span>
                      </div>
                      <div className="text-xs bg-foreground-100 text-foreground-500 px-2 py-0.5 rounded-full">Non-Deductible</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Complete animation */}
        {step === 3 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-lg w-[80%] max-w-lg p-6">
              <div className="flex flex-col items-center">
                <motion.div
                  className="mb-6 p-4 bg-success-50 rounded-full"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <Icon icon="lucide:check-circle" className="h-12 w-12 text-success-500" />
                </motion.div>
                <h3 className="font-medium text-lg mb-2">Processing Complete</h3>
                <p className="text-foreground-500 text-center mb-6">Your document has been successfully processed</p>

                <div className="w-full max-w-sm p-4 border border-foreground-200 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-foreground-500">Document Type:</span>
                    <span className="font-medium">Invoice #2458</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-foreground-500">Vendor:</span>
                    <span className="font-medium">BuildSupply Inc.</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-foreground-500">Total Amount:</span>
                    <span className="font-medium">$6,275.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-500">Project:</span>
                    <span className="font-medium">Downtown Office Tower</span>
                  </div>
                </div>

                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    color="primary"
                    className="px-8"
                  >
                    View in Dashboard
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dashboard View */}
        {showDashboard && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-full w-full bg-background p-4">
              {/* Mock Dashboard Header */}
              <div className="bg-white border-b border-foreground-200 py-3 px-4 flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                    <Icon icon="lucide:layers" className="h-5 w-5 text-primary-500" />
                  </div>
                  <span className="font-bold">Paperstack</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-6 w-6 rounded-full bg-foreground-200"></div>
                  <div className="h-6 w-6 rounded-full bg-foreground-200"></div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <motion.div
                  className="bg-white p-4 rounded-md shadow-sm"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-foreground-500">Recently Uploaded</div>
                    <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center">
                      <Icon icon="lucide:upload-cloud" className="h-4 w-4 text-primary-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">12</div>
                </motion.div>

                <motion.div
                  className="bg-white p-4 rounded-md shadow-sm"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-foreground-500">Awaiting Review</div>
                    <div className="h-8 w-8 rounded-full bg-warning-50 flex items-center justify-center">
                      <Icon icon="lucide:file-search" className="h-4 w-4 text-warning-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">5</div>
                </motion.div>

                <motion.div
                  className="bg-white p-4 rounded-md shadow-sm"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-foreground-500">Processed & Synced</div>
                    <div className="h-8 w-8 rounded-full bg-success-50 flex items-center justify-center">
                      <Icon icon="lucide:check-circle" className="h-4 w-4 text-success-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">248</div>
                </motion.div>
              </div>

              {/* Recent Documents */}
              <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Recent Documents</h3>
                  <div className="text-xs text-primary-500">View All</div>
                </div>

                <div className="space-y-3">
                  <motion.div
                    className="flex items-center justify-between p-3 bg-primary-50 border border-primary-100 rounded-md"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center mr-3">
                        <Icon icon="lucide:file-text" className="h-4 w-4 text-primary-500" />
                      </div>
                      <div>
                        <div className="font-medium">Invoice #2458</div>
                        <div className="text-xs text-foreground-500">BuildSupply Inc. • $6,275.00</div>
                      </div>
                    </div>
                    <div className="text-xs bg-success-100 text-success-700 px-2 py-0.5 rounded-full">Processed</div>
                  </motion.div>

                  <motion.div
                    className="flex items-center justify-between p-3 hover:bg-foreground-50 rounded-md"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-primary-50 flex items-center justify-center mr-3">
                        <Icon icon="lucide:file-text" className="h-4 w-4 text-primary-500" />
                      </div>
                      <div>
                        <div className="font-medium">Permit Application</div>
                        <div className="text-xs text-foreground-500">City Planning Dept. • $350.00</div>
                      </div>
                    </div>
                    <div className="text-xs bg-warning-100 text-warning-700 px-2 py-0.5 rounded-full">Awaiting Review</div>
                  </motion.div>

                  <motion.div
                    className="flex items-center justify-between p-3 hover:bg-foreground-50 rounded-md"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-primary-50 flex items-center justify-center mr-3">
                        <Icon icon="lucide:receipt" className="h-4 w-4 text-primary-500" />
                      </div>
                      <div>
                        <div className="font-medium">Material Receipt</div>
                        <div className="text-xs text-foreground-500">Metro Concrete • $2,450.75</div>
                      </div>
                    </div>
                    <div className="text-xs bg-success-100 text-success-700 px-2 py-0.5 rounded-full">Processed</div>
                  </motion.div>
                </div>
              </div>

              {/* Expense Chart */}
              <motion.div
                className="bg-white p-4 rounded-md shadow-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Expense Breakdown</h3>
                  <div className="text-xs text-primary-500">View Details</div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-primary-500 mr-2"></div>
                        <span className="text-sm">Materials</span>
                      </div>
                      <span className="text-sm font-medium">$45,250</span>
                    </div>
                    <div className="h-2 w-full bg-foreground-100 rounded-full">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: "38%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-success-500 mr-2"></div>
                        <span className="text-sm">Labor</span>
                      </div>
                      <span className="text-sm font-medium">$32,800</span>
                    </div>
                    <div className="h-2 w-full bg-foreground-100 rounded-full">
                      <div className="h-full bg-success-500 rounded-full" style={{ width: "27%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-secondary-500 mr-2"></div>
                        <span className="text-sm">Subcontractors</span>
                      </div>
                      <span className="text-sm font-medium">$24,600</span>
                    </div>
                    <div className="h-2 w-full bg-foreground-100 rounded-full">
                      <div className="h-full bg-secondary-500 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};