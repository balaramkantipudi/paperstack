import React from "react";
import {
  Button, Card, CardBody, Progress, Tooltip, Divider,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
} from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { documentService } from "../services/document-service";
import { useAuth } from "@clerk/clerk-react";
import { DocumentReviewModal } from "./document-review-modal";

export const DocumentUploadPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const { userId } = useAuth();
  const [dragActive, setDragActive] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [processingStep, setProcessingStep] = React.useState(0);
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [errorFile, setErrorFile] = React.useState<string | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const processingSteps = [
    { name: "Reading document (OCR)", icon: "lucide:scan-text" },
    { name: "Extracting information", icon: "lucide:file-search" },
    { name: "Categorizing expenses", icon: "lucide:list-filter" },
    { name: "Identifying tax deductions", icon: "lucide:receipt" }
  ];

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    // Filter out non-document files
    const validFiles = newFiles.filter(file =>
      file.type === "application/pdf" ||
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/heic"
    );

    // Check for potentially problematic files (e.g., very low resolution images)
    const potentiallyProblematicFiles = validFiles.filter(file =>
      (file.type.includes("image/") && file.size < 50000) // Less than 50KB might be too low resolution
    );

    if (potentiallyProblematicFiles.length > 0) {
      setErrorFile(potentiallyProblematicFiles[0].name);
      setShowErrorModal(true);
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const startUpload = async () => {
    if (files.length === 0) return;
    if (!userId) {
      console.error("User not authenticated, cannot upload documents.");
      // Optionally show an error message to the user
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setProcessingStep(0);

    try {
      // Check document limit based on plan
      const stats = await documentService.getStats();
      const currentMonthDocs = stats.totalProcessed; // This should ideally be filtered by current month

      // Fetch user's plan from Supabase subscriptions table
      const { data: subscription } = await (await import('../lib/supabase')).supabase
        .from('subscriptions')
        .select('plan_name, status')
        .eq('clerk_user_id', userId)
        .single();

      let documentLimit = 100; // Default to Starter plan limit
      if (subscription?.plan_name === 'Professional') {
        documentLimit = 500;
      } else if (subscription?.plan_name === 'Enterprise') {
        documentLimit = Infinity; // Unlimited
      }

      // Check if user has reached their limit
      if (currentMonthDocs >= documentLimit) {
        alert(`You've reached your plan's limit of ${documentLimit} documents per month. Please upgrade to process more documents.`);
        setIsUploading(false);
        return;
      }

      let uploadedDocName: string | null = null; // To store the name of the last uploaded doc for navigation

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(Math.floor((i / files.length) * 100)); // Update overall upload progress

        // Simulate processing steps for the current file
        for (let step = 0; step < processingSteps.length; step++) {
          setProcessingStep(step);
          await new Promise(resolve => setTimeout(resolve, 800)); // Simulate work
        }

        // Upload to Supabase
        const uploadedDoc = await documentService.uploadDocument(file, userId);
        uploadedDocName = uploadedDoc.name; // Keep track of the last uploaded doc's name
      }

      setUploadProgress(100);
      setProcessingStep(processingSteps.length); // Indicate all processing is done

      // Navigate after all files are processed and uploaded
      if (uploadedDocName) {
        localStorage.setItem('processing_document', uploadedDocName);
        setTimeout(() => navigateTo("document-processing"), 500);
      } else {
        // Handle case where no files were actually uploaded (e.g., if files array was empty initially)
        setIsUploading(false);
      }

    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const [reviewDoc, setReviewDoc] = React.useState<any | null>(null);
  const [isReviewOpen, setIsReviewOpen] = React.useState(false);

  // Listen for Realtime Updates to trigger Review Modal
  React.useEffect(() => {
    const subscription = documentService.subscribeToDocuments((payload) => {
      if (payload.eventType === 'UPDATE' && payload.new.status === 'needs_review') {
        // Check if this is the document we just uploaded (simplified check)
        // In a real app, we'd match IDs. For now, we just open the modal for the latest one.
        setReviewDoc(payload.new);
        setIsReviewOpen(true);
        setIsUploading(false); // Stop the spinner
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const simulateProcessing = (filename: string) => {
    // Legacy simulation - now handled by Realtime
  };

  const cancelUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setProcessingStep(0);
  };

  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf") return "lucide:file-text";
    if (file.type.includes("image/")) return "lucide:image";
    return "lucide:file";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-foreground-200 py-4">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigateTo("dashboard")}
          >
            <Icon
              icon="lucide:layers"
              className="text-primary h-7 w-7 mr-2"
            />
            <span className="font-gilroy font-bold text-xl">Paperstack</span>
          </div>

          <div className="flex items-center space-x-6">
            <Button
              variant="light"
              onPress={() => navigateTo("dashboard")}
              startContent={<Icon icon="lucide:arrow-left" className="h-4 w-4" />}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-gilroy text-2xl md:text-3xl font-bold mb-1">Upload Documents</h1>
            <p className="text-foreground-500">Upload invoices, receipts, or other documents for processing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Area */}
          <div className="lg:col-span-2">
            <Card className="ambient-shadow mb-6">
              <CardBody className="p-6">
                <h2 className="font-gilroy text-lg font-bold mb-6">Upload Documents</h2>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-foreground-200'
                    } transition-colors relative`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.heic"
                  />

                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="mb-4 p-4 bg-primary-50 rounded-full">
                      <Icon
                        icon="lucide:hard-hat"
                        className="h-12 w-12 text-primary-500"
                      />
                    </div>
                    <h3 className="font-dmsans font-semibold text-lg mb-2">
                      Drag & drop documents here
                    </h3>
                    <p className="text-foreground-500 mb-6 max-w-md">
                      Upload invoices, receipts, contracts, or any construction-related documents.
                      We support PDF, JPEG, PNG, and HEIC formats.
                    </p>
                    <Button
                      color="primary"
                      onPress={handleButtonClick}
                      startContent={<Icon icon="lucide:upload" className="h-4 w-4" />}
                    >
                      Browse Files
                    </Button>
                    <div className="mt-4 flex items-center gap-4">
                      <Button
                        variant="light"
                        size="sm"
                        startContent={<Icon icon="lucide:smartphone" className="h-4 w-4" />}
                      >
                        Use Camera
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        startContent={<Icon icon="lucide:cloud" className="h-4 w-4" />}
                      >
                        Import from Cloud
                      </Button>
                    </div>
                  </div>
                </div>

                {files.length > 0 && !isUploading && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-dmsans font-semibold">Selected Files ({files.length})</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="flat"
                          color="danger"
                          size="sm"
                          onPress={() => setFiles([])}
                        >
                          Clear All
                        </Button>
                        <Button
                          color="primary"
                          size="sm"
                          onPress={startUpload}
                          startContent={<Icon icon="lucide:upload-cloud" className="h-4 w-4" />}
                        >
                          Start Upload
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-foreground-200 rounded-md"
                        >
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-md bg-primary-50 flex items-center justify-center mr-4">
                              <Icon
                                icon={getFileIcon(file)}
                                className="h-5 w-5 text-primary-500"
                              />
                            </div>
                            <div>
                              <p className="font-medium truncate max-w-xs">{file.name}</p>
                              <p className="text-xs text-foreground-500">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            color="danger"
                            onPress={() => removeFile(index)}
                          >
                            <Icon icon="lucide:x" className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-dmsans font-semibold">
                        {uploadProgress < 100 ? "Uploading..." : "Processing..."}
                      </h3>
                      {uploadProgress < 100 && (
                        <Button
                          variant="flat"
                          color="danger"
                          size="sm"
                          onPress={cancelUpload}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>

                    {uploadProgress < 100 ? (
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-foreground-500">Uploading {files.length} files</span>
                          <span className="text-sm font-medium">{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} color="primary" className="mb-4" />
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {processingSteps.map((step, index) => (
                          <div key={index} className="flex items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${processingStep > index
                              ? "bg-success-100"
                              : processingStep === index
                                ? "bg-primary-100"
                                : "bg-foreground-100"
                              }`}>
                              {processingStep > index ? (
                                <Icon
                                  icon="lucide:check"
                                  className="h-5 w-5 text-success-500"
                                />
                              ) : processingStep === index ? (
                                <Icon
                                  icon={step.icon}
                                  className="h-5 w-5 text-primary-500"
                                />
                              ) : (
                                <Icon
                                  icon={step.icon}
                                  className="h-5 w-5 text-foreground-400"
                                />
                              )}
                            </div>
                            <div>
                              <p className={`font-medium ${processingStep > index
                                ? "text-success-600"
                                : processingStep === index
                                  ? "text-primary-600"
                                  : "text-foreground-400"
                                }`}>
                                {step.name}
                              </p>
                              {processingStep === index && (
                                <div className="h-1 w-24 bg-foreground-100 rounded-full mt-1 overflow-hidden">
                                  <motion.div
                                    className="h-full bg-primary-500 rounded-full"
                                    animate={{
                                      x: ["0%", "100%"],
                                    }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 1,
                                      ease: "linear"
                                    }}
                                    style={{ width: "30%" }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Tips & Information */}
          <div>
            <Card className="ambient-shadow mb-6">
              <CardBody className="p-6">
                <h2 className="font-gilroy text-lg font-bold mb-4">Tips for Best Results</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 mt-0.5">
                      <Icon icon="lucide:scan" className="h-4 w-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium">Ensure documents are clear</p>
                      <p className="text-sm text-foreground-500">
                        Make sure scans or photos are well-lit and text is clearly visible.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 mt-0.5">
                      <Icon icon="lucide:maximize" className="h-4 w-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium">Capture the entire document</p>
                      <p className="text-sm text-foreground-500">
                        Ensure all edges and important information are visible in the frame.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 mt-0.5">
                      <Icon icon="lucide:file-stack" className="h-4 w-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium">Batch upload for efficiency</p>
                      <p className="text-sm text-foreground-500">
                        Upload multiple documents at once to save time.
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <h2 className="font-gilroy text-lg font-bold mb-4">Supported Document Types</h2>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-primary-50 flex items-center justify-center mr-3">
                      <Icon icon="lucide:file-text" className="h-4 w-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium">Invoices & Receipts</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-primary-50 flex items-center justify-center mr-3">
                      <Icon icon="lucide:file-signature" className="h-4 w-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium">Contracts & Agreements</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-primary-50 flex items-center justify-center mr-3">
                      <Icon icon="lucide:scale" className="h-4 w-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium">Permits & Licenses</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-primary-50 flex items-center justify-center mr-3">
                      <Icon icon="lucide:clipboard-list" className="h-4 w-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium">Change Orders</p>
                    </div>
                  </div>
                </div>

                <Divider className="my-4" />

                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground-500">Need help?</p>
                  <Button
                    variant="flat"
                    color="primary"
                    size="sm"
                    startContent={<Icon icon="lucide:help-circle" className="h-4 w-4" />}
                  >
                    Get Support
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>

      {/* Error Modal */}
      <Modal isOpen={showErrorModal} onOpenChange={() => setShowErrorModal(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center">
                  <Icon icon="lucide:alert-triangle" className="text-warning-500 h-5 w-5 mr-2" />
                  <span>Potential Quality Issue</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <p>
                  The file <span className="font-medium">{errorFile}</span> may have quality issues that could affect processing accuracy.
                </p>
                <p className="text-foreground-500 text-sm">
                  For best results, ensure:
                </p>
                <ul className="text-sm text-foreground-500 list-disc pl-5 space-y-1">
                  <li>Document is well-lit and not blurry</li>
                  <li>All text is clearly visible</li>
                  <li>The entire document is captured</li>
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" color="default" onPress={onClose}>
                  Replace File
                </Button>
                <Button color="primary" onPress={onClose}>
                  Continue Anyway
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <DocumentReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        document={reviewDoc}
        onSave={(updatedDoc) => {
          console.log("Document approved:", updatedDoc);
          navigateTo("documents");
        }}
      />
    </div>
  );
};