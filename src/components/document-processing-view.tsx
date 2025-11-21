import React from "react";
import { Button, Card, CardBody, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input, Badge, Progress, Tooltip, Switch } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const DocumentProcessingView: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [activeField, setActiveField] = React.useState("invoice_number");
  const [documentCategory, setDocumentCategory] = React.useState("Invoice");
  const [selectedProject, setSelectedProject] = React.useState("Downtown Office Tower");
  const [zoomLevel, setZoomLevel] = React.useState(100);
  const [showLineItems, setShowLineItems] = React.useState(false);
  const [paymentStatus, setPaymentStatus] = React.useState("Unpaid");
  const [documentName, setDocumentName] = React.useState("Invoice #2458");

  React.useEffect(() => {
    const mockDoc = localStorage.getItem("mock_processing_document");
    if (mockDoc) {
      setDocumentName(mockDoc);
      // Clear it so it doesn't persist forever if we navigate away and back
      // localStorage.removeItem("mock_processing_document"); 
    }
  }, []);

  const projects = [
    "Downtown Office Tower",
    "Westside Residential Complex",
    "Harbor Bridge Renovation",
    "City Center Mall"
  ];

  const categories = [
    "Invoice",
    "Receipt",
    "Contract",
    "Permit",
    "Change Order"
  ];

  const paymentStatuses = [
    "Unpaid",
    "Paid",
    "Partially Paid",
    "Overdue",
    "Void"
  ];

  const commonVendors = [
    "BuildSupply Inc.",
    "ConMaterials Co.",
    "City Permits Office",
    "Equipment Rental Pro",
    "Electrical Wholesale Supply"
  ];

  const expenseCategories = [
    {
      name: "Materials",
      subcategories: ["Lumber", "Concrete", "Electrical", "Plumbing", "Drywall", "Paint", "Roofing", "Other"]
    },
    {
      name: "Labor",
      subcategories: ["Skilled", "Unskilled", "Overtime", "Subcontractor"]
    },
    {
      name: "Equipment Rental",
      subcategories: ["Heavy Machinery", "Tools", "Vehicles", "Temporary Structures"]
    },
    {
      name: "Permits & Fees",
      subcategories: ["Building Permits", "Inspection Fees", "Impact Fees", "Utility Connection"]
    },
    {
      name: "Office/Administrative",
      subcategories: ["Insurance", "Office Supplies", "Software", "Professional Services"]
    }
  ];

  const extractedFields = [
    {
      id: "invoice_number",
      label: "Invoice Number",
      value: "INV-2458",
      confidence: 98,
      highlighted: true
    },
    {
      id: "date",
      label: "Date",
      value: "July 15, 2023",
      confidence: 96,
      highlighted: false
    },
    {
      id: "due_date",
      label: "Due Date",
      value: "August 15, 2023",
      confidence: 95,
      highlighted: false
    },
    {
      id: "vendor",
      label: "Vendor",
      value: "BuildSupply Inc.",
      confidence: 94,
      highlighted: false
    },
    {
      id: "amount",
      label: "Amount",
      value: "$12,450.00",
      confidence: 99,
      highlighted: true,
      taxDeductible: true
    },
    {
      id: "tax_amount",
      label: "Tax Amount",
      value: "$996.00",
      confidence: 97,
      highlighted: false
    },
    {
      id: "description",
      label: "Description",
      value: "Construction materials for Downtown Office Tower project",
      confidence: 88,
      highlighted: false
    }
  ];

  const lineItems = [
    {
      description: "2x4 Lumber (500 pieces)",
      quantity: "500",
      unitPrice: "$12.50",
      amount: "$6,250.00",
      category: "Materials",
      subcategory: "Lumber",
      taxDeductible: true,
      confidence: 96
    },
    {
      description: "Concrete Mix (200 bags)",
      quantity: "200",
      unitPrice: "$18.00",
      amount: "$3,600.00",
      category: "Materials",
      subcategory: "Concrete",
      taxDeductible: true,
      confidence: 94
    },
    {
      description: "Electrical Wiring (1000ft)",
      quantity: "1000",
      unitPrice: "$2.60",
      amount: "$2,600.00",
      category: "Materials",
      subcategory: "Electrical",
      taxDeductible: true,
      confidence: 92
    }
  ];

  const getConfidenceColor = (score: number) => {
    if (score >= 95) return "success";
    if (score >= 80) return "warning";
    return "danger";
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
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
              <span className="text-foreground-500">Processing:</span>
              <span className="font-medium ml-2">{documentName}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="flat"
              color="primary"
              startContent={<Icon icon="lucide:skip-forward" className="h-4 w-4" />}
            >
              Next Document
            </Button>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  aria-label="More options"
                >
                  <Icon icon="lucide:more-vertical" className="h-5 w-5" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Document actions">
                <DropdownItem
                  key="download"
                  startContent={<Icon icon="lucide:download" className="h-4 w-4" />}
                >
                  Download Original
                </DropdownItem>
                <DropdownItem
                  key="share"
                  startContent={<Icon icon="lucide:share" className="h-4 w-4" />}
                >
                  Share Document
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<Icon icon="lucide:trash-2" className="h-4 w-4" />}
                >
                  Delete Document
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Document Preview */}
          <div className="w-full lg:w-1/2">
            <Card className="ambient-shadow h-full">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Document Preview</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={handleZoomOut}
                      isDisabled={zoomLevel <= 50}
                    >
                      <Icon icon="lucide:zoom-out" className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">{zoomLevel}%</span>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={handleZoomIn}
                      isDisabled={zoomLevel >= 200}
                    >
                      <Icon icon="lucide:zoom-in" className="h-4 w-4" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={handleResetZoom}
                    >
                      <Icon icon="lucide:maximize" className="h-4 w-4" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                    >
                      <Icon icon="lucide:rotate-cw" className="h-4 w-4" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                    >
                      <Icon icon="lucide:download" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-foreground-50 rounded-md p-4 h-[600px] flex items-center justify-center relative overflow-auto">
                  {/* Mock document with highlighted areas */}
                  <div
                    className="bg-white shadow-sm p-6 relative"
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: 'top left',
                      width: '100%',
                      maxWidth: '500px'
                    }}
                  >
                    <div className="flex justify-between mb-8">
                      <div className="w-24 h-8 bg-foreground-200 rounded"></div>
                      <div className="text-right">
                        <div className="font-bold mb-1">INVOICE</div>
                        <div className={`font-medium ${activeField === "invoice_number" ? "bg-primary-200" : ""}`}>
                          {documentName.includes('#') ? documentName : `#${documentName}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mb-6">
                      <div>
                        <div className="text-sm text-foreground-500 mb-1">From:</div>
                        <div className="font-medium">BuildSupply Inc.</div>
                        <div className="text-sm text-foreground-500">123 Supplier St.</div>
                        <div className="text-sm text-foreground-500">Construction City, CC 12345</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-foreground-500 mb-1">Date:</div>
                        <div className={`${activeField === "date" ? "bg-primary-200" : ""}`}>July 15, 2023</div>
                        <div className="text-sm text-foreground-500 mt-2">Due Date:</div>
                        <div className={`${activeField === "due_date" ? "bg-primary-200" : ""}`}>August 15, 2023</div>
                      </div>
                    </div>

                    <div className="border-t border-b border-foreground-200 py-4 mb-6">
                      <div className="flex justify-between text-sm font-medium text-foreground-500 mb-2">
                        <div>Description</div>
                        <div className="flex space-x-8">
                          <div>Qty</div>
                          <div>Unit Price</div>
                          <div>Amount</div>
                        </div>
                      </div>

                      {lineItems.map((item, index) => (
                        <div key={index} className="flex justify-between mb-2">
                          <div className="max-w-[60%]">{item.description}</div>
                          <div className="flex space-x-8">
                            <div className="w-8 text-right">{item.quantity}</div>
                            <div className="w-20 text-right">{item.unitPrice}</div>
                            <div className="w-20 text-right font-medium">{item.amount}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <div className="w-1/3">
                        <div className="flex justify-between mb-1">
                          <div className="text-sm">Subtotal:</div>
                          <div>$12,450.00</div>
                        </div>
                        <div className="flex justify-between mb-1">
                          <div className="text-sm">Tax (8%):</div>
                          <div className={`${activeField === "tax_amount" ? "bg-primary-200" : ""}`}>$996.00</div>
                        </div>
                        <div className="flex justify-between font-bold">
                          <div>Total:</div>
                          <div className={`${activeField === "amount" ? "bg-primary-200" : ""}`}>$13,446.00</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Highlight overlay */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {extractedFields.map((field) => field.highlighted && (
                      <motion.div
                        key={field.id}
                        className="absolute bg-primary-200 opacity-20 rounded"
                        style={{
                          top: field.id === "invoice_number" ? "80px" : field.id === "amount" ? "240px" : "0",
                          right: field.id === "invoice_number" ? "40px" : field.id === "amount" ? "40px" : "0",
                          width: field.id === "invoice_number" ? "80px" : field.id === "amount" ? "80px" : "0",
                          height: "24px",
                          transform: `scale(${zoomLevel / 100})`
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                      />
                    ))}
                  </motion.div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Extracted Data Form */}
          <div className="w-full lg:w-1/2">
            <Card className="ambient-shadow mb-6">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Document Information</h2>
                  <Badge color="success" variant="flat">Auto-categorized</Badge>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground-500 mb-1">
                      Document Type
                    </label>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          className="w-full justify-between"
                          endContent={<Icon icon="lucide:chevron-down" className="h-4 w-4" />}
                        >
                          {documentCategory}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Document categories"
                        onAction={(key) => setDocumentCategory(categories[Number(key)])}
                      >
                        {categories.map((category, index) => (
                          <DropdownItem key={index}>{category}</DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground-500 mb-1">
                      Payment Status
                    </label>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          className="w-full justify-between"
                          endContent={<Icon icon="lucide:chevron-down" className="h-4 w-4" />}
                        >
                          {paymentStatus}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Payment status"
                        onAction={(key) => setPaymentStatus(paymentStatuses[Number(key)])}
                      >
                        {paymentStatuses.map((status, index) => (
                          <DropdownItem key={index}>{status}</DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-dmsans font-semibold">Extracted Data</h3>
                    <div className="flex items-center">
                      <Icon icon="lucide:cpu" className="h-4 w-4 text-primary-500 mr-1" />
                      <span className="text-xs text-foreground-500">AI Processed</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Vendor field with quick-select */}
                    <div
                      className={`p-4 rounded-md border ${activeField === "vendor" ? 'border-primary-500 bg-primary-50' : 'border-foreground-200'}`}
                      onClick={() => setActiveField("vendor")}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-foreground-700">
                          Vendor
                        </label>
                        <Tooltip content={`${extractedFields.find(f => f.id === "vendor")?.confidence}% confidence`}>
                          <Badge
                            color={getConfidenceColor(extractedFields.find(f => f.id === "vendor")?.confidence || 0) as any}
                            variant="flat"
                            size="sm"
                          >
                            {extractedFields.find(f => f.id === "vendor")?.confidence}%
                          </Badge>
                        </Tooltip>
                      </div>

                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            variant="bordered"
                            className="w-full justify-between"
                            endContent={<Icon icon="lucide:chevron-down" className="h-4 w-4" />}
                          >
                            {extractedFields.find(f => f.id === "vendor")?.value}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Common vendors"
                        >
                          {commonVendors.map((vendor, index) => (
                            <DropdownItem key={index}>{vendor}</DropdownItem>
                          ))}
                          <DropdownItem key="other" className="text-primary">+ Add New Vendor</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>

                    {/* Other extracted fields */}
                    {extractedFields.filter(field => field.id !== "vendor").map((field) => (
                      <div
                        key={field.id}
                        className={`p-4 rounded-md border ${activeField === field.id ? 'border-primary-500 bg-primary-50' : 'border-foreground-200'}`}
                        onClick={() => setActiveField(field.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-foreground-700">
                            {field.label}
                          </label>
                          <div className="flex items-center">
                            {field.taxDeductible && (
                              <Tooltip content="Potential tax deduction">
                                <div className="mr-2 bg-success-100 text-success-600 text-xs px-2 py-0.5 rounded-full flex items-center">
                                  <Icon icon="lucide:receipt" className="h-3 w-3 mr-1" />
                                  <span>Tax</span>
                                </div>
                              </Tooltip>
                            )}
                            <Tooltip content={`${field.confidence}% confidence`}>
                              <Badge
                                color={getConfidenceColor(field.confidence) as any}
                                variant="flat"
                                size="sm"
                              >
                                {field.confidence}%
                              </Badge>
                            </Tooltip>
                          </div>
                        </div>

                        <Input
                          value={field.value}
                          className="w-full"
                        />
                      </div>
                    ))}

                    {/* Notes field */}
                    <div
                      className="p-4 rounded-md border border-foreground-200"
                    >
                      <label className="block text-sm font-medium text-foreground-700 mb-2">
                        Notes
                      </label>
                      <Input
                        placeholder="Add notes about this document..."
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-dmsans font-semibold">Project Allocation</h3>
                  <Button
                    variant="flat"
                    color="primary"
                    size="sm"
                    startContent={<Icon icon="lucide:split" className="h-4 w-4" />}
                  >
                    Split Allocation
                  </Button>
                </div>

                <div className="p-4 rounded-md border border-foreground-200 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-foreground-700">
                      Project
                    </label>
                    <Button
                      variant="light"
                      size="sm"
                      color="primary"
                      startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
                    >
                      New Project
                    </Button>
                  </div>

                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="bordered"
                        className="w-full justify-between mb-4"
                        endContent={<Icon icon="lucide:chevron-down" className="h-4 w-4" />}
                      >
                        {selectedProject}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Project selection"
                      onAction={(key) => setSelectedProject(projects[Number(key)])}
                    >
                      {projects.map((project, index) => (
                        <DropdownItem key={index}>{project}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>

                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-foreground-700">
                      Job Cost Code
                    </label>
                    <Input
                      value="DTW-MAT-2023"
                      className="w-48"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-dmsans font-semibold">Line Items</h3>
                  <Button
                    variant="light"
                    color="primary"
                    size="sm"
                    startContent={showLineItems ? <Icon icon="lucide:chevron-up" className="h-4 w-4" /> : <Icon icon="lucide:chevron-down" className="h-4 w-4" />}
                    onPress={() => setShowLineItems(!showLineItems)}
                  >
                    {showLineItems ? "Hide Line Items" : "Show Line Items"}
                  </Button>
                </div>

                {showLineItems && (
                  <div className="space-y-4 mb-6">
                    {lineItems.map((item, index) => (
                      <div key={index} className="p-4 rounded-md border border-foreground-200">
                        <div className="flex justify-between mb-4">
                          <h4 className="font-medium">Line Item {index + 1}</h4>
                          <Tooltip content={`${item.confidence}% confidence`}>
                            <Badge
                              color={getConfidenceColor(item.confidence) as any}
                              variant="flat"
                              size="sm"
                            >
                              {item.confidence}%
                            </Badge>
                          </Tooltip>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-medium text-foreground-700 mb-1">
                              Description
                            </label>
                            <Input
                              value={item.description}
                              className="w-full"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-foreground-700 mb-1">
                                Quantity
                              </label>
                              <Input
                                value={item.quantity}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-foreground-700 mb-1">
                                Unit Price
                              </label>
                              <Input
                                value={item.unitPrice}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-foreground-700 mb-1">
                                Amount
                              </label>
                              <Input
                                value={item.amount}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-foreground-700 mb-1">
                              Category
                            </label>
                            <Dropdown>
                              <DropdownTrigger>
                                <Button
                                  variant="bordered"
                                  className="w-full justify-between"
                                  size="sm"
                                  endContent={<Icon icon="lucide:chevron-down" className="h-4 w-4" />}
                                >
                                  {item.category}
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu
                                aria-label="Expense categories"
                              >
                                {expenseCategories.map((category, idx) => (
                                  <DropdownItem key={idx}>{category.name}</DropdownItem>
                                ))}
                              </DropdownMenu>
                            </Dropdown>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-foreground-700 mb-1">
                              Subcategory
                            </label>
                            <Dropdown>
                              <DropdownTrigger>
                                <Button
                                  variant="bordered"
                                  className="w-full justify-between"
                                  size="sm"
                                  endContent={<Icon icon="lucide:chevron-down" className="h-4 w-4" />}
                                >
                                  {item.subcategory}
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu
                                aria-label="Expense subcategories"
                              >
                                {expenseCategories.find(cat => cat.name === item.category)?.subcategories.map((subcat, idx) => (
                                  <DropdownItem key={idx}>{subcat}</DropdownItem>
                                ))}
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </div>

                        <div className="flex items-center mt-4">
                          <Switch
                            isSelected={item.taxDeductible}
                            color="success"
                            size="sm"
                          />
                          <span className="ml-2 text-sm">Tax Deductible</span>
                          <Tooltip content="Items marked as tax deductible will be included in tax reports">
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              className="ml-1"
                            >
                              <Icon icon="lucide:info" className="h-4 w-4 text-foreground-400" />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="flat"
                      color="primary"
                      startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
                      className="w-full"
                    >
                      Add Line Item
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>

            <div className="flex justify-between gap-4">
              <Button
                variant="flat"
                color="default"
                className="flex-1"
              >
                Save as Draft
              </Button>
              <Button
                color="primary"
                className="flex-1"
                endContent={<Icon icon="lucide:check" className="h-4 w-4" />}
              >
                Confirm & Process
              </Button>
            </div>

            <div className="mt-6">
              <Card>
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icon icon="lucide:layers" className="h-5 w-5 text-primary-500 mr-2" />
                      <span className="text-sm">Batch Processing: 3 of 14 documents</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="light"
                        size="sm"
                        isIconOnly
                      >
                        <Icon icon="lucide:skip-back" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        isIconOnly
                      >
                        <Icon icon="lucide:skip-forward" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={3} maxValue={14} color="primary" className="mt-2" />
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};