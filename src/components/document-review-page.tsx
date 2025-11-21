import React from "react";
import { 
  Button, Card, CardBody, Input, Select, SelectItem, Tooltip, 
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Badge,
  Tabs, Tab, Divider, Checkbox, Modal, ModalContent, ModalHeader, 
  ModalBody, ModalFooter
} from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const DocumentReviewPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [activeField, setActiveField] = React.useState("invoice_number");
  const [documentCategory, setDocumentCategory] = React.useState("Invoice");
  const [selectedProject, setSelectedProject] = React.useState("Downtown Office Tower");
  const [zoomLevel, setZoomLevel] = React.useState(100);
  const [showAllocationModal, setShowAllocationModal] = React.useState(false);
  const [showVendorModal, setShowVendorModal] = React.useState(false);
  const [paymentStatus, setPaymentStatus] = React.useState("Unpaid");
  const [lineItems, setLineItems] = React.useState([
    {
      id: 1,
      description: "Concrete mix (high strength)",
      quantity: 50,
      unitPrice: 12.99,
      amount: 649.50,
      category: "Materials",
      subCategory: "Concrete",
      project: "Downtown Office Tower",
      taxDeductible: true,
      allocation: 100
    },
    {
      id: 2,
      description: "Rebar 1/2\" x 20'",
      quantity: 25,
      unitPrice: 18.75,
      amount: 468.75,
      category: "Materials",
      subCategory: "Steel",
      project: "Downtown Office Tower",
      taxDeductible: true,
      allocation: 100
    },
    {
      id: 3,
      description: "Delivery fee",
      quantity: 1,
      unitPrice: 75.00,
      amount: 75.00,
      category: "Equipment Rental",
      subCategory: "Delivery",
      project: "Downtown Office Tower",
      taxDeductible: true,
      allocation: 100
    }
  ]);
  
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
    "Paid",
    "Unpaid",
    "Partial",
    "Void",
    "Credit"
  ];
  
  const expenseCategories = [
    { name: "Materials", subcategories: ["Lumber", "Concrete", "Electrical", "Plumbing", "Steel", "Drywall", "Insulation", "Roofing", "Other"] },
    { name: "Labor", subcategories: ["Skilled", "Unskilled", "Overtime", "Subcontractor", "Other"] },
    { name: "Subcontractors", subcategories: ["Electrical", "Plumbing", "HVAC", "Roofing", "Framing", "Drywall", "Painting", "Other"] },
    { name: "Equipment Rental", subcategories: ["Heavy Machinery", "Tools", "Vehicles", "Delivery", "Other"] },
    { name: "Permits & Fees", subcategories: ["Building Permits", "Inspection Fees", "Impact Fees", "Other"] },
    { name: "Tools", subcategories: ["Hand Tools", "Power Tools", "Safety Equipment", "Other"] },
    { name: "Office/Administrative", subcategories: ["Office Supplies", "Software", "Insurance", "Legal", "Other"] }
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
      confidence: 96,
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
      label: "Total Amount", 
      value: "$1,193.25", 
      confidence: 99,
      highlighted: true
    },
    { 
      id: "tax", 
      label: "Tax Amount", 
      value: "$95.46", 
      confidence: 92,
      highlighted: false
    },
    { 
      id: "notes", 
      label: "Notes", 
      value: "Construction materials for Downtown Office Tower project", 
      confidence: 88,
      highlighted: false
    }
  ];
  
  const commonVendors = [
    { name: "BuildSupply Inc.", category: "Materials Supplier" },
    { name: "ConstructEquip Rentals", category: "Equipment Rental" },
    { name: "Metro Concrete", category: "Materials Supplier" },
    { name: "City Electric Supply", category: "Electrical Supplier" },
    { name: "PlumbPro Services", category: "Plumbing Contractor" }
  ];
  
  const getConfidenceColor = (score: number) => {
    if (score >= 95) return "success";
    if (score >= 80) return "warning";
    return "danger";
  };
  
  const handleLineItemChange = (id: number, field: string, value: any) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };
  
  const addLineItem = () => {
    const newId = Math.max(...lineItems.map(item => item.id), 0) + 1;
    setLineItems([...lineItems, {
      id: newId,
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      category: "Materials",
      subCategory: "Other",
      project: selectedProject,
      taxDeductible: true,
      allocation: 100
    }]);
  };
  
  const removeLineItem = (id: number) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };
  
  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };
  
  const handleZoomReset = () => {
    setZoomLevel(100);
  };
  
  const handleSave = () => {
    // In a real app, this would save the document data
    navigateTo("dashboard");
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-foreground-200 py-4 sticky top-0 z-10">
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
              <span className="text-foreground-500">Reviewing:</span>
              <span className="font-medium ml-2">Invoice #2458</span>
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
            
            <Button
              color="primary"
              onPress={handleSave}
              startContent={<Icon icon="lucide:check" className="h-4 w-4" />}
            >
              Save & Process
            </Button>
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
                      onPress={handleZoomReset}
                    >
                      <Icon icon="lucide:maximize" className="h-4 w-4" />
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
                
                <div className="bg-foreground-50 rounded-md p-4 h-[600px] overflow-auto">
                  {/* Mock document with highlighted areas */}
                  <div 
                    className="bg-white shadow-sm p-6 relative mx-auto"
                    style={{ 
                      width: `${zoomLevel}%`, 
                      minWidth: "300px", 
                      transformOrigin: "top center",
                      transition: "width 0.2s ease-out"
                    }}
                  >
                    <div className="flex justify-between mb-8">
                      <div className="w-24 h-8 bg-foreground-200 rounded"></div>
                      <div className="text-right">
                        <div className="font-bold mb-1">INVOICE</div>
                        <div className={`font-medium ${activeField === "invoice_number" ? "bg-primary-200" : ""}`}>
                          #INV-2458
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mb-6">
                      <div>
                        <div className="text-sm text-foreground-500 mb-1">From:</div>
                        <div className={`font-medium ${activeField === "vendor" ? "bg-primary-200" : ""}`}>
                          BuildSupply Inc.
                        </div>
                        <div className="text-sm text-foreground-500">123 Supplier St.</div>
                        <div className="text-sm text-foreground-500">Construction City, CC 12345</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-foreground-500 mb-1">Date:</div>
                        <div className={`${activeField === "date" ? "bg-primary-200" : ""}`}>July 15, 2023</div>
                        <div className="text-sm text-foreground-500 mt-2">Due Date:</div>
                        <div className={`${activeField === "due_date" ? "bg-primary-200" : ""}`}>
                          August 15, 2023
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-b border-foreground-200 py-4 mb-6">
                      <div className="flex justify-between text-sm font-medium text-foreground-500 mb-2">
                        <div className="w-1/2">Description</div>
                        <div className="w-1/6 text-right">Qty</div>
                        <div className="w-1/6 text-right">Unit Price</div>
                        <div className="w-1/6 text-right">Amount</div>
                      </div>
                      
                      {lineItems.map((item, index) => (
                        <div key={index} className="flex justify-between mb-2 text-sm">
                          <div className="w-1/2">{item.description}</div>
                          <div className="w-1/6 text-right">{item.quantity}</div>
                          <div className="w-1/6 text-right">${item.unitPrice.toFixed(2)}</div>
                          <div className="w-1/6 text-right">${item.amount.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="w-1/3">
                        <div className="flex justify-between mb-1">
                          <div className="text-sm">Subtotal:</div>
                          <div>${calculateTotal().toFixed(2)}</div>
                        </div>
                        <div className="flex justify-between mb-1">
                          <div className="text-sm">Tax (8%):</div>
                          <div className={`${activeField === "tax" ? "bg-primary-200" : ""}`}>
                            $95.46
                          </div>
                        </div>
                        <div className="flex justify-between font-bold">
                          <div>Total:</div>
                          <div className={`${activeField === "amount" ? "bg-primary-200" : ""}`}>
                            $1,193.25
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-4 border-t border-foreground-200 text-sm text-foreground-500">
                      <div className={`${activeField === "notes" ? "bg-primary-200" : ""}`}>
                        Construction materials for Downtown Office Tower project
                      </div>
                    </div>
                  </div>
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
                    <label className="block text-sm font-medium text-foreground-700 mb-1">
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
                    <label className="block text-sm font-medium text-foreground-700 mb-1">
                      Project / Job
                    </label>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button 
                          variant="bordered"
                          className="w-full justify-between"
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
                  </div>
                </div>
                
                <Tabs 
                  aria-label="Document sections"
                  color="primary"
                  variant="underlined"
                  classNames={{
                    tabList: "gap-6",
                    cursor: "w-full",
                    tab: "max-w-fit px-0 h-12"
                  }}
                >
                  <Tab 
                    key="details" 
                    title={
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:file-text" className="h-4 w-4" />
                        <span>Document Details</span>
                      </div>
                    }
                  >
                    <div className="pt-4">
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
                              <div className="flex items-center">
                                <Tooltip content={`${extractedFields.find(f => f.id === "vendor")?.confidence}% confidence`}>
                                  <Badge 
                                    color={getConfidenceColor(extractedFields.find(f => f.id === "vendor")?.confidence || 0)} 
                                    variant="flat"
                                    size="sm"
                                  >
                                    {extractedFields.find(f => f.id === "vendor")?.confidence}%
                                  </Badge>
                                </Tooltip>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Input
                                value={extractedFields.find(f => f.id === "vendor")?.value || ""}
                                className="flex-grow"
                              />
                              <Button
                                variant="flat"
                                color="primary"
                                isIconOnly
                                onPress={() => setShowVendorModal(true)}
                              >
                                <Icon icon="lucide:list" className="h-4 w-4" />
                              </Button>
                            </div>
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
                                  {field.id === "amount" && (
                                    <Tooltip content="Potential tax deduction">
                                      <div className="mr-2 bg-success-100 text-success-600 text-xs px-2 py-0.5 rounded-full flex items-center">
                                        <Icon icon="lucide:receipt" className="h-3 w-3 mr-1" />
                                        <span>Tax</span>
                                      </div>
                                    </Tooltip>
                                  )}
                                  <Tooltip content={`${field.confidence}% confidence`}>
                                    <Badge 
                                      color={getConfidenceColor(field.confidence)} 
                                      variant="flat"
                                      size="sm"
                                    >
                                      {field.confidence}%
                                    </Badge>
                                  </Tooltip>
                                </div>
                              </div>
                              
                              {field.id === "notes" ? (
                                <Input
                                  value={field.value}
                                  className="w-full"
                                  type="text"
                                />
                              ) : (
                                <Input
                                  value={field.value}
                                  className="w-full"
                                />
                              )}
                            </div>
                          ))}
                          
                          {/* Payment Status */}
                          <div 
                            className="p-4 rounded-md border border-foreground-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-foreground-700">
                                Payment Status
                              </label>
                            </div>
                            
                            <Select
                              selectedKeys={[paymentStatus]}
                              onChange={(e) => setPaymentStatus(e.target.value)}
                              className="w-full"
                            >
                              {paymentStatuses.map((status) => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                              ))}
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                  
                  <Tab 
                    key="lineitems" 
                    title={
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:list" className="h-4 w-4" />
                        <span>Line Items</span>
                      </div>
                    }
                  >
                    <div className="pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-dmsans font-semibold">Line Items</h3>
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
                          onPress={addLineItem}
                        >
                          Add Item
                        </Button>
                      </div>
                      
                      <div className="space-y-6">
                        {lineItems.map((item, index) => (
                          <div key={item.id} className="border border-foreground-200 rounded-md p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">Item #{index + 1}</h4>
                              <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                color="danger"
                                onPress={() => removeLineItem(item.id)}
                              >
                                <Icon icon="lucide:trash-2" className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-xs font-medium text-foreground-700 mb-1">
                                  Description
                                </label>
                                <Input
                                  value={item.description}
                                  onValueChange={(value) => handleLineItemChange(item.id, "description", value)}
                                  className="w-full"
                                />
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className="block text-xs font-medium text-foreground-700 mb-1">
                                    Quantity
                                  </label>
                                  <Input
                                    type="number"
                                    value={String(item.quantity)}
                                    onValueChange={(value) => {
                                      const qty = parseFloat(value) || 0;
                                      handleLineItemChange(item.id, "quantity", qty);
                                      handleLineItemChange(item.id, "amount", qty * item.unitPrice);
                                    }}
                                    className="w-full"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs font-medium text-foreground-700 mb-1">
                                    Unit Price
                                  </label>
                                  <Input
                                    type="number"
                                    value={String(item.unitPrice)}
                                    startContent={<span className="text-foreground-400">$</span>}
                                    onValueChange={(value) => {
                                      const price = parseFloat(value) || 0;
                                      handleLineItemChange(item.id, "unitPrice", price);
                                      handleLineItemChange(item.id, "amount", item.quantity * price);
                                    }}
                                    className="w-full"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs font-medium text-foreground-700 mb-1">
                                    Amount
                                  </label>
                                  <Input
                                    type="number"
                                    value={String(item.amount)}
                                    startContent={<span className="text-foreground-400">$</span>}
                                    onValueChange={(value) => handleLineItemChange(item.id, "amount", parseFloat(value) || 0)}
                                    className="w-full"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-xs font-medium text-foreground-700 mb-1">
                                  Category
                                </label>
                                <Select
                                  selectedKeys={[item.category]}
                                  onChange={(e) => handleLineItemChange(item.id, "category", e.target.value)}
                                  className="w-full"
                                >
                                  {expenseCategories.map((category) => (
                                    <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
                                  ))}
                                </Select>
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-foreground-700 mb-1">
                                  Subcategory
                                </label>
                                <Select
                                  selectedKeys={[item.subCategory]}
                                  onChange={(e) => handleLineItemChange(item.id, "subCategory", e.target.value)}
                                  className="w-full"
                                >
                                  {expenseCategories
                                    .find(cat => cat.name === item.category)
                                    ?.subcategories.map((subcat) => (
                                      <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                                    ))}
                                </Select>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-foreground-700 mb-1">
                                  Project Allocation
                                </label>
                                <div className="flex gap-2">
                                  <Select
                                    selectedKeys={[item.project]}
                                    onChange={(e) => handleLineItemChange(item.id, "project", e.target.value)}
                                    className="flex-grow"
                                  >
                                    {projects.map((project) => (
                                      <SelectItem key={project} value={project}>{project}</SelectItem>
                                    ))}
                                  </Select>
                                  <Button
                                    isIconOnly
                                    variant="flat"
                                    color="primary"
                                    onPress={() => setShowAllocationModal(true)}
                                  >
                                    <Icon icon="lucide:split" className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="flex items-center">
                                <Checkbox
                                  isSelected={item.taxDeductible}
                                  onValueChange={(value) => handleLineItemChange(item.id, "taxDeductible", value)}
                                  color="success"
                                >
                                  <div className="flex items-center">
                                    <span className="mr-1">Tax Deductible</span>
                                    <Tooltip content="This expense qualifies for tax deduction">
                                      <Icon icon="lucide:info" className="h-4 w-4 text-foreground-400" />
                                    </Tooltip>
                                  </div>
                                </Checkbox>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <div className="w-1/2 space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">Subtotal:</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Tax:</span>
                            <span>$95.46</span>
                          </div>
                          <Divider className="my-2" />
                          <div className="flex justify-between">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold">$1,193.25</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
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
                onPress={handleSave}
              >
                Confirm & Process
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Project Allocation Modal */}
      <Modal isOpen={showAllocationModal} onOpenChange={() => setShowAllocationModal(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Split Project Allocation
              </ModalHeader>
              <ModalBody>
                <p className="text-foreground-500 mb-4">
                  Allocate this expense across multiple projects by percentage.
                </p>
                
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-grow">
                        <label className="block text-sm font-medium text-foreground-700 mb-1">
                          {project}
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={project === selectedProject ? "100" : "0"}
                          endContent={<span className="text-foreground-400">%</span>}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="flex gap-2 mt-6">
                        <Button
                          isIconOnly
                          variant="flat"
                          size="sm"
                          onPress={() => {}}
                        >
                          <Icon icon="lucide:minus" className="h-4 w-4" />
                        </Button>
                        <Button
                          isIconOnly
                          variant="flat"
                          size="sm"
                          onPress={() => {}}
                        >
                          <Icon icon="lucide:plus" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Divider className="my-4" />
                
                <div>
                  <h4 className="font-medium mb-2">Quick Split</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="flat">50/50</Button>
                    <Button size="sm" variant="flat">25/75</Button>
                    <Button size="sm" variant="flat">33/33/33</Button>
                    <Button size="sm" variant="flat">Custom</Button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Job Cost Coding</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground-700 mb-1">
                        Cost Code
                      </label>
                      <Select defaultSelectedKeys={["materials"]} className="w-full">
                        <SelectItem key="materials" value="materials">02 - Materials</SelectItem>
                        <SelectItem key="labor" value="labor">03 - Labor</SelectItem>
                        <SelectItem key="equipment" value="equipment">04 - Equipment</SelectItem>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground-700 mb-1">
                        Phase
                      </label>
                      <Select defaultSelectedKeys={["foundation"]} className="w-full">
                        <SelectItem key="foundation" value="foundation">01 - Foundation</SelectItem>
                        <SelectItem key="framing" value="framing">02 - Framing</SelectItem>
                        <SelectItem key="electrical" value="electrical">03 - Electrical</SelectItem>
                      </Select>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" color="default" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Apply Allocation
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      
      {/* Vendor Selection Modal */}
      <Modal isOpen={showVendorModal} onOpenChange={() => setShowVendorModal(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Select Vendor
              </ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Search vendors..."
                  startContent={<Icon icon="lucide:search" className="h-4 w-4 text-foreground-400" />}
                  className="mb-4"
                />
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {commonVendors.map((vendor, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 border border-foreground-200 rounded-md hover:bg-foreground-50 cursor-pointer"
                      onClick={() => {
                        const vendorField = extractedFields.find(f => f.id === "vendor");
                        if (vendorField) {
                          vendorField.value = vendor.name;
                        }
                        onClose();
                      }}
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center mr-3">
                          <Icon icon="lucide:building" className="h-4 w-4 text-primary-500" />
                        </div>
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          <p className="text-xs text-foreground-500">{vendor.category}</p>
                        </div>
                      </div>
                      <Icon icon="lucide:chevron-right" className="h-4 w-4 text-foreground-400" />
                    </div>
                  ))}
                </div>
                
                <Divider className="my-4" />
                
                <Button
                  variant="flat"
                  color="primary"
                  startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
                  className="w-full"
                >
                  Add New Vendor
                </Button>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" color="default" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};