import React from "react";
import {
  Button, Card, CardBody, Input, Switch, Tooltip, Divider, Tabs, Tab,
  Select, SelectItem, Badge, Checkbox, Progress, Dropdown, DropdownTrigger,
  DropdownMenu, DropdownItem, Table, TableHeader, TableColumn, TableBody,
  TableRow, TableCell, Pagination
} from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { useClerk } from "@clerk/clerk-react";

export const SettingsPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const clerk = useClerk();
  const [activeTab, setActiveTab] = React.useState("profile");

  // General Settings state
  const [language, setLanguage] = React.useState("en-US");
  const [dateFormat, setDateFormat] = React.useState("MM/DD/YYYY");
  const [currency, setCurrency] = React.useState("USD");
  const [taxRegion, setTaxRegion] = React.useState("US-CA"); // Default to California for now
  const [defaultProject, setDefaultProject] = React.useState("all");

  // Integrations state
  const [integrations, setIntegrations] = React.useState([
    { id: "quickbooks", name: "QuickBooks", connected: true, icon: "logos:quickbooks" },
    { id: "xero", name: "Xero", connected: false, icon: "logos:xero" },
    { id: "procore", name: "Procore", connected: true, icon: "logos:google-icon" },
    { id: "plangrid", name: "PlanGrid", connected: false, icon: "logos:microsoft-icon" },
    { id: "buildertrend", name: "Buildertrend", connected: false, icon: "logos:slack" }
  ]);

  // Document Templates state
  const [templates, setTemplates] = React.useState([
    { id: 1, name: "BuildSupply Inc. Invoice", type: "Invoice", lastUsed: "2 days ago" },
    { id: 2, name: "ConMaterials Receipt", type: "Receipt", lastUsed: "1 week ago" },
    { id: 3, name: "Subcontractor Agreement", type: "Contract", lastUsed: "2 weeks ago" },
    { id: 4, name: "City Permit Application", type: "Permit", lastUsed: "1 month ago" }
  ]);

  // Categories & Tax Rules state
  const [categories, setCategories] = React.useState([
    { id: 1, name: "Materials", taxDeductible: true, percentage: 100 },
    { id: 2, name: "Labor", taxDeductible: true, percentage: 100 },
    { id: 3, name: "Equipment Rental", taxDeductible: true, percentage: 100 },
    { id: 4, name: "Office Supplies", taxDeductible: true, percentage: 50 },
    { id: 5, name: "Meals & Entertainment", taxDeductible: true, percentage: 50 }
  ]);
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [newCategoryDeductible, setNewCategoryDeductible] = React.useState(true);
  const [newCategoryPercentage, setNewCategoryPercentage] = React.useState(100);

  // Profile state
  const [profileName, setProfileName] = React.useState("John Smith");
  const [profileEmail, setProfileEmail] = React.useState("john@example.com");
  const [profilePhone, setProfilePhone] = React.useState("+1 (555) 123-4567");

  // Notifications state
  const [emailNotifications, setEmailNotifications] = React.useState({
    documentProcessed: true,
    newTeamMember: true,
    weeklyReport: true,
    billingUpdates: true
  });
  const [inAppNotifications, setInAppNotifications] = React.useState({
    documentProcessed: true,
    newTeamMember: true,
    weeklyReport: false,
    billingUpdates: true
  });
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [marketingEmails, setMarketingEmails] = React.useState(false);
  const [alertThreshold, setAlertThreshold] = React.useState(5);

  // Security state
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);

  // Billing & Subscription state
  const [currentPlan, setCurrentPlan] = React.useState("Professional");
  const [billingCycle, setBillingCycle] = React.useState("monthly");
  const [paymentMethod, setPaymentMethod] = React.useState({
    type: "credit_card",
    last4: "4242",
    expiry: "05/25"
  });

  const plans = [
    {
      name: "Starter",
      price: billingCycle === "monthly" ? "$49" : "$470",
      description: "Perfect for small teams and simple projects",
      features: [
        "Process up to 100 documents/month",
        "Basic data extraction",
        "Email support",
        "1 user license"
      ],
      current: currentPlan === "Starter"
    },
    {
      name: "Professional",
      price: billingCycle === "monthly" ? "$149" : "$1,430",
      description: "For growing teams with advanced needs",
      features: [
        "Process up to 500 documents/month",
        "Advanced data extraction & insights",
        "Priority support",
        "5 user licenses",
        "API access"
      ],
      current: currentPlan === "Professional"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with complex requirements",
      features: [
        "Unlimited document processing",
        "Custom AI model training",
        "Dedicated account manager",
        "Unlimited users",
        "Advanced security features"
      ],
      current: currentPlan === "Enterprise"
    }
  ];

  const billingHistory = [
    { id: "INV-001", date: "Jul 1, 2023", amount: "$149.00", status: "Paid" },
    { id: "INV-002", date: "Jun 1, 2023", amount: "$149.00", status: "Paid" },
    { id: "INV-003", date: "May 1, 2023", amount: "$149.00", status: "Paid" },
    { id: "INV-004", date: "Apr 1, 2023", amount: "$149.00", status: "Paid" }
  ];

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id ? { ...integration, connected: !integration.connected } : integration
    ));
  };

  const addCategory = () => {
    if (newCategoryName) {
      const newCategory = {
        id: categories.length + 1,
        name: newCategoryName,
        taxDeductible: newCategoryDeductible,
        percentage: newCategoryPercentage
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setNewCategoryDeductible(true);
      setNewCategoryPercentage(100);
    }
  };

  const handleToggleEmailNotification = (key: keyof typeof emailNotifications) => {
    setEmailNotifications({
      ...emailNotifications,
      [key]: !emailNotifications[key]
    });
  };

  const handleToggleInAppNotification = (key: keyof typeof inAppNotifications) => {
    setInAppNotifications({
      ...inAppNotifications,
      [key]: !inAppNotifications[key]
    });
  };

  const renderSidebar = () => (
    <div className="w-64 bg-white border-r border-foreground-200 h-full fixed left-0 top-16 overflow-y-auto hidden md:block">
      <div className="p-4">
        <h2 className="font-gilroy text-lg font-bold mb-4">Settings</h2>
        <nav>
          <ul className="space-y-1">
            {[
              { id: "profile", label: "Account Settings", icon: "lucide:user" },
              { id: "localization", label: "Localization & Tax", icon: "lucide:globe" },
              { id: "integrations", label: "Integrations", icon: "lucide:plug" },
              { id: "billing", label: "Billing & Subscription", icon: "lucide:credit-card" }
            ].map((item) => (
              <li key={item.id}>
                <button
                  className={`w-full flex items-center px-3 py-2 rounded-md text-left transition-colors ${activeTab === item.id
                    ? "bg-primary-50 text-primary-600"
                    : "hover:bg-foreground-100"
                    }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon icon={item.icon} className="h-5 w-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );

  const renderMobileNav = () => (
    <div className="md:hidden p-4">
      <Select
        label="Settings Category"
        selectedKeys={[activeTab]}
        onChange={(e) => setActiveTab(e.target.value)}
        className="w-full"
      >
        <SelectItem key="profile" value="profile">Account Settings</SelectItem>
        <SelectItem key="integrations" value="integrations">Integrations</SelectItem>
        <SelectItem key="billing" value="billing">Billing & Subscription</SelectItem>
      </Select>
    </div>
  );

  const renderProfile = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div onClick={() => { console.log("Opening profile..."); clerk.openUserProfile(); }} className="cursor-pointer">
          <Card
            className="border border-foreground-200 hover:shadow-md transition-shadow"
          >
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Icon icon="lucide:user-cog" className="h-5 w-5 text-primary-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Manage Account</h4>
                  <p className="text-sm text-foreground-500">Update profile and settings</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>




        <div onClick={() => clerk.openUserProfile()} className="cursor-pointer">
          <Card
            className="border border-foreground-200 hover:shadow-md transition-shadow"
          >
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary-50 flex items-center justify-center">
                  <Icon icon="lucide:bell" className="h-5 w-5 text-secondary-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Notifications</h4>
                  <p className="text-sm text-foreground-500">Configure email and push notifications</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </motion.div >

  );

  const renderDocumentTemplates = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="ambient-shadow mb-8">
        <CardBody className="p-6">
          <h2 className="font-gilroy text-xl font-bold mb-6">Document Templates</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-dmsans font-semibold mb-4">Saved Templates</h3>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-foreground-200 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-primary-50 flex items-center justify-center mr-4">
                        <Icon
                          icon={
                            template.type === "Invoice" ? "lucide:file-text" :
                              template.type === "Receipt" ? "lucide:receipt" :
                                template.type === "Contract" ? "lucide:file-signature" :
                                  template.type === "Permit" ? "lucide:scale" :
                                    "lucide:file-plus"
                          }
                          className="h-5 w-5 text-primary-500"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <div className="flex items-center text-xs text-foreground-500">
                          <span>{template.type}</span>
                          <span className="mx-2">•</span>
                          <span>Last used {template.lastUsed}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="flat"
                        color="primary"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        color="danger"
                      >
                        <Icon icon="lucide:trash-2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
                >
                  Create New Template
                </Button>
              </div>
            </div>

            <Divider />

            <div>
              <h3 className="font-dmsans font-semibold mb-4">Automatic Categorization Rules</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Use AI for automatic categorization</p>
                    <p className="text-sm text-foreground-500">
                      Use machine learning to categorize documents automatically
                    </p>
                  </div>
                  <Switch defaultSelected color="primary" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Confidence threshold</p>
                    <p className="text-sm text-foreground-500">
                      Minimum confidence level for automatic categorization
                    </p>
                  </div>
                  <Select
                    defaultSelectedKeys={["80"]}
                    className="max-w-[150px]"
                  >
                    <SelectItem key="70" value="70">70%</SelectItem>
                    <SelectItem key="80" value="80">80%</SelectItem>
                    <SelectItem key="90" value="90">90%</SelectItem>
                    <SelectItem key="95" value="95">95%</SelectItem>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require manual review for low confidence</p>
                    <p className="text-sm text-foreground-500">
                      Flag documents with low confidence for manual review
                    </p>
                  </div>
                  <Switch defaultSelected color="primary" />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );

  const renderLocalization = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="ambient-shadow mb-8">
        <CardBody className="p-6">
          <h2 className="font-gilroy text-xl font-bold mb-6">Localization & Tax Region</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-2">
                  Currency
                </label>
                <Select
                  selectedKeys={[currency]}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full"
                >
                  <SelectItem key="USD" value="USD">USD ($)</SelectItem>
                  <SelectItem key="EUR" value="EUR">EUR (€)</SelectItem>
                  <SelectItem key="GBP" value="GBP">GBP (£)</SelectItem>
                  <SelectItem key="CAD" value="CAD">CAD ($)</SelectItem>
                  <SelectItem key="AUD" value="AUD">AUD ($)</SelectItem>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-2">
                  Language
                </label>
                <Select
                  selectedKeys={[language]}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full"
                >
                  <SelectItem key="en-US" value="en-US">English (US)</SelectItem>
                  <SelectItem key="es-ES" value="es-ES">Spanish</SelectItem>
                  <SelectItem key="fr-FR" value="fr-FR">French</SelectItem>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-2">
                  Tax Region (State/Country)
                </label>
                <Select
                  selectedKeys={[taxRegion]}
                  onChange={(e) => setTaxRegion(e.target.value)}
                  className="w-full"
                  description="AI uses this to identify specific tax rules."
                >
                  <SelectItem key="US-CA" value="US-CA">United States - California</SelectItem>
                  <SelectItem key="US-TX" value="US-TX">United States - Texas</SelectItem>
                  <SelectItem key="US-NY" value="US-NY">United States - New York</SelectItem>
                  <SelectItem key="CA-ON" value="CA-ON">Canada - Ontario</SelectItem>
                  <SelectItem key="UK" value="UK">United Kingdom</SelectItem>
                </Select>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );

  const renderNotifications = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="ambient-shadow mb-8">
        <CardBody className="p-6">
          <h2 className="font-gilroy text-xl font-bold mb-6">Notification Preferences</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-foreground-500">Receive emails about document updates</p>
              </div>
              <Switch isSelected={emailNotifications} onValueChange={setEmailNotifications} color="primary" />
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-foreground-500">Receive push notifications on your device</p>
              </div>
              <Switch isSelected={pushNotifications} onValueChange={setPushNotifications} color="primary" />
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-foreground-500">Receive emails about new features and offers</p>
              </div>
              <Switch isSelected={marketingEmails} onValueChange={setMarketingEmails} color="primary" />
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );

  const renderSecurity = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="ambient-shadow mb-8">
        <CardBody className="p-6">
          <h2 className="font-gilroy text-xl font-bold mb-6">Security Settings</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-dmsans font-semibold mb-4">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <Input
                  type="password"
                  label="Current Password"
                  value={currentPassword}
                  onValueChange={setCurrentPassword}
                />
                <Input
                  type="password"
                  label="New Password"
                  value={newPassword}
                  onValueChange={setNewPassword}
                />
                <Input
                  type="password"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onValueChange={setConfirmPassword}
                />
                <Button color="primary">Update Password</Button>
              </div>
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-dmsans font-semibold">Two-Factor Authentication</h3>
                <p className="text-sm text-foreground-500">Add an extra layer of security to your account</p>
              </div>
              <Switch isSelected={twoFactorEnabled} onValueChange={setTwoFactorEnabled} color="primary" />
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );

  const renderIntegrations = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="ambient-shadow mb-8">
        <CardBody className="p-6">
          <h2 className="font-gilroy text-xl font-bold mb-6">Integrations</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-dmsans font-semibold mb-4">Accounting Software</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrations.slice(0, 2).map((integration) => (
                  <div
                    key={integration.id}
                    className="border border-foreground-200 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex items-center justify-center mr-4">
                        <Icon icon={integration.icon} className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-foreground-500">
                          {integration.connected ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <Button
                      color={integration.connected ? "danger" : "primary"}
                      variant={integration.connected ? "flat" : "solid"}
                      onPress={() => toggleIntegration(integration.id)}
                    >
                      {integration.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            <div>
              <h3 className="font-dmsans font-semibold mb-4">Project Management Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrations.slice(2).map((integration) => (
                  <div
                    key={integration.id}
                    className="border border-foreground-200 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex items-center justify-center mr-4">
                        <Icon icon={integration.icon} className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-foreground-500">
                          {integration.connected ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <Button
                      color={integration.connected ? "danger" : "primary"}
                      variant={integration.connected ? "flat" : "solid"}
                      onPress={() => toggleIntegration(integration.id)}
                    >
                      {integration.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            <div>
              <h3 className="font-dmsans font-semibold mb-4">Data Sync Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-sync with accounting software</p>
                    <p className="text-sm text-foreground-500">
                      Automatically sync processed documents with connected accounting software
                    </p>
                  </div>
                  <Switch defaultSelected color="primary" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sync frequency</p>
                    <p className="text-sm text-foreground-500">
                      How often to sync data with connected services
                    </p>
                  </div>
                  <Select
                    defaultSelectedKeys={["daily"]}
                    className="max-w-[150px]"
                  >
                    <SelectItem key="realtime" value="realtime">Real-time</SelectItem>
                    <SelectItem key="hourly" value="hourly">Hourly</SelectItem>
                    <SelectItem key="daily" value="daily">Daily</SelectItem>
                    <SelectItem key="weekly" value="weekly">Weekly</SelectItem>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );

  const renderCategoriesAndTaxRules = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="ambient-shadow mb-8">
        <CardBody className="p-6">
          <h2 className="font-gilroy text-xl font-bold mb-6">Categories & Tax Rules</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-dmsans font-semibold mb-4">Expense Categories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-foreground-200 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-primary-50 flex items-center justify-center mr-4">
                        <Icon icon="lucide:tag" className="h-5 w-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <div className="flex items-center text-xs">
                          {category.taxDeductible ? (
                            <span className="text-success-600 flex items-center">
                              <Icon icon="lucide:check" className="h-3 w-3 mr-1" />
                              Tax Deductible ({category.percentage}%)
                            </span>
                          ) : (
                            <span className="text-danger-600 flex items-center">
                              <Icon icon="lucide:x" className="h-3 w-3 mr-1" />
                              Not Tax Deductible
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="flat"
                        color="primary"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        color="danger"
                      >
                        <Icon icon="lucide:trash-2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            <div>
              <h3 className="font-dmsans font-semibold mb-4">Create New Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-2">
                    Category Name
                  </label>
                  <Input
                    value={newCategoryName}
                    onValueChange={setNewCategoryName}
                    placeholder="Enter category name"
                    className="w-full"
                  />
                </div>

                <div className="flex items-end">
                  <div className="flex items-center h-[40px]">
                    <Checkbox
                      isSelected={newCategoryDeductible}
                      onValueChange={setNewCategoryDeductible}
                      color="primary"
                    >
                      Tax Deductible
                    </Checkbox>
                  </div>
                </div>

                {newCategoryDeductible && (
                  <div>
                    <label className="block text-sm font-medium text-foreground-700 mb-2">
                      Deductible Percentage
                    </label>
                    <Select
                      value={String(newCategoryPercentage)}
                      onChange={(e) => setNewCategoryPercentage(Number(e.target.value))}
                      className="w-full"
                    >
                      <SelectItem key="100" value="100">100%</SelectItem>
                      <SelectItem key="75" value="75">75%</SelectItem>
                      <SelectItem key="50" value="50">50%</SelectItem>
                      <SelectItem key="25" value="25">25%</SelectItem>
                    </Select>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Button
                  color="primary"
                  startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
                  onPress={addCategory}
                >
                  Add Category
                </Button>
              </div>
            </div>

            <Divider />

            <div>
              <h3 className="font-dmsans font-semibold mb-4">Construction-Specific Tax Rules</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable construction-specific tax rules</p>
                    <p className="text-sm text-foreground-500">
                      Apply industry-specific tax rules for construction expenses
                    </p>
                  </div>
                  <Switch defaultSelected color="primary" />
                </div>

                <div className="border border-foreground-200 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Common Construction Deductions</h4>
                  <div className="space-y-2">
                    {[
                      "Equipment purchases (Section 179)",
                      "Vehicle expenses (mileage or actual)",
                      "Home office deduction",
                      "Insurance premiums",
                      "Contract labor"
                    ].map((rule, index) => (
                      <div key={index} className="flex items-center">
                        <Checkbox defaultSelected color="primary" className="mr-2" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-foreground-200 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Meals & Entertainment</h4>
                  <p className="text-sm text-foreground-500 mb-3">
                    Construction industry standard for meals & entertainment deductions
                  </p>
                  <Select
                    defaultSelectedKeys={["50"]}
                    className="w-full"
                  >
                    <SelectItem key="50" value="50">50% deductible (standard)</SelectItem>
                    <SelectItem key="100" value="100">100% deductible (special circumstances)</SelectItem>
                    <SelectItem key="0" value="0">Not deductible</SelectItem>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );

  const handleUpgrade = (planName: string) => {
    // Mock Stripe checkout
    const confirm = window.confirm(`Proceed to mock checkout for ${planName} plan?`);
    if (confirm) {
      alert("Payment successful! Your plan has been upgraded.");
      setCurrentPlan(planName);
    }
  };

  const renderBillingAndSubscription = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="ambient-shadow mb-8">
        <CardBody className="p-6">
          <h2 className="font-gilroy text-xl font-bold mb-6">Billing & Subscription</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-dmsans font-semibold mb-4">Current Plan</h3>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-lg">{currentPlan} Plan</span>
                    <Badge color="primary" variant="flat" className="ml-2">Current</Badge>
                  </div>
                  <div className="text-xl font-bold">
                    {plans.find(p => p.name === currentPlan)?.price}
                    <span className="text-sm font-normal text-foreground-500 ml-1">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-foreground-500 mb-4">
                  {plans.find(p => p.name === currentPlan)?.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Billing cycle:</span>
                    <Select
                      value={billingCycle}
                      onChange={(e) => setBillingCycle(e.target.value)}
                      size="sm"
                      className="w-32"
                    >
                      <SelectItem key="monthly" value="monthly">Monthly</SelectItem>
                      <SelectItem key="yearly" value="yearly">Yearly</SelectItem>
                    </Select>
                  </div>
                  <Button
                    variant="flat"
                    color="primary"
                    size="sm"
                    onPress={() => handleUpgrade("Enterprise")}
                  >
                    Manage Subscription
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="border border-foreground-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Documents Processed</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground-500">248 / 500</span>
                    <span className="text-sm text-foreground-500">49.6%</span>
                  </div>
                  <Progress value={49.6} color="primary" className="mb-2" />
                  <p className="text-xs text-foreground-400">Resets on Aug 1, 2023</p>
                </div>

                <div className="border border-foreground-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Storage Used</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground-500">2.4 GB / 10 GB</span>
                    <span className="text-sm text-foreground-500">24%</span>
                  </div>
                  <Progress value={24} color="primary" className="mb-2" />
                  <p className="text-xs text-foreground-400">Unlimited storage available on Enterprise plan</p>
                </div>
              </div>

              <div>
                <h3 className="font-dmsans font-semibold mb-4">Payment Method</h3>
                <div className="flex items-center justify-between border border-foreground-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="h-10 w-16 bg-foreground-100 rounded flex items-center justify-center mr-4">
                      <Icon icon="logos:mastercard" className="h-6" />
                    </div>
                    <div>
                      <p className="font-medium">Mastercard ending in {paymentMethod.last4}</p>
                      <p className="text-sm text-foreground-500">Expires {paymentMethod.expiry}</p>
                    </div>
                  </div>
                  <Button variant="light" color="primary">
                    Edit
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-dmsans font-semibold mb-4">Billing History</h3>
                <div className="border border-foreground-200 rounded-lg overflow-hidden">
                  <Table aria-label="Billing history">
                    <TableHeader>
                      <TableColumn>INVOICE</TableColumn>
                      <TableColumn>DATE</TableColumn>
                      <TableColumn>AMOUNT</TableColumn>
                      <TableColumn>STATUS</TableColumn>
                      <TableColumn>ACTION</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell>INV-2023-001</TableCell>
                        <TableCell>Jul 1, 2023</TableCell>
                        <TableCell>$49.00</TableCell>
                        <TableCell>
                          <Badge color="success" variant="flat">Paid</Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="light" isIconOnly>
                            <Icon icon="lucide:download" className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>INV-2023-002</TableCell>
                        <TableCell>Jun 1, 2023</TableCell>
                        <TableCell>$49.00</TableCell>
                        <TableCell>
                          <Badge color="success" variant="flat">Paid</Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="light" isIconOnly>
                            <Icon icon="lucide:download" className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div >
  );
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-foreground-200 py-4 fixed top-0 left-0 right-0 z-10">
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

      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content */}
      <main className="pt-16 md:pl-64">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="font-gilroy text-2xl md:text-3xl font-bold mb-1">Settings</h1>
              <p className="text-foreground-500">Configure your Paperstack experience</p>
            </div>
          </div>

          {renderMobileNav()}

          {activeTab === "profile" && renderProfile()}
          {activeTab === "integrations" && renderIntegrations()}
          {activeTab === "billing" && renderBillingAndSubscription()}
        </div>
      </main>
    </div>
  );
};