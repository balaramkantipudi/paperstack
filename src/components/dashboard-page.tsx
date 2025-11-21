import React from "react";
import { Button, Card, CardBody, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input, Badge, Progress } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { documentService, Document, DocumentStats } from "../services/document-service";

export const DashboardPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [selectedProject, setSelectedProject] = React.useState("All Projects");
  const [searchExpanded, setSearchExpanded] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [stats, setStats] = React.useState<DocumentStats | null>(null);
  const [recentDocuments, setRecentDocuments] = React.useState<Document[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [fetchedStats, fetchedDocs] = await Promise.all([
          documentService.getStats(),
          documentService.getRecentDocuments()
        ]);
        setStats(fetchedStats);
        setRecentDocuments(fetchedDocs);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const projects = [
    "All Projects",
    "Downtown Office Tower",
    "Westside Residential Complex",
    "Harbor Bridge Renovation",
    "City Center Mall"
  ];

  const metrics = [
    {
      title: "Documents Processed",
      value: stats?.totalProcessed.toString() || "...",
      change: "+12%",
      icon: "lucide:file-check",
      color: "primary"
    },
    {
      title: "Time Saved",
      value: "86h",
      change: "+8%",
      icon: "lucide:clock",
      color: "secondary"
    },
    {
      title: "Awaiting Review",
      value: stats?.needsReview.toString() || "...",
      change: "-3",
      icon: "lucide:file-search",
      color: "default"
    },
    {
      title: "Tax Deductions",
      value: stats ? `$${(stats.totalValue / 1000).toFixed(1)}k` : "...",
      change: "+$2.1k",
      icon: "lucide:receipt",
      color: "success"
    }
  ];

  const documentCategories = [
    { name: "Invoices", count: 124, color: "primary" },
    { name: "Receipts", count: 87, color: "secondary" },
    { name: "Contracts", count: 32, color: "success" },
    { name: "Permits", count: 18, color: "warning" },
    { name: "Change Orders", count: 42, color: "danger" }
  ];

  // Handle search expansion
  const expandSearch = () => {
    setSearchExpanded(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
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
            {searchExpanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "240px", opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <Input
                  ref={searchInputRef}
                  placeholder="Search documents..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  startContent={<Icon icon="lucide:search" className="h-4 w-4 text-foreground-400" />}
                  endContent={
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => setSearchExpanded(false)}
                    >
                      <Icon icon="lucide:x" className="h-4 w-4" />
                    </Button>
                  }
                  onBlur={() => {
                    if (!searchQuery) {
                      setSearchExpanded(false);
                    }
                  }}
                  className="w-full"
                />
              </motion.div>
            )}

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
            <h1 className="font-gilroy text-2xl md:text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-foreground-500">Welcome back, John. Here's what's happening today.</p>
          </div>

          <div className="flex items-center gap-4">
            {!searchExpanded && (
              <Input
                placeholder="Search documents..."
                startContent={<Icon icon="lucide:search" className="h-4 w-4 text-foreground-400" />}
                className="w-full md:w-64"
              />
            )}

            <Button
              color="primary"
              startContent={<Icon icon="lucide:upload" className="h-4 w-4" />}
              onPress={() => navigateTo("document-upload")}
            >
              Upload
            </Button>
          </div>
        </div>

        {/* Project Filter */}
        <div className="mb-8">
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
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Recent Documents</h2>
                  <Button
                    variant="light"
                    color="primary"
                    endContent={<Icon icon="lucide:arrow-right" className="h-4 w-4" />}
                    onPress={() => navigateTo("financial-dashboard")}
                  >
                    View all
                  </Button>
                </div>

                <div className="space-y-4">
                  {isLoading ? (
                    <div className="p-4 text-center text-foreground-500">Loading documents...</div>
                  ) : recentDocuments.length === 0 ? (
                    <div className="p-4 text-center text-foreground-500">No recent documents found</div>
                  ) : (
                    recentDocuments
                      .filter(doc => {
                        if (!searchQuery) return true;
                        const query = searchQuery.toLowerCase();
                        return (
                          doc.name.toLowerCase().includes(query) ||
                          (doc.vendor && doc.vendor.toLowerCase().includes(query)) ||
                          doc.type.toLowerCase().includes(query)
                        );
                      })
                      .map((doc, index) => (
                        <div
                          key={doc.id || index}
                          className="flex items-center justify-between p-3 hover:bg-foreground-50 rounded-md transition-colors cursor-pointer"
                          onClick={() => navigateTo("document-processing")}
                        >
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-md bg-primary-50 flex items-center justify-center mr-4">
                              <Icon
                                icon={
                                  doc.type === "invoice" ? "lucide:file-text" :
                                    doc.type === "receipt" ? "lucide:receipt" :
                                      doc.type === "contract" ? "lucide:file-signature" :
                                        "lucide:file"
                                }
                                className="h-5 w-5 text-primary-500"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <div className="flex items-center text-xs text-foreground-500">
                                <span className="capitalize">{doc.type}</span>
                                <span className="mx-2">•</span>
                                <span>{doc.vendor || "Unknown Vendor"}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge
                              color={doc.status === "approved" ? "success" : doc.status === "needs_review" ? "warning" : "primary"}
                              variant="flat"
                              className="mr-4"
                            >
                              {doc.status.replace("_", " ")}
                            </Badge>
                            <span className="text-xs text-foreground-400 whitespace-nowrap">{doc.date}</span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Document Categories */}
          <div>
            <Card className="ambient-shadow mb-8">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Document Categories</h2>
                </div>

                <div className="space-y-5">
                  {documentCategories.map((category, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full bg-${category.color}-500 mr-2`}></div>
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm text-foreground-500">{category.count}</span>
                      </div>
                      <Progress
                        value={category.count}
                        maxValue={300}
                        color={category.color as any}
                        size="sm"
                        className="mb-1"
                      />
                    </div>
                  ))}
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
                    onPress={expandSearch}
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
                    onPress={() => navigateTo("vendor-management")}
                  >
                    Vendors
                  </Button>
                  <Button
                    variant="flat"
                    color="danger"
                    startContent={<Icon icon="lucide:receipt" className="h-4 w-4" />}
                    className="justify-start"
                    onPress={() => navigateTo("financial-dashboard")}
                  >
                    Finances
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