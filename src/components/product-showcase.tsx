import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Icon } from "@iconify/react";
import { Button, Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/react";

export const ProductShowcase: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  const highlightPoints = [
    { icon: "lucide:search", text: "Intelligent document search" },
    { icon: "lucide:bar-chart", text: "Real-time analytics" },
    { icon: "lucide:file-text", text: "Automated document processing" },
  ];
  
  return (
    <section className="py-28 md:py-36 bg-background-50">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-gilroy font-bold text-3xl md:text-4xl mb-6">
                Designed for the way you work
              </h2>
              <p className="text-foreground-500 text-lg mb-10">
                Our intuitive dashboard puts everything you need at your fingertips. Process documents, track progress, and gain insights—all in one place.
              </p>
              
              <div className="space-y-5">
                {highlightPoints.map((point, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                    className="flex items-center gap-4"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center">
                      <Icon icon={point.icon} className="h-5 w-5 text-primary-500" />
                    </div>
                    <span className="font-medium">{point.text}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="mt-10"
              >
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<Icon icon="lucide:play" className="h-4 w-4" />}
                  onPress={onOpen}
                >
                  Watch product demo
                </Button>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-lg overflow-hidden ambient-shadow"
            >
              {/* Dashboard Header */}
              <div className="bg-foreground-100 h-10 w-full flex items-center px-4 gap-2">
                <div className="h-3 w-3 rounded-full bg-foreground-300"></div>
                <div className="h-3 w-3 rounded-full bg-foreground-300"></div>
                <div className="h-3 w-3 rounded-full bg-foreground-300"></div>
                <div className="flex items-center ml-4 bg-white px-3 py-1 rounded text-xs">
                  <Icon icon="lucide:layout-dashboard" className="h-3 w-3 text-primary-500 mr-1" />
                  <span>Dashboard</span>
                </div>
              </div>
              
              <div className="bg-white p-6">
                {/* Dashboard Header with User */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium mb-1">Welcome back, Sarah</h3>
                    <p className="text-xs text-foreground-500">Here's what's happening with your projects today</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <Icon icon="lucide:bell" className="h-4 w-4 text-primary-500" />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-foreground-200"></div>
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="bg-foreground-50 p-4 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Documents</div>
                      <Icon icon="lucide:file-text" className="h-4 w-4 text-primary-500" />
                    </div>
                    <div className="text-2xl font-bold mb-1">128</div>
                    <div className="flex items-center text-xs text-success-500">
                      <Icon icon="lucide:trending-up" className="h-3 w-3 mr-1" />
                      <span>+12% this week</span>
                    </div>
                  </div>
                  <div className="bg-foreground-50 p-4 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Projects</div>
                      <Icon icon="lucide:clipboard-check" className="h-4 w-4 text-secondary-500" />
                    </div>
                    <div className="text-2xl font-bold mb-1">8</div>
                    <div className="flex items-center text-xs text-foreground-500">
                      <Icon icon="lucide:minus" className="h-3 w-3 mr-1" />
                      <span>No change</span>
                    </div>
                  </div>
                  <div className="bg-foreground-50 p-4 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Due Today</div>
                      <Icon icon="lucide:calendar" className="h-4 w-4 text-warning-500" />
                    </div>
                    <div className="text-2xl font-bold mb-1">3</div>
                    <div className="flex items-center text-xs text-warning-500">
                      <Icon icon="lucide:alert-circle" className="h-3 w-3 mr-1" />
                      <span>Action needed</span>
                    </div>
                  </div>
                </div>
                
                {/* Recent Document */}
                <div className="bg-white border border-foreground-200 rounded p-5 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Icon icon="lucide:file-text" className="h-4 w-4 text-primary-500 mr-2" />
                      <span className="font-medium">Recent Document</span>
                    </div>
                    <div className="text-xs text-primary-500">View All</div>
                  </div>
                  
                  <div className="border border-foreground-100 rounded p-3 mb-3">
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">Invoice #2458</div>
                      <div className="text-xs bg-success-100 text-success-700 px-2 py-0.5 rounded-full">Processed</div>
                    </div>
                    <div className="text-xs text-foreground-500 mb-2">BuildSupply Inc. • $6,275.00</div>
                    <div className="flex justify-between text-xs">
                      <div className="text-foreground-500">Added 2 hours ago</div>
                      <div className="text-primary-500">View Details</div>
                    </div>
                  </div>
                  
                  <div className="border border-foreground-100 rounded p-3">
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">Permit Application</div>
                      <div className="text-xs bg-warning-100 text-warning-700 px-2 py-0.5 rounded-full">Pending</div>
                    </div>
                    <div className="text-xs text-foreground-500 mb-2">City Planning Dept. • $350.00</div>
                    <div className="flex justify-between text-xs">
                      <div className="text-foreground-500">Added 5 hours ago</div>
                      <div className="text-primary-500">View Details</div>
                    </div>
                  </div>
                </div>
                
                {/* Charts */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-foreground-50 p-4 rounded h-40">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-medium">Monthly Expenses</div>
                      <Icon icon="lucide:bar-chart-2" className="h-4 w-4 text-primary-500" />
                    </div>
                    <div className="h-24 w-full bg-white rounded border border-foreground-200 p-2">
                      <div className="flex h-full items-end justify-between">
                        <div className="h-1/3 w-3 bg-primary-200 rounded-t"></div>
                        <div className="h-1/2 w-3 bg-primary-300 rounded-t"></div>
                        <div className="h-2/3 w-3 bg-primary-400 rounded-t"></div>
                        <div className="h-3/4 w-3 bg-primary-500 rounded-t"></div>
                        <div className="h-1/2 w-3 bg-primary-400 rounded-t"></div>
                        <div className="h-2/5 w-3 bg-primary-300 rounded-t"></div>
                        <div className="h-1/4 w-3 bg-primary-200 rounded-t"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-foreground-50 p-4 rounded h-40">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-medium">Expense Categories</div>
                      <Icon icon="lucide:pie-chart" className="h-4 w-4 text-secondary-500" />
                    </div>
                    <div className="h-24 w-full bg-white rounded border border-foreground-200 flex items-center justify-center">
                      <div className="relative h-16 w-16">
                        <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-secondary-500 border-r-secondary-500"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-warning-500 border-l-warning-500" style={{transform: "rotate(45deg)"}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white rounded-full h-16 w-16 flex items-center justify-center ambient-shadow cursor-pointer"
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpen}
              >
                <Icon icon="lucide:play" className="h-6 w-6" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Video Demo Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="4xl"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody className="p-0 overflow-hidden">
              <div className="relative aspect-video bg-foreground-900 w-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Icon icon="lucide:loader-2" className="h-10 w-10 mx-auto animate-spin mb-4" />
                    <p>Loading product demo...</p>
                  </div>
                </div>
                <Button
                  isIconOnly
                  variant="flat"
                  color="default"
                  className="absolute top-4 right-4 bg-foreground-800/50 text-white"
                  onPress={onClose}
                >
                  <Icon icon="lucide:x" className="h-5 w-5" />
                </Button>
              </div>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
};