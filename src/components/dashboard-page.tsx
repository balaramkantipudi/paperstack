
import React from "react";
import { Button, Card, CardBody, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input, Badge, Progress } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useAuth, useUser, useClerk } from "@clerk/clerk-react";

import { documentService, Document, DocumentStats, CategoryStat, VendorStat } from "../services/document-service";

export const DashboardPage: React.FC<{ navigateTo: (view: string, data?: any) => void }> = ({ navigateTo }) => {
  const [selectedProject, setSelectedProject] = React.useState("All Projects");
  const [stats, setStats] = React.useState<DocumentStats | null>(null);
  const [recentDocuments, setRecentDocuments] = React.useState<Document[]>([]);
  const [categories, setCategories] = React.useState<CategoryStat[]>([]);
  const [topVendors, setTopVendors] = React.useState<VendorStat[]>([]);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { userId } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();

  const handleSeedData = async () => {
    if (!userId) return;
    setIsLoading(true);
    await documentService.seedData(userId);
    // Reload data
    window.location.reload();
  };

  React.useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [fetchedStats, fetchedDocs, fetchedCategories, fetchedVendors, fetchedNotifications] = await Promise.all([
          documentService.getStats(),
          documentService.getRecentDocuments(),
          documentService.getCategoryStats(),
          documentService.getTopVendors(),
          documentService.getNotifications()
        ]);
        setStats(fetchedStats);
        setRecentDocuments(fetchedDocs);
        setCategories(fetchedCategories);
        setTopVendors(fetchedVendors);
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();

    // Subscribe to Realtime Updates
    const subscription = documentService.subscribeToDocuments(() => {
      // Refresh data on any change
      loadDashboardData();
    });

    return () => {
      subscription.unsubscribe();
    };
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
      value: stats?.totalProcessed.toString() || "0",
      change: "+12%",
      icon: "lucide:file-check",
      color: "primary"
    },
    {
      title: "Time Saved",
      value: stats ? `${stats.timeSaved} h` : "0h",
      change: "+8%",
      icon: "lucide:clock",
      color: "secondary"
    },
    {
      title: "Awaiting Review",
      value: stats?.needsReview.toString() || "0",
      change: "-3",
      icon: "lucide:file-search",
      color: "default"
    },
    {
      title: "Tax Deductions",
      value: stats ? `$${(stats.totalValue / 1000).toFixed(1)} k` : "$0",
      change: "+$2.1k",
      icon: "lucide:receipt",
      color: "success"
    }
  ];

  const documentCategories = categories;

  // Format currency for display
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
            onClick={() => navigateTo("landing")}
          >
            <Icon
              icon="lucide:layers"
              className="text-primary h-7 w-7 mr-2"
            />
            <span className="font-gilroy font-bold text-xl">Paperstack</span>
          </div>

          <div className="flex items-center space-x-6">


            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  aria-label="Notifications"
                  className="relative"
                >
                  <Icon icon="lucide:bell" className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <Badge content={notifications.length} color="primary" size="sm" className="absolute -top-1 -right-1" />
                  )}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Notifications" className="w-80">
                <DropdownItem key="header" className="h-14 gap-2" textValue="Notifications">
                  <p className="font-semibold">Notifications</p>
                </DropdownItem>
                {notifications.length === 0 ? (
                  <DropdownItem key="empty" textValue="No notifications">
                    <p className="text-sm text-foreground-500">No new notifications</p>
                  </DropdownItem>
                ) : (
                  notifications.map((notif) => (
                    <DropdownItem key={notif.id} textValue={notif.title}>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-xs text-foreground-500">{notif.message}</p>
                        <p className="text-xs text-foreground-400">{notif.time}</p>
                      </div>
                    </DropdownItem>
                  ))
                )}
                <DropdownItem key="view-all" className="text-primary" textValue="View all" onPress={() => navigateTo("documents")}>
                  <p className="text-center text-sm">View all notifications</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  color="default"
                  startContent={<Icon icon="lucide:user" width={20} />}
                >
                  Account
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Account actions">
                <DropdownItem key="profile" startContent={<Icon icon="lucide:user" />} onClick={() => navigateTo("settings")}>
                  Profile & Settings
                </DropdownItem>
                <DropdownItem key="logout" className="text-danger" color="danger" startContent={<Icon icon="lucide:log-out" />} onPress={() => clerk.signOut()}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </header >

      {/* Main Content */}
      < main className="container mx-auto px-4 md:px-6 py-8" >
        {/* Dashboard Header */}
        < div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4" >
          <div>
            <h1 className="font-gilroy text-2xl md:text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-foreground-500">Welcome back, {user?.firstName || 'User'}. Here's what's happening today.</p>
          </div>

          <div className="flex items-center gap-4">
          </div>
        </div >

        {/* Project Filter */}
        < div className="flex justify-end mb-8" >
        </div >

        {/* Metrics Grid */}
        < div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" >
          {
            metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => {
                  if (metric.title === "Awaiting Review") {
                    navigateTo("documents", { status: 'needs_review' });
                  }
                }}
                className={metric.title === "Awaiting Review" ? "cursor-pointer" : ""}
              >
                <Card className="ambient-shadow">
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-foreground-500 mb-1">{metric.title}</p>
                        <h3 className="font-gilroy text-2xl font-bold">{metric.value}</h3>
                        <p className={`text - xs mt - 1 ${metric.change.includes('+') ? 'text-success-500' : 'text-danger-500'} `}>
                          {metric.change} from last month
                        </p>
                      </div>
                      <div className={`h - 10 w - 10 rounded - full bg - ${metric.color} -50 flex items - center justify - center`}>
                        <Icon icon={metric.icon} className={`h - 5 w - 5 text - ${metric.color} -500`} />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))
          }
        </div >

        {/* Quick Actions Bar */}
        < div className="mb-8" >
          <Card className="ambient-shadow">
            <CardBody className="p-4">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-gilroy text-lg font-bold mr-4">Quick Actions</h2>
                  <Button
                    className="bg-primary text-white"
                    startContent={<Icon icon="lucide:upload" className="h-4 w-4" />}
                    onPress={() => navigateTo("document-upload")}
                  >
                    Upload Document
                  </Button>
                  <Button
                    variant="flat"
                    color="success"
                    startContent={<Icon icon="lucide:file-plus" className="h-4 w-4" />}
                    onPress={() => navigateTo("projects")}
                  >
                    Projects
                  </Button>
                  <Button
                    variant="flat"
                    color="warning"
                    startContent={<Icon icon="lucide:users" className="h-4 w-4" />}
                    onPress={() => navigateTo("vendor-management")}
                  >
                    Vendors
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="light"
                    color="danger"
                    startContent={<Icon icon="lucide:bar-chart" className="h-4 w-4" />}
                    onPress={() => navigateTo("financial-dashboard")}
                  >
                    Financials
                  </Button>
                  <Button
                    variant="light"
                    color="default"
                    startContent={<Icon icon="lucide:settings" className="h-4 w-4" />}
                    onPress={() => navigateTo("settings")}
                  >
                    Settings
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div >

        {/* Main Content Grid */}
        < div className="grid grid-cols-1 lg:grid-cols-3 gap-8" >
          {/* Recent Activity */}
          < div className="lg:col-span-2" >
            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Recent Documents</h2>
                  <Button
                    variant="light"
                    color="primary"
                    endContent={<Icon icon="lucide:arrow-right" className="h-4 w-4" />}
                    onPress={() => navigateTo("documents")}
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
                                  doc.type === "Invoice" ? "lucide:file-text" :
                                    doc.type === "Receipt" ? "lucide:receipt" :
                                      doc.type === "Contract" ? "lucide:file-signature" :
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
          </div >

          {/* Right Sidebar */}
          < div className="space-y-8" >
            {/* Top Vendors */}
            < Card className="ambient-shadow" >
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Top Vendors</h2>
                  <Button
                    size="sm"
                    variant="light"
                    color="primary"
                    onPress={() => navigateTo("vendor-management")}
                  >
                    View All
                  </Button>
                </div>

                <div className="space-y-4">
                  {topVendors.map((vendor, index) => (
                    <div
                      key={index}
                      className="cursor-pointer hover:bg-foreground-50 p-2 rounded-lg transition-colors"
                      onClick={() => navigateTo("documents", { vendor: vendor.name })}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xs">
                            {vendor.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{vendor.name}</p>
                            <p className="text-xs text-foreground-500">{vendor.count} documents</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold">{formatCurrency(vendor.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card >

            {/* Document Categories */}
            < Card className="ambient-shadow" >
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Document Categories</h2>
                </div>

                <div className="space-y-5">
                  {documentCategories.map((category, index) => (
                    <div
                      key={index}
                      className="cursor-pointer hover:bg-foreground-50 p-2 rounded-lg transition-colors"
                      onClick={() => {
                        // Navigate to documents page with category filter
                        navigateTo("documents", { category: category.name });
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`h - 3 w - 3 rounded - full bg - ${category.color} -500 mr - 2`}></div>
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
            </Card >

          </div >
        </div >
      </main >
    </div >
  );
};