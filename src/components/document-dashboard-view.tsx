import React from "react";
import { Button, Card, CardBody, Input, Badge, Progress, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Divider } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const DocumentDashboardView: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [selectedProject, setSelectedProject] = React.useState("All Projects");
  const [selectedDateRange, setSelectedDateRange] = React.useState("Last 30 Days");

  const projects = [
    "All Projects",
    "Downtown Office Tower",
    "Westside Residential Complex",
    "Harbor Bridge Renovation",
    "City Center Mall"
  ];

  const dateRanges = [
    "Last 7 Days",
    "Last 30 Days",
    "Last 90 Days",
    "This Year",
    "Custom Range"
  ];

  const metrics = [
    {
      title: "Documents Processed",
      value: "248",
      change: "+12%",
      icon: "lucide:file-check",
      color: "primary"
    },
    {
      title: "Awaiting Review",
      value: "14",
      change: "-3",
      icon: "lucide:file-search",
      color: "warning"
    },
    {
      title: "Tax Deductions Found",
      value: "$24.8k",
      change: "+$2.1k",
      icon: "lucide:receipt",
      color: "success"
    },
    {
      title: "Processing Accuracy",
      value: "99.2%",
      change: "+0.5%",
      icon: "lucide:check-circle",
      color: "secondary"
    }
  ];

  const recentDocuments = [
    {
      name: "Invoice #2458",
      vendor: "BuildSupply Inc.",
      type: "Invoice",
      date: "Today, 10:45 AM",
      status: "Processed",
      amount: "$13,446.00",
      project: "Downtown Office Tower"
    },
    {
      name: "Permit Application",
      vendor: "City Permits Office",
      type: "Permit",
      date: "Today, 9:12 AM",
      status: "Awaiting Review",
      amount: "$2,500.00",
      project: "Westside Residential Complex"
    },
    {
      name: "Material Receipt",
      vendor: "ConMaterials Co.",
      type: "Receipt",
      date: "Yesterday",
      status: "Processed",
      amount: "$8,750.00",
      project: "Harbor Bridge Renovation"
    },
    {
      name: "Subcontractor Agreement",
      vendor: "Elite Electrical Services",
      type: "Contract",
      date: "Yesterday",
      status: "Processed",
      amount: "$24,500.00",
      project: "City Center Mall"
    },
    {
      name: "Change Order #12",
      vendor: "BuildSupply Inc.",
      type: "Change Order",
      date: "Jul 12, 2023",
      status: "Awaiting Review",
      amount: "$4,250.00",
      project: "Downtown Office Tower"
    }
  ];

  const expenseCategories = [
    { name: "Materials", amount: 125680, percentage: 42 },
    { name: "Labor", amount: 89450, percentage: 30 },
    { name: "Equipment Rental", amount: 35780, percentage: 12 },
    { name: "Permits & Fees", amount: 18500, percentage: 6 },
    { name: "Office/Administrative", amount: 15200, percentage: 5 },
    { name: "Other", amount: 14390, percentage: 5 }
  ];

  const topVendors = [
    { name: "BuildSupply Inc.", amount: 58750, count: 12 },
    { name: "ConMaterials Co.", amount: 42300, count: 8 },
    { name: "Equipment Rental Pro", amount: 28450, count: 6 },
    { name: "Elite Electrical Services", amount: 24500, count: 1 },
    { name: "City Permits Office", amount: 12500, count: 5 }
  ];

  const upcomingPayments = [
    { vendor: "BuildSupply Inc.", amount: "$13,446.00", due: "Aug 15, 2023", days: 5 },
    { vendor: "Equipment Rental Pro", amount: "$4,320.00", due: "Aug 20, 2023", days: 10 },
    { vendor: "ConMaterials Co.", amount: "$8,750.00", due: "Aug 25, 2023", days: 15 }
  ];

  const formatCurrency = (amount: number): string => {
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
            onClick={() => navigateTo("landing")}
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
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-gilroy text-2xl md:text-3xl font-bold mb-1">Document Insights</h1>
            <p className="text-foreground-500">Financial overview of your construction documents</p>
          </div>

          <div className="flex items-center gap-4">
            <Input
              placeholder="Search documents..."
              startContent={<Icon icon="lucide:search" className="h-4 w-4 text-foreground-400" />}
              className="w-full md:w-64"
            />

            <Button
              color="primary"
              startContent={<Icon icon="lucide:upload" className="h-4 w-4" />}
              onPress={() => navigateTo("document-upload")}
            >
              Upload
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
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

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
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
                      <p className="text-sm text-foreground-500 mb-1">{metric.title}</p>
                      <h3 className="font-gilroy text-2xl font-bold">{metric.value}</h3>
                      <p className={`text-xs mt-1 ${metric.change.includes('+') ? 'text-success-500' : 'text-danger-500'}`}>
                        {metric.change} from last month
                      </p>
                    </div>
                    <div className={`h-10 w-10 rounded-full bg-${metric.color}-50 flex items-center justify-center`}>
                      <Icon icon={metric.icon} className={`h-5 w-5 text-${metric.color}-500`} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Documents */}
          <div className="lg:col-span-2">
            <Card className="ambient-shadow mb-8">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Recent Documents</h2>
                  <Button
                    variant="light"
                    color="primary"
                    endContent={<Icon icon="lucide:arrow-right" className="h-4 w-4" />}
                    onPress={() => navigateTo("document-search")}
                  >
                    View all
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-foreground-50 rounded-md transition-colors cursor-pointer"
                      onClick={() => navigateTo("document-processing")}
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-primary-50 flex items-center justify-center mr-4">
                          <Icon
                            icon={
                              doc.type === "Invoice" ? "lucide:file-text" :
                                doc.type === "Receipt" ? "lucide:receipt" :
                                  doc.type === "Contract" ? "lucide:file-signature" :
                                    doc.type === "Permit" ? "lucide:scale" :
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
                            <span>{doc.project}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-right mr-4">
                          <div className="font-medium">{doc.amount}</div>
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
              </CardBody>
            </Card>

            {/* Project Expense Tracker */}
            <Card className="ambient-shadow mb-8">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Project Expense Tracker</h2>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                  >
                    <Icon icon="lucide:more-horizontal" className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-dmsans font-semibold mb-4">Budget vs. Actual</h3>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Downtown Office Tower</span>
                          <div>
                            <span className="font-medium">$993,450</span>
                            <span className="text-foreground-500 ml-1">/ $1.25M</span>
                          </div>
                        </div>
                        <Progress value={79} color="primary" size="sm" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Westside Residential</span>
                          <div>
                            <span className="font-medium">$645,780</span>
                            <span className="text-foreground-500 ml-1">/ $850K</span>
                          </div>
                        </div>
                        <Progress value={76} color="primary" size="sm" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Harbor Bridge</span>
                          <div>
                            <span className="font-medium">$412,300</span>
                            <span className="text-foreground-500 ml-1">/ $500K</span>
                          </div>
                        </div>
                        <Progress value={82} color="warning" size="sm" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>City Center Mall</span>
                          <div>
                            <span className="font-medium">$324,500</span>
                            <span className="text-foreground-500 ml-1">/ $750K</span>
                          </div>
                        </div>
                        <Progress value={43} color="success" size="sm" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-dmsans font-semibold mb-4">Expense Categories</h3>

                    <div className="space-y-4">
                      {expenseCategories.map((category, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{category.name}</span>
                            <div>
                              <span className="font-medium">{formatCurrency(category.amount)}</span>
                              <span className="text-foreground-500 ml-1">({category.percentage}%)</span>
                            </div>
                          </div>
                          <Progress value={category.percentage} color="primary" size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div>
            {/* Tax Deduction Finder */}
            <Card className="ambient-shadow mb-8">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Tax Deduction Finder</h2>
                  <Badge color="success" variant="flat">$24,800 Found</Badge>
                </div>

                <div className="space-y-4">
                  <div className="p-3 border border-success-200 bg-success-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Icon icon="lucide:truck" className="h-5 w-5 text-success-500 mr-2" />
                      <h3 className="font-medium">Vehicle Expenses</h3>
                    </div>
                    <p className="text-sm text-foreground-600 mb-2">
                      12 receipts found for vehicle expenses that qualify for deduction.
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>Potential Deduction:</span>
                      <span className="font-bold text-success-600">$8,450</span>
                    </div>
                  </div>

                  <div className="p-3 border border-success-200 bg-success-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Icon icon="lucide:hard-hat" className="h-5 w-5 text-success-500 mr-2" />
                      <h3 className="font-medium">Equipment Purchases</h3>
                    </div>
                    <p className="text-sm text-foreground-600 mb-2">
                      5 invoices found for equipment that qualifies for Section 179 deduction.
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>Potential Deduction:</span>
                      <span className="font-bold text-success-600">$12,350</span>
                    </div>
                  </div>

                  <div className="p-3 border border-success-200 bg-success-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Icon icon="lucide:home" className="h-5 w-5 text-success-500 mr-2" />
                      <h3 className="font-medium">Home Office</h3>
                    </div>
                    <p className="text-sm text-foreground-600 mb-2">
                      Home office expenses qualify for deduction based on square footage.
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>Potential Deduction:</span>
                      <span className="font-bold text-success-600">$4,000</span>
                    </div>
                  </div>

                  <Button
                    variant="flat"
                    color="success"
                    className="w-full"
                    startContent={<Icon icon="lucide:file-text" className="h-4 w-4" />}
                  >
                    Generate Tax Report
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Vendor Analysis */}
            <Card className="ambient-shadow mb-8">
              <CardBody className="p-6">
                <h2 className="font-gilroy text-lg font-bold mb-6">Vendor Analysis</h2>

                <div>
                  <h3 className="font-dmsans font-semibold mb-4">Top Vendors</h3>
                  <div className="space-y-3">
                    {topVendors.map((vendor, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-foreground-200 flex items-center justify-center mr-3">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{vendor.name}</p>
                            <p className="text-xs text-foreground-500">{vendor.count} documents</p>
                          </div>
                        </div>
                        <span className="font-bold">{formatCurrency(vendor.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Divider className="my-6" />

                <div>
                  <h3 className="font-dmsans font-semibold mb-4">Upcoming Payments</h3>
                  <div className="space-y-3">
                    {upcomingPayments.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{payment.vendor}</p>
                          <p className="text-xs text-foreground-500">Due {payment.due}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{payment.amount}</p>
                          <p className={`text-xs ${payment.days <= 7 ? 'text-danger-500' : 'text-foreground-500'}`}>
                            {payment.days <= 7 ? `Due in ${payment.days} days` : `${payment.days} days left`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="flat"
                    color="primary"
                    className="w-full mt-4"
                    startContent={<Icon icon="lucide:calendar" className="h-4 w-4" />}
                  >
                    View Payment Calendar
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <h2 className="font-gilroy text-lg font-bold mb-4">Quick Actions</h2>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="flat"
                    color="primary"
                    startContent={<Icon icon="lucide:upload" className="h-4 w-4" />}
                    className="justify-start"
                    onPress={() => navigateTo("document-upload")}
                  >
                    Upload
                  </Button>
                  <Button
                    variant="flat"
                    color="secondary"
                    startContent={<Icon icon="lucide:search" className="h-4 w-4" />}
                    className="justify-start"
                    onPress={() => navigateTo("document-search")}
                  >
                    Search
                  </Button>
                  <Button
                    variant="flat"
                    color="success"
                    startContent={<Icon icon="lucide:file-plus" className="h-4 w-4" />}
                    className="justify-start"
                  >
                    New Project
                  </Button>
                  <Button
                    variant="flat"
                    color="warning"
                    startContent={<Icon icon="lucide:users" className="h-4 w-4" />}
                    className="justify-start"
                  >
                    Team
                  </Button>
                  <Button
                    variant="flat"
                    color="danger"
                    startContent={<Icon icon="lucide:receipt" className="h-4 w-4" />}
                    className="justify-start"
                  >
                    Tax Report
                  </Button>
                  <Button
                    variant="flat"
                    color="default"
                    startContent={<Icon icon="lucide:settings" className="h-4 w-4" />}
                    className="justify-start"
                    onPress={() => navigateTo("settings")}
                  >
                    Settings
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