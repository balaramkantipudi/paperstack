import React from "react";
import {
  Button, Card, CardBody, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Input, Badge, Progress, Tooltip, Tabs, Tab, Table, TableHeader, TableColumn, TableBody,
  TableRow, TableCell
} from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const FinancialDashboardPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [selectedProject, setSelectedProject] = React.useState("All Projects");
  const [selectedDateRange, setSelectedDateRange] = React.useState("This Month");

  const projects = [
    "All Projects",
    "Downtown Office Tower",
    "Westside Residential Complex",
    "Harbor Bridge Renovation",
    "City Center Mall"
  ];

  const dateRanges = [
    "Today",
    "This Week",
    "This Month",
    "Last Month",
    "This Quarter",
    "This Year",
    "Custom Range"
  ];

  const documentStatus = [
    {
      title: "Recently Uploaded",
      count: 12,
      icon: "lucide:upload-cloud",
      color: "primary"
    },
    {
      title: "Awaiting Review",
      count: 5,
      icon: "lucide:file-search",
      color: "warning"
    },
    {
      title: "Processed & Synced",
      count: 248,
      icon: "lucide:check-circle",
      color: "success"
    }
  ];

  const recentDocuments = [
    {
      name: "Invoice #2458",
      vendor: "BuildSupply Inc.",
      type: "Invoice",
      amount: "$1,193.25",
      date: "Today, 10:45 AM",
      status: "Processed",
      project: "Downtown Office Tower"
    },
    {
      name: "Permit Application",
      vendor: "City Planning Dept.",
      type: "Legal",
      amount: "$350.00",
      date: "Today, 9:12 AM",
      status: "Awaiting Review",
      project: "Westside Residential Complex"
    },
    {
      name: "Material Receipt",
      vendor: "Metro Concrete",
      type: "Receipt",
      amount: "$2,450.75",
      date: "Yesterday",
      status: "Processed",
      project: "Harbor Bridge Renovation"
    },
    {
      name: "Subcontractor Agreement",
      vendor: "ElectroPro Services",
      type: "Contract",
      amount: "$8,750.00",
      date: "Yesterday",
      status: "Processed",
      project: "City Center Mall"
    },
    {
      name: "Change Order #12",
      vendor: "ConstructEquip Rentals",
      type: "Change Order",
      amount: "$1,250.00",
      date: "Jul 12, 2023",
      status: "Awaiting Review",
      project: "Downtown Office Tower"
    }
  ];

  const expenseCategories = [
    { name: "Materials", amount: 45250, percentage: 38, color: "primary" },
    { name: "Labor", amount: 32800, percentage: 27, color: "success" },
    { name: "Subcontractors", amount: 24600, percentage: 20, color: "secondary" },
    { name: "Equipment Rental", amount: 12400, percentage: 10, color: "warning" },
    { name: "Permits & Fees", amount: 3650, percentage: 3, color: "danger" },
    { name: "Other", amount: 2300, percentage: 2, color: "default" }
  ];

  const projectBudgets = [
    {
      name: "Downtown Office Tower",
      budget: 250000,
      actual: 187500,
      percentage: 75,
      status: "On Budget"
    },
    {
      name: "Westside Residential Complex",
      budget: 175000,
      actual: 148750,
      percentage: 85,
      status: "Over Budget"
    },
    {
      name: "Harbor Bridge Renovation",
      budget: 320000,
      actual: 192000,
      percentage: 60,
      status: "On Budget"
    },
    {
      name: "City Center Mall",
      budget: 420000,
      actual: 126000,
      percentage: 30,
      status: "Under Budget"
    }
  ];

  const taxDeductions = [
    {
      category: "Equipment Purchases",
      amount: 28750,
      potential: 7187.50,
      section: "Section 179"
    },
    {
      category: "Vehicle Expenses",
      amount: 12450,
      potential: 3112.50,
      section: "Mileage Deduction"
    },
    {
      category: "Insurance Premiums",
      amount: 8750,
      potential: 2187.50,
      section: "Business Insurance"
    },
    {
      category: "Contract Labor",
      amount: 42500,
      potential: 10625.00,
      section: "1099 Contractors"
    }
  ];

  const topVendors = [
    {
      name: "BuildSupply Inc.",
      spent: 32450,
      invoices: 18,
      status: "Current",
      upcoming: 4850
    },
    {
      name: "Metro Concrete",
      spent: 28750,
      invoices: 12,
      status: "Current",
      upcoming: 0
    },
    {
      name: "City Electric Supply",
      spent: 18650,
      invoices: 15,
      status: "Overdue",
      upcoming: 3250
    },
    {
      name: "ConstructEquip Rentals",
      spent: 15800,
      invoices: 8,
      status: "Current",
      upcoming: 2750
    },
    {
      name: "PlumbPro Services",
      spent: 12450,
      invoices: 6,
      status: "Current",
      upcoming: 0
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
            <div className="relative">
              <Button
                isIconOnly
                variant="light"
                aria-label="Notifications"
              >
                <Icon icon="lucide:bell" className="h-5 w-5" />
              </Button>
              <Badge content="3" color="primary" size="sm" className="absolute -top-1 -right-1" />
            </div>

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
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-gilroy text-2xl md:text-3xl font-bold mb-1">Financial Dashboard</h1>
            <p className="text-foreground-500">Track your construction expenses, budgets, and tax deductions</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="bordered"
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

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                    endContent={<Icon icon="lucide:chevron-down" className="h-4 w-4" />}
                  >
                    {selectedDateRange}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Date range selection"
                  onAction={(key) => setSelectedDateRange(dateRanges[Number(key)])}
                >
                  {dateRanges.map((range, index) => (
                    <DropdownItem key={index}>{range}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>

            <Button
              color="primary"
              startContent={<Icon icon="lucide:upload" className="h-4 w-4" />}
              onPress={() => navigateTo("document-upload")}
            >
              Upload
            </Button>
          </div>
        </div>

        {/* Document Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {documentStatus.map((status, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="ambient-shadow">
                <CardBody className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-foreground-500 mb-1">{status.title}</p>
                      <h3 className="font-gilroy text-2xl font-bold">{status.count}</h3>
                      <p className={`text-xs mt-1 ${status.color === "warning" ? 'text-warning-500' : status.color === "success" ? 'text-success-500' : 'text-primary-500'}`}>
                        {status.color === "warning" ? 'Needs attention' : status.color === "success" ? 'Up to date' : 'Ready for review'}
                      </p>
                    </div>
                    <div className={`h-10 w-10 rounded-full bg-${status.color}-50 flex items-center justify-center`}>
                      <Icon icon={status.icon} className={`h-5 w-5 text-${status.color}-500`} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Expense Breakdown */}
            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Expense Breakdown</h2>
                  <Button
                    variant="light"
                    color="primary"
                    size="sm"
                    endContent={<Icon icon="lucide:arrow-right" className="h-4 w-4" />}
                  >
                    View Details
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Pie Chart */}
                  <div className="flex items-center justify-center">
                    <div className="relative h-48 w-48">
                      <svg viewBox="0 0 100 100" className="h-full w-full">
                        {expenseCategories.map((category, i) => {
                          // Calculate the segment positions
                          const previousPercentages = expenseCategories
                            .slice(0, i)
                            .reduce((sum, cat) => sum + cat.percentage, 0);

                          const startAngle = (previousPercentages / 100) * 360;
                          const endAngle = ((previousPercentages + category.percentage) / 100) * 360;

                          // Convert angles to radians and calculate coordinates
                          const startRad = (startAngle - 90) * (Math.PI / 180);
                          const endRad = (endAngle - 90) * (Math.PI / 180);

                          const x1 = 50 + 40 * Math.cos(startRad);
                          const y1 = 50 + 40 * Math.sin(startRad);
                          const x2 = 50 + 40 * Math.cos(endRad);
                          const y2 = 50 + 40 * Math.sin(endRad);

                          // Determine if the arc should be drawn as a large arc
                          const largeArcFlag = category.percentage > 50 ? 1 : 0;

                          // Create the SVG path
                          const d = `
                            M 50 50
                            L ${x1} ${y1}
                            A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
                            Z
                          `;

                          return (
                            <path
                              key={i}
                              d={d}
                              className={`fill-${category.color}-500`}
                              stroke="#fff"
                              strokeWidth="1"
                            />
                          );
                        })}
                        <circle cx="50" cy="50" r="25" fill="white" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-sm text-foreground-500">Total</p>
                          <p className="font-bold text-lg">$121,000</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category List */}
                  <div className="space-y-4">
                    {expenseCategories.map((category, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <div className={`h-3 w-3 rounded-full bg-${category.color}-500 mr-2`}></div>
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium">{formatCurrency(category.amount)}</span>
                            <span className="text-xs text-foreground-500 ml-2">({category.percentage}%)</span>
                          </div>
                        </div>
                        <Progress
                          value={category.percentage}
                          maxValue={100}
                          color={category.color as any}
                          size="sm"
                          className="mb-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Project Expense Tracker */}
            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Project Expense Tracker</h2>
                  <Button
                    variant="light"
                    color="primary"
                    size="sm"
                    endContent={<Icon icon="lucide:arrow-right" className="h-4 w-4" />}
                  >
                    View All Projects
                  </Button>
                </div>

                <div className="space-y-6">
                  {projectBudgets.map((project, index) => (
                    <div key={index} className="border border-foreground-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{project.name}</h3>
                        <Badge
                          color={
                            project.status === "Over Budget" ? "danger" :
                              project.status === "Under Budget" ? "success" :
                                "warning"
                          }
                          variant="flat"
                        >
                          {project.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-sm text-foreground-500 mr-2">Budget:</span>
                          <span className="font-medium">{formatCurrency(project.budget)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-foreground-500 mr-2">Actual:</span>
                          <span className="font-medium">{formatCurrency(project.actual)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-foreground-500 mr-2">Used:</span>
                          <span className="font-medium">{project.percentage}%</span>
                        </div>
                      </div>

                      <Progress
                        value={project.percentage}
                        maxValue={100}
                        color={
                          project.percentage > 90 ? "danger" :
                            project.percentage > 75 ? "warning" :
                              "success"
                        }
                        className="mb-2"
                      />

                      <div className="flex justify-end">
                        <Button
                          variant="light"
                          size="sm"
                          startContent={<Icon icon="lucide:pie-chart" className="h-4 w-4" />}
                        >
                          View Breakdown
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Tax Deduction Finder */}
            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Tax Deduction Finder</h2>
                  <Tooltip content="Potential tax deductions based on your expenses">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                    >
                      <Icon icon="lucide:info" className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                </div>

                <div className="space-y-4">
                  {taxDeductions.map((deduction, index) => (
                    <div key={index} className="border border-foreground-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-success-50 flex items-center justify-center mr-3">
                            <Icon icon="lucide:receipt" className="h-4 w-4 text-success-500" />
                          </div>
                          <div>
                            <p className="font-medium">{deduction.category}</p>
                            <p className="text-xs text-foreground-500">{deduction.section}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <p className="text-xs text-foreground-500">Total Spent</p>
                          <p className="font-medium">{formatCurrency(deduction.amount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-success-600">Potential Savings</p>
                          <p className="font-medium text-success-600">{formatCurrency(deduction.potential)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-foreground-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground-500">Total Potential Savings</p>
                      <p className="font-bold text-success-600 text-xl">{formatCurrency(23112.50)}</p>
                    </div>
                    <Button
                      color="success"
                      variant="flat"
                      startContent={<Icon icon="lucide:file-text" className="h-4 w-4" />}
                    >
                      Tax Report
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Vendor Analysis */}
            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Top Vendors</h2>
                  <Button
                    variant="light"
                    color="primary"
                    size="sm"
                    endContent={<Icon icon="lucide:arrow-right" className="h-4 w-4" />}
                    onPress={() => navigateTo("vendor-management")}
                  >
                    View All
                  </Button>
                </div>

                <Table
                  aria-label="Top vendors table"
                  removeWrapper
                >
                  <TableHeader>
                    <TableColumn>VENDOR</TableColumn>
                    <TableColumn>SPENT</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {topVendors.slice(0, 3).map((vendor, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-xs text-foreground-500">{vendor.invoices} invoices</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{formatCurrency(vendor.spent)}</div>
                          {vendor.upcoming > 0 && (
                            <div className="text-xs text-warning-600">
                              {formatCurrency(vendor.upcoming)} due soon
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            color={vendor.status === "Current" ? "success" : "danger"}
                            variant="flat"
                          >
                            {vendor.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>

            {/* Recent Documents */}
            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Recent Documents</h2>
                  <Button
                    variant="light"
                    color="primary"
                    size="sm"
                    endContent={<Icon icon="lucide:arrow-right" className="h-4 w-4" />}
                  >
                    View All
                  </Button>
                </div>

                <div className="space-y-3">
                  {recentDocuments.slice(0, 3).map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-foreground-50 rounded-md transition-colors cursor-pointer"
                      onClick={() => navigateTo("document-review")}
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-primary-50 flex items-center justify-center mr-4">
                          <Icon
                            icon={
                              doc.type === "Invoice" ? "lucide:file-text" :
                                doc.type === "Receipt" ? "lucide:receipt" :
                                  doc.type === "Contract" ? "lucide:file-signature" :
                                    doc.type === "Legal" ? "lucide:scale" :
                                      "lucide:file-plus"
                            }
                            className="h-5 w-5 text-primary-500"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <div className="flex items-center text-xs text-foreground-500">
                            <span>{doc.vendor}</span>
                            <span className="mx-2">•</span>
                            <span>{doc.amount}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        color={doc.status === "Processed" ? "success" : "warning"}
                        variant="flat"
                      >
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};