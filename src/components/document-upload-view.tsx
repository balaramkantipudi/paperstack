import React from "react";
import { Button, Card, CardBody, Progress, Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const DocumentUploadView: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const [processingFiles, setProcessingFiles] = React.useState<{ name: string, progress: number, status: string }[]>([]);
  const [showMobileUpload, setShowMobileUpload] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Mock processing statuses
  const statuses = ["Reading document", "Extracting information", "Categorizing expenses", "Identifying tax deductions", "Complete"];

  React.useEffect(() => {
    // Simulate processing for any uploaded files
    if (uploadedFiles.length > 0 && processingFiles.length < uploadedFiles.length) {
      const newFiles = uploadedFiles.slice(processingFiles.length).map(file => ({
        name: file.name,
        progress: 0,
        status: statuses[0]
      }));

      setProcessingFiles([...processingFiles, ...newFiles]);
    }
  }, [uploadedFiles]);

  React.useEffect(() => {
    // Simulate progress for processing files
    const interval = setInterval(() => {
      setProcessingFiles(prevFiles =>
        prevFiles.map(file => {
          if (file.progress >= 100) return file;

          const newProgress = Math.min(file.progress + 5, 100);
          const statusIndex = Math.floor((newProgress / 100) * (statuses.length - 1));

          return {
            ...file,
            progress: newProgress,
            status: statuses[statusIndex]
          };
        })
      );
    }, 300);

    return () => clearInterval(interval);
  }, [processingFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleProcessedDocumentClick = (index: number) => {
    if (processingFiles[index].progress === 100) {
      // Save mock document details for the processing view
      localStorage.setItem("mock_processing_document", processingFiles[index].name);
      navigateTo("document-processing");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-foreground-200 py-4">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="light"
              startContent={<Icon icon="lucide:arrow-left" className="h-4 w-4" />}
              className="mr-2"
              onPress={() => navigateTo("dashboard")}
            >
              Back to Dashboard
            </Button>

            <div className="hidden md:flex items-center ml-4">
              <span className="text-foreground-500">Documents:</span>
              <span className="font-medium ml-2">Upload & Process</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="flex items-center gap-2"
                >
                  <div className="h-8 w-8 rounded-full bg-foreground-200"></div>
                  <span className="hidden md:inline">John Contractor</span>
                  <Icon icon="lucide:chevron-down" className="h-4 w-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User actions">
                <DropdownItem
                  key="profile"
                  onPress={() => navigateTo("profile")}
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  onPress={() => navigateTo("settings")}
                >
                  Settings
                </DropdownItem>
                <DropdownItem key="team">Team</DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  onPress={() => navigateTo("landing")}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-gilroy text-2xl md:text-3xl font-bold mb-1">Upload Documents</h1>
            <p className="text-foreground-500">Upload invoices, receipts, and other construction documents for processing</p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="flat"
              color="primary"
              startContent={<Icon icon="lucide:settings" className="h-4 w-4" />}
              onPress={() => navigateTo("settings")}
            >
              Settings
            </Button>
            <Button
              color="primary"
              startContent={<Icon icon="lucide:search" className="h-4 w-4" />}
              onPress={() => navigateTo("document-search")}
            >
              Search Documents
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="ambient-shadow mb-8">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Upload Documents</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="flat"
                      color="primary"
                      size="sm"
                      startContent={<Icon icon="lucide:smartphone" className="h-4 w-4" />}
                      onPress={() => setShowMobileUpload(true)}
                    >
                      Mobile Upload
                    </Button>
                    <Tooltip content="Upload from cloud storage">
                      <Button
                        variant="flat"
                        color="default"
                        size="sm"
                        startContent={<Icon icon="lucide:cloud" className="h-4 w-4" />}
                      >
                        Cloud
                      </Button>
                    </Tooltip>
                  </div>
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-foreground-300'
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />

                  <div className="mb-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                      <Icon icon="lucide:hard-hat" className="h-8 w-8 text-primary-500" />
                    </div>
                    <h3 className="font-dmsans font-semibold text-xl mb-2">Drag & Drop Documents Here</h3>
                    <p className="text-foreground-500 mb-6">
                      Upload invoices, receipts, contracts, or any construction document
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Button
                        color="primary"
                        startContent={<Icon icon="lucide:upload" className="h-4 w-4" />}
                        onPress={handleButtonClick}
                      >
                        Select Files
                      </Button>
                      <Button
                        variant="flat"
                        color="default"
                        startContent={<Icon icon="lucide:folder" className="h-4 w-4" />}
                      >
                        Browse Folders
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-foreground-400 mt-6">
                    Supported formats: PDF, JPG, PNG • Max file size: 25MB
                  </div>
                </div>

                {showMobileUpload && (
                  <div className="mb-6 p-6 border border-foreground-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-dmsans font-semibold">Mobile Upload</h3>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        onPress={() => setShowMobileUpload(false)}
                      >
                        <Icon icon="lucide:x" className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-center p-6 border border-dashed border-foreground-300 rounded-lg mb-4">
                      <div className="text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mb-3">
                          <Icon icon="lucide:qr-code" className="h-6 w-6 text-primary-500" />
                        </div>
                        <p className="text-foreground-500 mb-2">Scan this QR code with your phone</p>
                        <div className="h-32 w-32 bg-foreground-200 mx-auto rounded"></div>
                      </div>
                    </div>

                    <p className="text-sm text-foreground-500 text-center">
                      Open the camera app on your phone and scan this code to upload documents directly from your device
                    </p>
                  </div>
                )}

                {processingFiles.length > 0 && (
                  <div>
                    <h3 className="font-dmsans font-semibold mb-4">Processing Documents</h3>
                    <div className="space-y-4">
                      {processingFiles.map((file, index) => (
                        <div
                          key={index}
                          className={`p-4 border rounded-lg ${file.progress === 100 ? 'border-success-200 bg-success-50 cursor-pointer' : 'border-foreground-200'
                            }`}
                          onClick={() => handleProcessedDocumentClick(index)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Icon
                                icon={file.progress === 100 ? "lucide:file-check" : "lucide:file-text"}
                                className={`h-5 w-5 mr-3 ${file.progress === 100 ? 'text-success-500' : 'text-primary-500'}`}
                              />
                              <span className="font-medium">{file.name}</span>
                            </div>
                            {file.progress === 100 && (
                              <Button
                                variant="light"
                                size="sm"
                                color="success"
                                startContent={<Icon icon="lucide:eye" className="h-4 w-4" />}
                              >
                                View
                              </Button>
                            )}
                          </div>

                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-foreground-500">{file.status}</span>
                            <span className="text-sm text-foreground-500">{file.progress}%</span>
                          </div>

                          <Progress
                            value={file.progress}
                            color={file.progress === 100 ? "success" : "primary"}
                            size="sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          <div>
            <Card className="ambient-shadow mb-8">
              <CardBody className="p-6">
                <h2 className="font-gilroy text-lg font-bold mb-4">Upload Tips</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 mt-1">
                      <Icon icon="lucide:image" className="h-4 w-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium">Clear Images</p>
                      <p className="text-sm text-foreground-500">Ensure documents are well-lit and clearly visible</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 mt-1">
                      <Icon icon="lucide:layers" className="h-4 w-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium">Batch Upload</p>
                      <p className="text-sm text-foreground-500">Upload multiple documents at once to save time</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 mt-1">
                      <Icon icon="lucide:smartphone" className="h-4 w-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium">Mobile Uploads</p>
                      <p className="text-sm text-foreground-500">Capture receipts on-site with our mobile app</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 mt-1">
                      <Icon icon="lucide:mail" className="h-4 w-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium">Email Forwarding</p>
                      <p className="text-sm text-foreground-500">Forward invoices to your dedicated email address</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <h2 className="font-gilroy text-lg font-bold mb-4">Document Status</h2>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-warning-500 mr-2"></div>
                      <span className="text-sm">Awaiting Review</span>
                    </div>
                    <span className="text-sm font-medium">14</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-success-500 mr-2"></div>
                      <span className="text-sm">Processed</span>
                    </div>
                    <span className="text-sm font-medium">248</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary-500 mr-2"></div>
                      <span className="text-sm">Synced to QuickBooks</span>
                    </div>
                    <span className="text-sm font-medium">236</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-danger-500 mr-2"></div>
                      <span className="text-sm">Failed Processing</span>
                    </div>
                    <span className="text-sm font-medium">2</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    variant="flat"
                    color="primary"
                    className="w-full"
                    startContent={<Icon icon="lucide:inbox" className="h-4 w-4" />}
                  >
                    View All Documents
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};