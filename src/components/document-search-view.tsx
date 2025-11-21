import React from "react";
import { Button, Card, CardBody, Input, Badge, Checkbox, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Pagination } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const DocumentSearchView: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDocuments, setSelectedDocuments] = React.useState<number[]>([]);
  const [showFilters, setShowFilters] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  
  // Filter states
  const [dateRange, setDateRange] = React.useState("all");
  const [selectedProjects, setSelectedProjects] = React.useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = React.useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);
  const [amountRange, setAmountRange] = React.useState({ min: "", max: "" });
  const [taxDeductible, setTaxDeductible] = React.useState<boolean | null>(null);
  
  const projects = [
    "Downtown Office Tower",
    "Westside Residential Complex",
    "Harbor Bridge Renovation",
    "City Center Mall"
  ];
  
  const vendors = [
    "BuildSupply Inc.",
    "ConMaterials Co.",
    "City Permits Office",
    "Equipment Rental Pro",
    "Elite Electrical Services"
  ];
  
  const categories = [
    "Materials",
    "Labor",
    "Equipment Rental",
    "Permits & Fees",
    "Office/Administrative"
  ];
  
  const statuses = [
    "Processed",
    "Awaiting Review",
    "Synced",
    "Failed"
  ];
  
  const dateRanges = [
    { id: "all", label: "All Time" },
    { id: "7d", label: "Last 7 Days" },
    { id: "30d", label: "Last 30 Days" },
    { id: "90d", label: "Last 90 Days" },
    { id: "ytd", label: "Year to Date" },
    { id: "custom", label: "Custom Range" }
  ];
  
  const documents = [
    { 
      id: 1,
      name: "Invoice #2458", 
      vendor: "BuildSupply Inc.",
      type: "Invoice", 
      date: "Jul 15, 2023", 
      status: "Processed",
      amount: "$13,446.00",
      project: "Downtown Office Tower",
      taxDeductible: true
    },
    { 
      id: 2,
      name: "Permit Application", 
      vendor: "City Permits Office",
      type: "Permit", 
      date: "Jul 14, 2023", 
      status: "Awaiting Review",
      amount: "$2,500.00",
      project: "Westside Residential Complex",
      taxDeductible: false
    },
    { 
      id: 3,
      name: "Material Receipt", 
      vendor: "ConMaterials Co.",
      type: "Receipt", 
      date: "Jul 13, 2023", 
      status: "Processed",
      amount: "$8,750.00",
      project: "Harbor Bridge Renovation",
      taxDeductible: true
    },
    { 
      id: 4,
      name: "Subcontractor Agreement", 
      vendor: "Elite Electrical Services",
      type: "Contract", 
      date: "Jul 12, 2023", 
      status: "Processed",
      amount: "$24,500.00",
      project: "City Center Mall",
      taxDeductible: false
    },
    { 
      id: 5,
      name: "Change Order #12", 
      vendor: "BuildSupply Inc.",
      type: "Change Order", 
      date: "Jul 12, 2023", 
      status: "Awaiting Review",
      amount: "$4,250.00",
      project: "Downtown Office Tower",
      taxDeductible: true
    },
    { 
      id: 6,
      name: "Equipment Rental", 
      vendor: "Equipment Rental Pro",
      type: "Invoice", 
      date: "Jul 10, 2023", 
      status: "Processed",
      amount: "$4,320.00",
      project: "Harbor Bridge Renovation",
      taxDeductible: true
    },
    { 
      id: 7,
      name: "Electrical Supplies", 
      vendor: "Elite Electrical Services",
      type: "Receipt", 
      date: "Jul 8, 2023", 
      status: "Processed",
      amount: "$6,845.00",
      project: "Downtown Office Tower",
      taxDeductible: true
    },
    { 
      id: 8,
      name: "Concrete Delivery", 
      vendor: "ConMaterials Co.",
      type: "Invoice", 
      date: "Jul 5, 2023", 
      status: "Processed",
      amount: "$12,350.00",
      project: "Westside Residential Complex",
      taxDeductible: true
    }
  ];
  
  const filteredDocuments = documents.filter(doc => {
    // Search query filter
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !doc.vendor.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Project filter
    if (selectedProjects.length > 0 && !selectedProjects.includes(doc.project)) {
      return false;
    }
    
    // Vendor filter
    if (selectedVendors.length > 0 && !selectedVendors.includes(doc.vendor)) {
      return false;
    }
    
    // Category filter (simplified for demo)
    if (selectedCategories.length > 0) {
      // In a real app, we'd check the document's category
      // For now, let's assume all invoices are "Materials" and all receipts are "Equipment Rental"
      const docCategory = doc.type === "Invoice" ? "Materials" : 
                          doc.type === "Receipt" ? "Equipment Rental" : 
                          doc.type === "Permit" ? "Permits & Fees" : 
                          "Office/Administrative";
      
      if (!selectedCategories.includes(docCategory)) {
        return false;
      }
    }
    
    // Status filter
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(doc.status)) {
      return false;
    }
    
    // Amount range filter
    if (amountRange.min && parseFloat(doc.amount.replace(/[^0-9.-]+/g, "")) < parseFloat(amountRange.min)) {
      return false;
    }
    if (amountRange.max && parseFloat(doc.amount.replace(/[^0-9.-]+/g, "")) > parseFloat(amountRange.max)) {
      return false;
    }
    
    // Tax deductible filter
    if (taxDeductible !== null && doc.taxDeductible !== taxDeductible) {
      return false;
    }
    
    return true;
  });
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const currentDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(currentDocuments.map(doc => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };
  
  const handleSelectDocument = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, id]);
    } else {
      setSelectedDocuments(selectedDocuments.filter(docId => docId !== id));
    }
  };
  
  const toggleProject = (project: string) => {
    if (selectedProjects.includes(project)) {
      setSelectedProjects(selectedProjects.filter(p => p !== project));
    } else {
      setSelectedProjects([...selectedProjects, project]);
    }
  };
  
  const toggleVendor = (vendor: string) => {
    if (selectedVendors.includes(vendor)) {
      setSelectedVendors(selectedVendors.filter(v => v !== vendor));
    } else {
      setSelectedVendors([...selectedVendors, vendor]);
    }
  };
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };
  
  const clearFilters = () => {
    setSelectedProjects([]);
    setSelectedVendors([]);
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setAmountRange({ min: "", max: "" });
    setTaxDeductible(null);
    setDateRange("all");
  };
  
  const saveSearch = () => {
    // In a real app, this would save the current search configuration
    alert("Search saved!");
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
              <span className="font-medium ml-2">Search & Filter</span>
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
            <h1 className="font-gilroy text-2xl md:text-3xl font-bold mb-1">Document Search</h1>
            <p className="text-foreground-500">Search and filter through all your construction documents</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              color="primary"
              startContent={<Icon icon="lucide:upload" className="h-4 w-4" />}
              onPress={() => navigateTo("document-upload")}
            >
              Upload
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-full lg:w-64 flex-shrink-0">
              <Card className="ambient-shadow sticky top-4">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-gilroy text-lg font-bold">Filters</h2>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={clearFilters}
                    >
                      <Icon icon="lucide:x" className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Date Range Filter */}
                    <div>
                      <h3 className="font-dmsans font-semibold mb-3">Date Range</h3>
                      <div className="space-y-2">
                        {dateRanges.map((range) => (
                          <div key={range.id} className="flex items-center">
                            <Checkbox
                              isSelected={dateRange === range.id}
                              onValueChange={() => setDateRange(range.id)}
                              color="primary"
                            >
                              <span className="text-sm">{range.label}</span>
                            </Checkbox>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Project Filter */}
                    <div>
                      <h3 className="font-dmsans font-semibold mb-3">Projects</h3>
                      <div className="space-y-2">
                        {projects.map((project, index) => (
                          <div key={index} className="flex items-center">
                            <Checkbox
                              isSelected={selectedProjects.includes(project)}
                              onValueChange={() => toggleProject(project)}
                              color="primary"
                            >
                              <span className="text-sm">{project}</span>
                            </Checkbox>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Vendor Filter */}
                    <div>
                      <h3 className="font-dmsans font-semibold mb-3">Vendors</h3>
                      <div className="space-y-2">
                        {vendors.map((vendor, index) => (
                          <div key={index} className="flex items-center">
                            <Checkbox
                              isSelected={selectedVendors.includes(vendor)}
                              onValueChange={() => toggleVendor(vendor)}
                              color="primary"
                            >
                              <span className="text-sm">{vendor}</span>
                            </Checkbox>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Category Filter */}
                    <div>
                      <h3 className="font-dmsans font-semibold mb-3">Categories</h3>
                      <div className="space-y-2">
                        {categories.map((category, index) => (
                          <div key={index} className="flex items-center">
                            <Checkbox
                              isSelected={selectedCategories.includes(category)}
                              onValueChange={() => toggleCategory(category)}
                              color="primary"
                            >
                              <span className="text-sm">{category}</span>
                            </Checkbox>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Status Filter */}
                    <div>
                      <h3 className="font-dmsans font-semibold mb-3">Status</h3>
                      <div className="space-y-2">
                        {statuses.map((status, index) => (
                          <div key={index} className="flex items-center">
                            <Checkbox
                              isSelected={selectedStatuses.includes(status)}
                              onValueChange={() => toggleStatus(status)}
                              color="primary"
                            >
                              <span className="text-sm">{status}</span>
                            </Checkbox>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Amount Range Filter */}
                    <div>
                      <h3 className="font-dmsans font-semibold mb-3">Amount Range</h3>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={amountRange.min}
                          onValueChange={(value) => setAmountRange({ ...amountRange, min: value })}
                          startContent={<span className="text-foreground-400">$</span>}
                          className="w-full"
                        />
                        <span>to</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={amountRange.max}
                          onValueChange={(value) => setAmountRange({ ...amountRange, max: value })}
                          startContent={<span className="text-foreground-400">$</span>}
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    {/* Tax Deduction Filter */}
                    <div>
                      <h3 className="font-dmsans font-semibold mb-3">Tax Deduction</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox
                            isSelected={taxDeductible === true}
                            onValueChange={() => setTaxDeductible(taxDeductible === true ? null : true)}
                            color="primary"
                          >
                            <span className="text-sm">Tax Deductible</span>
                          </Checkbox>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            isSelected={taxDeductible === false}
                            onValueChange={() => setTaxDeductible(taxDeductible === false ? null : false)}
                            color="primary"
                          >
                            <span className="text-sm">Not Tax Deductible</span>
                          </Checkbox>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        variant="flat"
                        color="primary"
                        className="w-full"
                        startContent={<Icon icon="lucide:save" className="h-4 w-4" />}
                        onPress={saveSearch}
                      >
                        Save Search
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
          
          {/* Search Results */}
          <div className="flex-grow">
            <Card className="ambient-shadow mb-6">
              <CardBody className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex-grow">
                    <Input
                      placeholder="Search documents by name, vendor, or content..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      startContent={<Icon icon="lucide:search" className="h-4 w-4 text-foreground-400" />}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="flat"
                      color={showFilters ? "primary" : "default"}
                      startContent={<Icon icon="lucide:filter" className="h-4 w-4" />}
                      onPress={() => setShowFilters(!showFilters)}
                    >
                      Filters
                    </Button>
                    
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="flat"
                          color="default"
                          startContent={<Icon icon="lucide:sort" className="h-4 w-4" />}
                        >
                          Sort
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Sort options">
                        <DropdownItem key="date_desc">Date (Newest First)</DropdownItem>
                        <DropdownItem key="date_asc">Date (Oldest First)</DropdownItem>
                        <DropdownItem key="amount_desc">Amount (High to Low)</DropdownItem>
                        <DropdownItem key="amount_asc">Amount (Low to High)</DropdownItem>
                        <DropdownItem key="name_asc">Name (A-Z)</DropdownItem>
                        <DropdownItem key="name_desc">Name (Z-A)</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
                
                {selectedDocuments.length > 0 && (
                  <div className="flex items-center justify-between bg-primary-50 p-3 rounded-md mb-4">
                    <span className="text-sm font-medium">{selectedDocuments.length} documents selected</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        startContent={<Icon icon="lucide:download" className="h-4 w-4" />}
                      >
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        startContent={<Icon icon="lucide:printer" className="h-4 w-4" />}
                      >
                        Print
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        startContent={<Icon icon="lucide:trash-2" className="h-4 w-4" />}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-foreground-200">
                        <th className="py-3 px-4 text-left">
                          <Checkbox
                            isSelected={currentDocuments.length > 0 && selectedDocuments.length === currentDocuments.length}
                            onValueChange={handleSelectAll}
                            color="primary"
                          />
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-foreground-500 text-sm">DOCUMENT</th>
                        <th className="py-3 px-4 text-left font-medium text-foreground-500 text-sm">VENDOR</th>
                        <th className="py-3 px-4 text-left font-medium text-foreground-500 text-sm">PROJECT</th>
                        <th className="py-3 px-4 text-left font-medium text-foreground-500 text-sm">DATE</th>
                        <th className="py-3 px-4 text-left font-medium text-foreground-500 text-sm">AMOUNT</th>
                        <th className="py-3 px-4 text-left font-medium text-foreground-500 text-sm">STATUS</th>
                        <th className="py-3 px-4 text-left font-medium text-foreground-500 text-sm">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDocuments.length > 0 ? (
                        currentDocuments.map((doc) => (
                          <tr 
                            key={doc.id} 
                            className="border-b border-foreground-100 hover:bg-foreground-50 cursor-pointer"
                            onClick={() => navigateTo("document-processing")}
                          >
                            <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                isSelected={selectedDocuments.includes(doc.id)}
                                onValueChange={(checked) => handleSelectDocument(doc.id, checked)}
                                color="primary"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-md bg-primary-50 flex items-center justify-center mr-3">
                                  <Icon 
                                    icon={
                                      doc.type === "Invoice" ? "lucide:file-text" : 
                                      doc.type === "Receipt" ? "lucide:receipt" :
                                      doc.type === "Contract" ? "lucide:file-signature" :
                                      doc.type === "Permit" ? "lucide:scale" :
                                      "lucide:file-plus"
                                    } 
                                    className="h-4 w-4 text-primary-500" 
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{doc.name}</p>
                                  <p className="text-xs text-foreground-500">{doc.type}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{doc.vendor}</td>
                            <td className="py-3 px-4">{doc.project}</td>
                            <td className="py-3 px-4">{doc.date}</td>
                            <td className="py-3 px-4 font-medium">{doc.amount}</td>
                            <td className="py-3 px-4">
                              <Badge 
                                color={doc.status === "Processed" ? "success" : 
                                      doc.status === "Awaiting Review" ? "warning" : 
                                      doc.status === "Synced" ? "primary" : "danger"}
                                variant="flat"
                              >
                                {doc.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  isIconOnly
                                  variant="light"
                                  size="sm"
                                  onPress={() => navigateTo("document-processing")}
                                >
                                  <Icon icon="lucide:eye" className="h-4 w-4" />
                                </Button>
                                <Button
                                  isIconOnly
                                  variant="light"
                                  size="sm"
                                >
                                  <Icon icon="lucide:download" className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-foreground-500">
                            <div className="flex flex-col items-center">
                              <Icon icon="lucide:search-x" className="h-12 w-12 text-foreground-300 mb-4" />
                              <p className="font-medium mb-1">No documents found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {filteredDocuments.length > 0 && (
                  <div className="flex justify-center mt-6">
                    <Pagination
                      total={totalPages}
                      initialPage={1}
                      page={currentPage}
                      onChange={setCurrentPage}
                      color="primary"
                      showControls
                    />
                  </div>
                )}
              </CardBody>
            </Card>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground-500">
                Showing {currentDocuments.length} of {filteredDocuments.length} documents
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="flat"
                  color="primary"
                  startContent={<Icon icon="lucide:download" className="h-4 w-4" />}
                >
                  Export Results
                </Button>
                <Button
                  variant="flat"
                  color="primary"
                  startContent={<Icon icon="lucide:printer" className="h-4 w-4" />}
                >
                  Print
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};