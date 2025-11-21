import React from "react";
import {
  Button, Card, CardBody, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Badge,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Pagination, Switch, Tooltip,
  Checkbox, RangeCalendar, Popover, PopoverTrigger, PopoverContent, Select, SelectItem
} from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { parseDate } from "@internationalized/date";

export const DocumentSearchPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDocuments, setSelectedDocuments] = React.useState<Set<number>>(new Set());
  const [showFilterPanel, setShowFilterPanel] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [showSaveSearchModal, setShowSaveSearchModal] = React.useState(false);
  const [savedSearchName, setSavedSearchName] = React.useState("");

  // Filter states
  const [dateRange, setDateRange] = React.useState<{ start: Date | null, end: Date | null }>({
    start: null,
    end: null
  });
  const [selectedProject, setSelectedProject] = React.useState<Set<string>>(new Set(["all"]));
  const [selectedVendor, setSelectedVendor] = React.useState<Set<string>>(new Set(["all"]));
  const [selectedCategory, setSelectedCategory] = React.useState<Set<string>>(new Set(["all"]));
  const [amountRange, setAmountRange] = React.useState<{ min: string, max: string }>({
    min: "",
    max: ""
  });
  const [selectedStatus, setSelectedStatus] = React.useState<Set<string>>(new Set(["all"]));
  const [selectedTaxStatus, setSelectedTaxStatus] = React.useState<Set<string>>(new Set(["all"]));

  const rowsPerPage = 10;

  // Sample data
  const documents = [
    {
      id: 1,
      name: "Invoice #2458",
      type: "Invoice",
      vendor: "BuildSupply Inc.",
      project: "Downtown Office Tower",
      category: "Materials",
      date: "2023-07-15",
      amount: 1193.25,
      status: "Paid",
      taxDeductible: true
    },
    {
      id: 2,
      name: "Invoice #2459",
      type: "Invoice",
      vendor: "Metro Concrete",
      project: "Harbor Bridge Renovation",
      category: "Materials",
      date: "2023-07-22",
      amount: 2450.75,
      status: "Unpaid",
      taxDeductible: true
    },
    {
      id: 3,
      name: "Receipt #R-789",
      type: "Receipt",
      vendor: "City Electric Supply",
      project: "Downtown Office Tower",
      category: "Electrical",
      date: "2023-07-25",
      amount: 345.25,
      status: "Processed",
      taxDeductible: true
    },
    {
      id: 4,
      name: "Contract #C-123",
      type: "Contract",
      vendor: "PlumbPro Services",
      project: "Westside Residential Complex",
      category: "Subcontractors",
      date: "2023-07-28",
      amount: 12500.00,
      status: "Active",
      taxDeductible: true
    },
    {
      id: 5,
      name: "Invoice #2460",
      type: "Invoice",
      vendor: "ConstructEquip Rentals",
      project: "Harbor Bridge Renovation",
      category: "Equipment Rental",
      date: "2023-08-01",
      amount: 875.50,
      status: "Unpaid",
      taxDeductible: true
    },
    {
      id: 6,
      name: "Permit #P-456",
      type: "Permit",
      vendor: "City Planning Department",
      project: "City Center Mall",
      category: "Permits & Fees",
      date: "2023-08-03",
      amount: 1250.00,
      status: "Approved",
      taxDeductible: false
    },
    {
      id: 7,
      name: "Invoice #2461",
      type: "Invoice",
      vendor: "Roofing Masters",
      project: "Westside Residential Complex",
      category: "Subcontractors",
      date: "2023-08-05",
      amount: 8500.00,
      status: "Paid",
      taxDeductible: true
    },
    {
      id: 8,
      name: "Receipt #R-790",
      type: "Receipt",
      vendor: "Safety Gear Pro",
      project: "Harbor Bridge Renovation",
      category: "Safety Equipment",
      date: "2023-08-08",
      amount: 675.50,
      status: "Processed",
      taxDeductible: true
    },
    {
      id: 9,
      name: "Change Order #CO-45",
      type: "Change Order",
      vendor: "HVAC Solutions",
      project: "Downtown Office Tower",
      category: "Subcontractors",
      date: "2023-08-10",
      amount: 1850.75,
      status: "Pending Approval",
      taxDeductible: true
    },
    {
      id: 10,
      name: "Invoice #2462",
      type: "Invoice",
      vendor: "BuildSupply Inc.",
      project: "City Center Mall",
      category: "Materials",
      date: "2023-08-12",
      amount: 3245.00,
      status: "Unpaid",
      taxDeductible: true
    },
    {
      id: 11,
      name: "Expense Report #ER-78",
      type: "Expense",
      vendor: "Internal",
      project: "Company-wide",
      category: "Office/Administrative",
      date: "2023-08-15",
      amount: 450.25,
      status: "Reimbursed",
      taxDeductible: false
    },
    {
      id: 12,
      name: "Invoice #2463",
      type: "Invoice",
      vendor: "City Electric Supply",
      project: "Westside Residential Complex",
      category: "Electrical",
      date: "2023-08-18",
      amount: 2175.50,
      status: "Paid",
      taxDeductible: true
    }
  ];

  const projects = ["All Projects", "Downtown Office Tower", "Harbor Bridge Renovation", "Westside Residential Complex", "City Center Mall", "Company-wide"];
  const vendors = ["All Vendors", "BuildSupply Inc.", "Metro Concrete", "City Electric Supply", "PlumbPro Services", "ConstructEquip Rentals", "City Planning Department", "Roofing Masters", "Safety Gear Pro", "HVAC Solutions", "Internal"];
  const categories = ["All Categories", "Materials", "Subcontractors", "Equipment Rental", "Electrical", "Permits & Fees", "Safety Equipment", "Office/Administrative"];
  const statuses = ["All Statuses", "Paid", "Unpaid", "Processed", "Active", "Approved", "Pending Approval", "Reimbursed"];
  const taxStatuses = ["All", "Tax Deductible", "Non-Deductible"];

  const savedSearches = [
    { id: 1, name: "Unpaid Invoices", count: 3 },
    { id: 2, name: "Recent Materials Purchases", count: 5 },
    { id: 3, name: "Q3 Expenses", count: 12 }
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter(doc => {
    // Search query
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !doc.vendor.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !doc.project.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !doc.category.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Tab filter
    if (activeTab === "invoices" && doc.type !== "Invoice") {
      return false;
    } else if (activeTab === "receipts" && doc.type !== "Receipt") {
      return false;
    } else if (activeTab === "contracts" && doc.type !== "Contract") {
      return false;
    } else if (activeTab === "unpaid" && doc.status !== "Unpaid") {
      return false;
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      const docDate = new Date(doc.date);
      if (docDate < dateRange.start || docDate > dateRange.end) {
        return false;
      }
    }

    // Project filter
    if (!selectedProject.has("all") && !selectedProject.has(doc.project)) {
      return false;
    }

    // Vendor filter
    if (!selectedVendor.has("all") && !selectedVendor.has(doc.vendor)) {
      return false;
    }

    // Category filter
    if (!selectedCategory.has("all") && !selectedCategory.has(doc.category)) {
      return false;
    }

    // Amount range filter
    const minAmount = amountRange.min ? parseFloat(amountRange.min) : 0;
    const maxAmount = amountRange.max ? parseFloat(amountRange.max) : Infinity;
    if (doc.amount < minAmount || doc.amount > maxAmount) {
      return false;
    }

    // Status filter
    if (!selectedStatus.has("all") && !selectedStatus.has(doc.status)) {
      return false;
    }

    // Tax status filter
    if (selectedTaxStatus.has("Tax Deductible") && !doc.taxDeductible) {
      return false;
    } else if (selectedTaxStatus.has("Non-Deductible") && doc.taxDeductible) {
      return false;
    }

    return true;
  });

  const paginatedDocuments = filteredDocuments.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Handle document selection
  const handleSelectionChange = (id: number) => {
    const newSelected = new Set(selectedDocuments);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDocuments(newSelected);
  };

  // Handle select all
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allIds = paginatedDocuments.map(doc => doc.id);
      setSelectedDocuments(new Set(allIds));
    } else {
      setSelectedDocuments(new Set());
    }
  };

  // Handle save search
  const handleSaveSearch = () => {
    if (savedSearchName) {
      // Save search logic would go here
      setShowSaveSearchModal(false);
      setSavedSearchName("");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setDateRange({ start: null, end: null });
    setSelectedProject(new Set(["all"]));
    setSelectedVendor(new Set(["all"]));
    setSelectedCategory(new Set(["all"]));
    setAmountRange({ min: "", max: "" });
    setSelectedStatus(new Set(["all"]));
    setSelectedTaxStatus(new Set(["all"]));
  };

  // Export selected documents
  const exportDocuments = () => {
    // Export logic would go here
    console.log("Exporting documents:", Array.from(selectedDocuments));
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
            <h1 className="font-gilroy text-2xl md:text-3xl font-bold mb-1">Document Search</h1>
            <p className="text-foreground-500">Find and manage your construction documents</p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="flat"
              color="primary"
              startContent={<Icon icon="lucide:upload" className="h-4 w-4" />}
            >
              Upload
            </Button>
            <Button
              color="primary"
              startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
            >
              New Document
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="ambient-shadow mb-8">
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Search documents, vendors, projects..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                startContent={<Icon icon="lucide:search" className="h-4 w-4 text-foreground-400" />}
                className="w-full md:w-96"
                isClearable
                onClear={() => setSearchQuery("")}
              />

              <div className="flex gap-2 ml-auto">
                <Button
                  variant="flat"
                  color={showFilterPanel ? "primary" : "default"}
                  startContent={<Icon icon="lucide:filter" className="h-4 w-4" />}
                  onPress={() => setShowFilterPanel(!showFilterPanel)}
                >
                  Filters
                </Button>

                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      startContent={<Icon icon="lucide:bookmark" className="h-4 w-4" />}
                    >
                      Saved Searches
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Saved searches">
                    {savedSearches.map((search) => (
                      <DropdownItem
                        key={search.id}
                        description={`${search.count} documents`}
                      >
                        {search.name}
                      </DropdownItem>
                    ))}
                    <DropdownItem
                      key="save-current"
                      startContent={<Icon icon="lucide:save" className="h-4 w-4" />}
                      onPress={() => setShowSaveSearchModal(true)}
                    >
                      Save Current Search
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilterPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-foreground-200 rounded-lg p-4 mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-foreground-700 mb-2">
                      Date Range
                    </label>
                    <Popover placement="bottom">
                      <PopoverTrigger>
                        <Button
                          variant="flat"
                          className="w-full justify-start"
                          startContent={<Icon icon="lucide:calendar" className="h-4 w-4" />}
                        >
                          {dateRange.start && dateRange.end ? (
                            `${formatDate(dateRange.start.toISOString())} - ${formatDate(dateRange.end.toISOString())}`
                          ) : (
                            "Select date range"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <RangeCalendar
                          aria-label="Date range"
                          onChange={(range) => {
                            if (range.start && range.end) {
                              setDateRange({
                                start: new Date(range.start.toDate('America/New_York')),
                                end: new Date(range.end.toDate('America/New_York'))
                              });
                            }
                          }}
                          defaultValue={{
                            start: dateRange.start ? parseDate(dateRange.start.toISOString().split('T')[0]) : undefined,
                            end: dateRange.end ? parseDate(dateRange.end.toISOString().split('T')[0]) : undefined
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Project */}
                  <div>
                    <label className="block text-sm font-medium text-foreground-700 mb-2">
                      Project
                    </label>
                    <Select
                      label="Select project"
                      selectionMode="multiple"
                      selectedKeys={selectedProject}
                      onSelectionChange={(keys) => {
                        const selected = new Set(keys);
                        if (selected.has("all")) {
                          setSelectedProject(new Set(["all"]));
                        } else {
                          setSelectedProject(selected as Set<string>);
                        }
                      }}
                      className="w-full"
                    >
                      {projects.map((project) => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  {/* Vendor */}
                  <div>
                    <label className="block text-sm font-medium text-foreground-700 mb-2">
                      Vendor
                    </label>
                    <Select
                      label="Select vendor"
                      selectionMode="multiple"
                      selectedKeys={selectedVendor}
                      onSelectionChange={(keys) => {
                        const selected = new Set(keys);
                        if (selected.has("all")) {
                          setSelectedVendor(new Set(["all"]));
                        } else {
                          setSelectedVendor(selected as Set<string>);
                        }
                      }}
                      className="w-full"
                    >
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor} value={vendor}>
                          {vendor}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-foreground-700 mb-2">
                      Category
                    </label>
                    <Select
                      label="Select category"
                      selectionMode="multiple"
                      selectedKeys={selectedCategory}
                      onSelectionChange={(keys) => {
                        const selected = new Set(keys);
                        if (selected.has("all")) {
                          setSelectedCategory(new Set(["all"]));
                        } else {
                          setSelectedCategory(selected as Set<string>);
                        }
                      }}
                      className="w-full"
                    >
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  {/* Amount Range */}
                  <div>
                    <label className="block text-sm font-medium text-foreground-700 mb-2">
                      Amount Range
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={amountRange.min}
                        onValueChange={(value) => setAmountRange({ ...amountRange, min: value })}
                        startContent={<span className="text-foreground-500">$</span>}
                        className="w-full"
                      />
                      <span className="text-foreground-500">-</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={amountRange.max}
                        onValueChange={(value) => setAmountRange({ ...amountRange, max: value })}
                        startContent={<span className="text-foreground-500">$</span>}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-foreground-700 mb-2">
                      Payment Status
                    </label>
                    <Select
                      label="Select status"
                      selectionMode="multiple"
                      selectedKeys={selectedStatus}
                      onSelectionChange={(keys) => {
                        const selected = new Set(keys);
                        if (selected.has("all")) {
                          setSelectedStatus(new Set(["all"]));
                        } else {
                          setSelectedStatus(selected as Set<string>);
                        }
                      }}
                      className="w-full"
                    >
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  {/* Tax Status */}
                  <div>
                    <label className="block text-sm font-medium text-foreground-700 mb-2">
                      Tax Deduction Status
                    </label>
                    <Select
                      label="Select tax status"
                      selectionMode="multiple"
                      selectedKeys={selectedTaxStatus}
                      onSelectionChange={(keys) => {
                        const selected = new Set(keys);
                        if (selected.has("all")) {
                          setSelectedTaxStatus(new Set(["all"]));
                        } else {
                          setSelectedTaxStatus(selected as Set<string>);
                        }
                      }}
                      className="w-full"
                    >
                      {taxStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    variant="flat"
                    color="danger"
                    onPress={resetFilters}
                    className="mr-2"
                  >
                    Reset Filters
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => setShowFilterPanel(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            )}

            <Tabs
              selectedKey={activeTab}
              onSelectionChange={(key) => {
                setActiveTab(key as string);
                setPage(1);
              }}
              color="primary"
              variant="underlined"
              classNames={{
                tabList: "gap-6",
                cursor: "w-full",
                tab: "max-w-fit px-0 h-12"
              }}
            >
              <Tab
                key="all"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:list" className="h-4 w-4" />
                    <span>All Documents</span>
                  </div>
                }
              />
              <Tab
                key="invoices"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:file-text" className="h-4 w-4" />
                    <span>Invoices</span>
                  </div>
                }
              />
              <Tab
                key="receipts"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:receipt" className="h-4 w-4" />
                    <span>Receipts</span>
                  </div>
                }
              />
              <Tab
                key="contracts"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:file-signature" className="h-4 w-4" />
                    <span>Contracts</span>
                  </div>
                }
              />
              <Tab
                key="unpaid"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:alert-circle" className="h-4 w-4" />
                    <span>Unpaid</span>
                  </div>
                }
              />
            </Tabs>

            {/* Batch Actions */}
            {selectedDocuments.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-4 mt-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="font-medium text-primary-700 mr-2">
                    {selectedDocuments.size} document{selectedDocuments.size > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    startContent={<Icon icon="lucide:tag" className="h-4 w-4" />}
                  >
                    Categorize
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    startContent={<Icon icon="lucide:folder" className="h-4 w-4" />}
                  >
                    Move to Project
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    startContent={<Icon icon="lucide:download" className="h-4 w-4" />}
                    onPress={exportDocuments}
                  >
                    Export
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
              </motion.div>
            )}

            <div className="pt-4">
              <Table
                aria-label="Documents table"
                removeWrapper
                selectionMode="multiple"
                selectedKeys={selectedDocuments}
                onSelectionChange={(keys) => {
                  if (typeof keys === "string") {
                    // Handle "all" selection
                    if (keys === "all") {
                      handleSelectAll(true);
                    }
                  } else {
                    setSelectedDocuments(keys as Set<number>);
                  }
                }}
                bottomContent={
                  <div className="flex w-full justify-center">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="primary"
                      page={page}
                      total={Math.ceil(filteredDocuments.length / rowsPerPage)}
                      onChange={(page) => setPage(page)}
                    />
                  </div>
                }
              >
                <TableHeader>
                  <TableColumn>DOCUMENT</TableColumn>
                  <TableColumn>VENDOR</TableColumn>
                  <TableColumn>PROJECT</TableColumn>
                  <TableColumn>CATEGORY</TableColumn>
                  <TableColumn>DATE</TableColumn>
                  <TableColumn>AMOUNT</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>TAX</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No documents found">
                  {paginatedDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-xs text-foreground-500">{doc.type}</div>
                      </TableCell>
                      <TableCell>{doc.vendor}</TableCell>
                      <TableCell>{doc.project}</TableCell>
                      <TableCell>{doc.category}</TableCell>
                      <TableCell>{formatDate(doc.date)}</TableCell>
                      <TableCell>{formatCurrency(doc.amount)}</TableCell>
                      <TableCell>
                        <Badge
                          color={
                            doc.status === "Paid" || doc.status === "Processed" || doc.status === "Approved" || doc.status === "Reimbursed" ? "success" :
                              doc.status === "Unpaid" ? "warning" :
                                "primary"
                          }
                          variant="flat"
                        >
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {doc.taxDeductible ? (
                          <Badge color="success" variant="flat">Deductible</Badge>
                        ) : (
                          <Badge color="danger" variant="flat">Non-Deductible</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tooltip content="View Document">
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                            >
                              <Icon icon="lucide:eye" className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Edit">
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                            >
                              <Icon icon="lucide:edit" className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Download">
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              color="primary"
                            >
                              <Icon icon="lucide:download" className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </main>

      {/* Save Search Modal */}
      <Modal
        isOpen={showSaveSearchModal}
        onOpenChange={setShowSaveSearchModal}
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Save Current Search
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Search Name"
                  placeholder="Enter a name for this search"
                  value={savedSearchName}
                  onValueChange={setSavedSearchName}
                />
                <p className="text-sm text-foreground-500 mt-2">
                  This will save your current search criteria for quick access later.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSaveSearch}>
                  Save Search
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};