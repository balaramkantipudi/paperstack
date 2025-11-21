import React from "react";
import { Button, Card, CardBody, Input, Badge, Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Progress } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const VendorManagementView: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedVendor, setSelectedVendor] = React.useState<string | null>("BuildSupply Inc.");
  const [activeTab, setActiveTab] = React.useState("details");
  const [currentPage, setCurrentPage] = React.useState(1);

  const vendors = [
    {
      name: "BuildSupply Inc.",
      type: "Materials Supplier",
      contact: "John Smith",
      email: "john@buildsupply.com",
      phone: "(555) 123-4567",
      address: "123 Supplier St, Construction City, CC 12345",
      paymentTerms: "Net 30",
      website: "www.buildsupply.com",
      documents: 12,
      totalSpent: "$58,750.00",
      lastTransaction: "Jul 15, 2023",
      commonCategories: ["Materials", "Tools"],
      notes: "Preferred supplier for lumber and general building materials."
    },
    {
      name: "ConMaterials Co.",
      type: "Concrete Supplier",
      contact: "Sarah Johnson",
      email: "sarah@conmaterials.com",
      phone: "(555) 234-5678",
      address: "456 Concrete Ave, Construction City, CC 12345",
      paymentTerms: "Net 15",
      website: "www.conmaterials.com",
      documents: 8,
      totalSpent: "$42,300.00",
      lastTransaction: "Jul 13, 2023",
      commonCategories: ["Materials", "Concrete"],
      notes: "Reliable concrete supplier with good delivery times."
    },
    {
      name: "Equipment Rental Pro",
      type: "Equipment Rental",
      contact: "Mike Wilson",
      email: "mike@equipmentrentalpro.com",
      phone: "(555) 345-6789",
      address: "789 Machinery Rd, Construction City, CC 12345",
      paymentTerms: "Net 15",
      website: "www.equipmentrentalpro.com",
      documents: 6,
      totalSpent: "$28,450.00",
      lastTransaction: "Jul 10, 2023",
      commonCategories: ["Equipment Rental", "Tools"],
      notes: "Good rates on heavy machinery rentals."
    },
    {
      name: "Elite Electrical Services",
      type: "Subcontractor",
      contact: "David Lee",
      email: "david@eliteelectrical.com",
      phone: "(555) 456-7890",
      address: "101 Electric Blvd, Construction City, CC 12345",
      paymentTerms: "Net 45",
      website: "www.eliteelectrical.com",
      documents: 1,
      totalSpent: "$24,500.00",
      lastTransaction: "Jul 12, 2023",
      commonCategories: ["Labor", "Materials"],
      notes: "High-quality electrical subcontractor."
    },
    {
      name: "City Permits Office",
      type: "Government",
      contact: "Robert Brown",
      email: "permits@constructioncity.gov",
      phone: "(555) 567-8901",
      address: "City Hall, Construction City, CC 12345",
      paymentTerms: "Immediate",
      website: "www.constructioncity.gov/permits",
      documents: 5,
      totalSpent: "$12,500.00",
      lastTransaction: "Jul 14, 2023",
      commonCategories: ["Permits & Fees"],
      notes: "City office for all construction permits and inspections."
    }
  ];

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentVendor = vendors.find(vendor => vendor.name === selectedVendor);

  const vendorDocuments = [
    {
      id: 1,
      name: "Invoice #2458",
      type: "Invoice",
      date: "Jul 15, 2023",
      status: "Processed",
      amount: "$13,446.00",
      project: "Downtown Office Tower"
    },
    {
      id: 2,
      name: "Change Order #12",
      type: "Change Order",
      date: "Jul 12, 2023",
      status: "Awaiting Review",
      amount: "$4,250.00",
      project: "Downtown Office Tower"
    },
    {
      id: 3,
      name: "Invoice #2432",
      type: "Invoice",
      date: "Jun 28, 2023",
      status: "Processed",
      amount: "$8,750.00",
      project: "Westside Residential Complex"
    },
    {
      id: 4,
      name: "Invoice #2415",
      type: "Invoice",
      date: "Jun 15, 2023",
      status: "Processed",
      amount: "$12,350.00",
      project: "Harbor Bridge Renovation"
    },
    {
      id: 5,
      name: "Credit Memo #103",
      type: "Credit Memo",
      date: "Jun 10, 2023",
      status: "Processed",
      amount: "-$1,250.00",
      project: "Downtown Office Tower"
    }
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(vendorDocuments.length / itemsPerPage);
  const currentDocuments = vendorDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const spendingHistory = [
    { month: "Jan", amount: 4500 },
    { month: "Feb", amount: 6200 },
    { month: "Mar", amount: 5800 },
    { month: "Apr", amount: 7500 },
    { month: "May", amount: 9200 },
    { month: "Jun", amount: 12300 },
    { month: "Jul", amount: 13250 }
  ];

  const maxSpending = Math.max(...spendingHistory.map(item => item.amount));

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
              <span className="text-foreground-500">Vendors:</span>
              <span className="font-medium ml-2">Management</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="flat"
              color="primary"
              startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
            >
              Add Vendor
            </Button>

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
            <h1 className="font-gilroy text-2xl md:text-3xl font-bold mb-1">Vendor Management</h1>
            <p className="text-foreground-500">Manage your construction vendors and supplier relationships</p>
          </div>

          <div className="flex items-center gap-4">
            <Input
              placeholder="Search vendors..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<Icon icon="lucide:search" className="h-4 w-4 text-foreground-400" />}
              className="w-full md:w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vendor List */}
          <div>
            <Card className="ambient-shadow mb-8">
              <CardBody className="p-6">
                <h2 className="font-gilroy text-lg font-bold mb-6">Vendors</h2>

                <div className="space-y-3">
                  {filteredVendors.map((vendor) => (
                    <div
                      key={vendor.name}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedVendor === vendor.name
                          ? 'bg-primary-50 border border-primary-200'
                          : 'hover:bg-foreground-50 border border-foreground-200'
                        }`}
                      onClick={() => setSelectedVendor(vendor.name)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-foreground-200 flex items-center justify-center mr-3">
                            <span className="font-medium">{vendor.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{vendor.name}</p>
                            <p className="text-xs text-foreground-500">{vendor.type}</p>
                          </div>
                        </div>
                        <Icon
                          icon="lucide:chevron-right"
                          className={`h-5 w-5 ${selectedVendor === vendor.name ? 'text-primary-500' : 'text-foreground-300'}`}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-foreground-500">
                        <span>{vendor.documents} documents</span>
                        <span>Total: {vendor.totalSpent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <h2 className="font-gilroy text-lg font-bold mb-4">Common Construction Suppliers</h2>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Building Materials:</span> Home Depot, Lowe's, 84 Lumber
                  </p>
                  <p>
                    <span className="font-medium">Concrete:</span> Cemex, Vulcan Materials, LafargeHolcim
                  </p>
                  <p>
                    <span className="font-medium">Electrical:</span> Graybar, Consolidated Electrical Distributors
                  </p>
                  <p>
                    <span className="font-medium">Plumbing:</span> Ferguson, Hajoca, WinSupply
                  </p>
                  <p>
                    <span className="font-medium">Equipment Rental:</span> United Rentals, Sunbelt Rentals
                  </p>
                </div>

                <Button
                  variant="flat"
                  color="primary"
                  className="w-full mt-4"
                  startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
                >
                  Add Common Suppliers
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* Vendor Details */}
          <div className="lg:col-span-2">
            {currentVendor ? (
              <>
                <Card className="ambient-shadow mb-8">
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                          <span className="font-bold text-primary-500 text-xl">{currentVendor.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h2 className="font-gilroy text-xl font-bold">{currentVendor.name}</h2>
                          <p className="text-foreground-500">{currentVendor.type}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="flat"
                          color="primary"
                          startContent={<Icon icon="lucide:edit" className="h-4 w-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="flat"
                          color="danger"
                          startContent={<Icon icon="lucide:trash-2" className="h-4 w-4" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    <Tabs
                      selectedKey={activeTab}
                      onSelectionChange={(key) => setActiveTab(key as string)}
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
                            <Icon icon="lucide:info" className="h-4 w-4" />
                            <span>Details</span>
                          </div>
                        }
                      />
                      <Tab
                        key="documents"
                        title={
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:file-text" className="h-4 w-4" />
                            <span>Documents</span>
                          </div>
                        }
                      />
                      <Tab
                        key="spending"
                        title={
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:bar-chart-2" className="h-4 w-4" />
                            <span>Spending</span>
                          </div>
                        }
                      />
                      <Tab
                        key="reconciliation"
                        title={
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:check-square" className="h-4 w-4" />
                            <span>Reconciliation</span>
                          </div>
                        }
                      />
                    </Tabs>
                  </CardBody>
                </Card>

                {activeTab === "details" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="ambient-shadow mb-8">
                      <CardBody className="p-6">
                        <h3 className="font-dmsans font-semibold mb-6">Contact Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-foreground-500 mb-1">
                              Contact Name
                            </label>
                            <p className="font-medium">{currentVendor.contact}</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground-500 mb-1">
                              Email Address
                            </label>
                            <p className="font-medium">{currentVendor.email}</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground-500 mb-1">
                              Phone Number
                            </label>
                            <p className="font-medium">{currentVendor.phone}</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground-500 mb-1">
                              Website
                            </label>
                            <p className="font-medium text-primary-500">{currentVendor.website}</p>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-foreground-500 mb-1">
                              Address
                            </label>
                            <p className="font-medium">{currentVendor.address}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="ambient-shadow mb-8">
                      <CardBody className="p-6">
                        <h3 className="font-dmsans font-semibold mb-6">Payment Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-foreground-500 mb-1">
                              Payment Terms
                            </label>
                            <p className="font-medium">{currentVendor.paymentTerms}</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground-500 mb-1">
                              Default Account
                            </label>
                            <p className="font-medium">Materials Expense</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground-500 mb-1">
                              Tax ID / EIN
                            </label>
                            <p className="font-medium">XX-XXXXXXX</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground-500 mb-1">
                              1099 Vendor
                            </label>
                            <p className="font-medium">No</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="ambient-shadow">
                      <CardBody className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-dmsans font-semibold">Notes & Categories</h3>
                          <Button
                            variant="flat"
                            color="primary"
                            size="sm"
                            startContent={<Icon icon="lucide:edit" className="h-4 w-4" />}
                          >
                            Edit
                          </Button>
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-foreground-500 mb-1">
                            Notes
                          </label>
                          <p className="p-3 bg-foreground-50 rounded-md">{currentVendor.notes}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground-500 mb-2">
                            Common Categories
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {currentVendor.commonCategories.map((category, index) => (
                              <Badge key={index} color="primary" variant="flat">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                )}

                {activeTab === "documents" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="ambient-shadow mb-8">
                      <CardBody className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-dmsans font-semibold">Recent Documents</h3>
                          <Button
                            variant="flat"
                            color="primary"
                            size="sm"
                            startContent={<Icon icon="lucide:upload" className="h-4 w-4" />}
                            onPress={() => navigateTo("document-upload")}
                          >
                            Upload
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {currentDocuments.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-3 hover:bg-foreground-50 rounded-md transition-colors cursor-pointer border border-foreground-100"
                              onClick={() => navigateTo("document-processing")}
                            >
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-md bg-primary-50 flex items-center justify-center mr-4">
                                  <Icon
                                    icon={
                                      doc.type === "Invoice" ? "lucide:file-text" :
                                        doc.type === "Receipt" ? "lucide:receipt" :
                                          doc.type === "Contract" ? "lucide:file-signature" :
                                            doc.type === "Change Order" ? "lucide:file-plus" :
                                              doc.type === "Credit Memo" ? "lucide:file-minus" :
                                                "lucide:file"
                                    }
                                    className="h-5 w-5 text-primary-500"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{doc.name}</p>
                                  <div className="flex items-center text-xs text-foreground-500">
                                    <span>{doc.type}</span>
                                    <span className="mx-2">•</span>
                                    <span>{doc.project}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="text-right mr-4">
                                  <div className={`font-medium ${doc.amount.includes('-') ? 'text-danger-500' : ''}`}>
                                    {doc.amount}
                                  </div>
                                  <div className="text-xs text-foreground-500">{doc.date}</div>
                                </div>
                                <Badge
                                  color={doc.status === "Processed" ? "success" : "warning"}
                                  variant="flat"
                                >
                                  {doc.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>

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
                      </CardBody>
                    </Card>

                    <Card className="ambient-shadow">
                      <CardBody className="p-6">
                        <h3 className="font-dmsans font-semibold mb-6">Document Summary</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="p-4 border border-foreground-200 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Icon icon="lucide:file-text" className="h-5 w-5 text-primary-500 mr-2" />
                              <h4 className="font-medium">Invoices</h4>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-foreground-500">Count:</span>
                              <span className="font-bold">8</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-foreground-500">Total:</span>
                              <span className="font-bold">$52,750.00</span>
                            </div>
                          </div>

                          <div className="p-4 border border-foreground-200 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Icon icon="lucide:file-plus" className="h-5 w-5 text-warning-500 mr-2" />
                              <h4 className="font-medium">Change Orders</h4>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-foreground-500">Count:</span>
                              <span className="font-bold">3</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-foreground-500">Total:</span>
                              <span className="font-bold">$7,250.00</span>
                            </div>
                          </div>

                          <div className="p-4 border border-foreground-200 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Icon icon="lucide:file-minus" className="h-5 w-5 text-danger-500 mr-2" />
                              <h4 className="font-medium">Credit Memos</h4>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-foreground-500">Count:</span>
                              <span className="font-bold">1</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-foreground-500">Total:</span>
                              <span className="font-bold text-danger-500">-$1,250.00</span>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                )}

                {activeTab === "spending" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="ambient-shadow mb-8">
                      <CardBody className="p-6">
                        <h3 className="font-dmsans font-semibold mb-6">Spending History</h3>

                        <div className="h-64 mb-6">
                          <div className="flex h-full items-end">
                            {spendingHistory.map((item, index) => (
                              <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                  className="w-full max-w-[40px] bg-primary-500 rounded-t-sm"
                                  style={{ height: `${(item.amount / maxSpending) * 100}%` }}
                                ></div>
                                <div className="mt-2 text-xs text-foreground-500">{item.month}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="p-4 border border-foreground-200 rounded-lg">
                            <div className="text-foreground-500 text-sm mb-1">Total Spent (YTD)</div>
                            <div className="font-bold text-2xl">$58,750.00</div>
                          </div>

                          <div className="p-4 border border-foreground-200 rounded-lg">
                            <div className="text-foreground-500 text-sm mb-1">Avg. Monthly Spend</div>
                            <div className="font-bold text-2xl">$8,392.86</div>
                          </div>

                          <div className="p-4 border border-foreground-200 rounded-lg">
                            <div className="text-foreground-500 text-sm mb-1">YoY Change</div>
                            <div className="font-bold text-2xl text-success-500">+12.4%</div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="ambient-shadow">
                      <CardBody className="p-6">
                        <h3 className="font-dmsans font-semibold mb-6">Spending by Project</h3>

                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Downtown Office Tower</span>
                              <div>
                                <span className="font-medium">$28,450.00</span>
                                <span className="text-foreground-500 ml-1">(48%)</span>
                              </div>
                            </div>
                            <Progress value={48} color="primary" size="sm" />
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Westside Residential Complex</span>
                              <div>
                                <span className="font-medium">$12,350.00</span>
                                <span className="text-foreground-500 ml-1">(21%)</span>
                              </div>
                            </div>
                            <Progress value={21} color="primary" size="sm" />
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Harbor Bridge Renovation</span>
                              <div>
                                <span className="font-medium">$17,950.00</span>
                                <span className="text-foreground-500 ml-1">(31%)</span>
                              </div>
                            </div>
                            <Progress value={31} color="primary" size="sm" />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                )}

                {activeTab === "reconciliation" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="ambient-shadow mb-8">
                      <CardBody className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-dmsans font-semibold">Vendor Statement Reconciliation</h3>
                          <Button
                            variant="flat"
                            color="primary"
                            size="sm"
                            startContent={<Icon icon="lucide:upload" className="h-4 w-4" />}
                          >
                            Upload Statement
                          </Button>
                        </div>

                        <div className="flex items-center justify-center p-12 border border-dashed border-foreground-300 rounded-lg mb-6">
                          <div className="text-center">
                            <Icon icon="lucide:file-scan" className="h-12 w-12 text-foreground-300 mx-auto mb-4" />
                            <p className="font-medium mb-2">No vendor statement uploaded</p>
                            <p className="text-sm text-foreground-500 mb-4">
                              Upload a vendor statement to reconcile with your records
                            </p>
                            <Button
                              color="primary"
                              startContent={<Icon icon="lucide:upload" className="h-4 w-4" />}
                            >
                              Upload Statement
                            </Button>
                          </div>
                        </div>

                        <div className="bg-foreground-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">How Statement Reconciliation Works</h4>
                          <ol className="list-decimal list-inside space-y-2 text-sm text-foreground-600">
                            <li>Upload your vendor's statement</li>
                            <li>Our AI will extract all line items</li>
                            <li>We'll match them against your recorded documents</li>
                            <li>Review any discrepancies</li>
                            <li>Resolve differences and maintain accurate records</li>
                          </ol>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="ambient-shadow">
                      <CardBody className="p-6">
                        <h3 className="font-dmsans font-semibold mb-6">Payment Status</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="p-4 border border-foreground-200 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Icon icon="lucide:check-circle" className="h-5 w-5 text-success-500 mr-2" />
                              <h4 className="font-medium">Paid</h4>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-foreground-500">Count:</span>
                              <span className="font-bold">9</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-foreground-500">Total:</span>
                              <span className="font-bold">$45,300.00</span>
                            </div>
                          </div>

                          <div className="p-4 border border-foreground-200 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Icon icon="lucide:clock" className="h-5 w-5 text-warning-500 mr-2" />
                              <h4 className="font-medium">Pending</h4>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-foreground-500">Count:</span>
                              <span className="font-bold">2</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-foreground-500">Total:</span>
                              <span className="font-bold">$13,450.00</span>
                            </div>
                          </div>

                          <div className="p-4 border border-foreground-200 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Icon icon="lucide:alert-triangle" className="h-5 w-5 text-danger-500 mr-2" />
                              <h4 className="font-medium">Overdue</h4>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-foreground-500">Count:</span>
                              <span className="font-bold">0</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-foreground-500">Total:</span>
                              <span className="font-bold">$0.00</span>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center p-12 border border-dashed border-foreground-300 rounded-lg">
                <div className="text-center">
                  <Icon icon="lucide:building" className="h-12 w-12 text-foreground-300 mx-auto mb-4" />
                  <p className="font-medium mb-2">No vendor selected</p>
                  <p className="text-sm text-foreground-500">
                    Select a vendor from the list to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};