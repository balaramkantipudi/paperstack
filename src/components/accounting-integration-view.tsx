import React from "react";
import { Button, Card, CardBody, Input, Badge, Switch, Select, SelectItem, Tooltip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { integrationService, Integration } from "../services/integration-service";

export const AccountingIntegrationView: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [activeTab, setActiveTab] = React.useState("quickbooks");
  const [autoSync, setAutoSync] = React.useState(true);
  const [syncFrequency, setSyncFrequency] = React.useState("daily");
  const [integrations, setIntegrations] = React.useState<Integration[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSyncing, setIsSyncing] = React.useState(false);

  React.useEffect(() => {
    const loadIntegrations = async () => {
      setIsLoading(true);
      try {
        const data = await integrationService.getIntegrations();
        setIntegrations(data);
      } catch (error) {
        console.error("Failed to load integrations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadIntegrations();
  }, []);

  const handleToggleConnection = async (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    try {
      if (integration.status === "connected") {
        await integrationService.disconnectIntegration(id);
      } else {
        await integrationService.connectIntegration(id);
      }

      // Refresh list
      const updated = await integrationService.getIntegrations();
      setIntegrations(updated);
    } catch (error) {
      console.error("Failed to toggle connection:", error);
    }
  };

  const handleSync = async () => {
    if (!currentIntegration) return;

    setIsSyncing(true);
    try {
      await integrationService.syncNow(currentIntegration.id);
      // Refresh list to update last sync time
      const updated = await integrationService.getIntegrations();
      setIntegrations(updated);
      alert("Sync completed successfully!");
    } catch (error) {
      console.error("Sync failed:", error);
      alert("Sync failed. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const accountMappings = [
    {
      paperstack: "Materials",
      accounting: "6000 - Construction Materials",
      status: "mapped"
    },
    {
      paperstack: "Labor",
      accounting: "6100 - Labor Expenses",
      status: "mapped"
    },
    {
      paperstack: "Equipment Rental",
      accounting: "6200 - Equipment Rental",
      status: "mapped"
    },
    {
      paperstack: "Permits & Fees",
      accounting: "6300 - Permits and Regulatory Fees",
      status: "mapped"
    },
    {
      paperstack: "Office/Administrative",
      accounting: "6400 - Office Expenses",
      status: "mapped"
    },
    {
      paperstack: "Subcontractors",
      accounting: "Not mapped",
      status: "unmapped"
    }
  ];

  const syncHistory = [
    {
      id: 1,
      date: "Jul 15, 2023 10:45 AM",
      documents: 5,
      status: "success",
      message: "All documents synced successfully"
    },
    {
      id: 2,
      date: "Jul 14, 2023 10:45 AM",
      documents: 3,
      status: "success",
      message: "All documents synced successfully"
    },
    {
      id: 3,
      date: "Jul 13, 2023 10:45 AM",
      documents: 8,
      status: "partial",
      message: "7 documents synced, 1 with errors"
    },
    {
      id: 4,
      date: "Jul 12, 2023 10:45 AM",
      documents: 4,
      status: "failed",
      message: "Connection error with QuickBooks API"
    }
  ];

  const syncErrors = [
    {
      id: 1,
      document: "Invoice #2432",
      date: "Jul 13, 2023",
      error: "Vendor not found in QuickBooks",
      status: "unresolved"
    }
  ];

  const currentIntegration = integrations.find(integration => integration.id === activeTab);

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
              <span className="text-foreground-500">Settings:</span>
              <span className="font-medium ml-2">Accounting Integrations</span>
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
            <h1 className="font-gilroy text-2xl md:text-3xl font-bold mb-1">Accounting Integrations</h1>
            <p className="text-foreground-500">Connect your accounting software to sync documents automatically</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Integration Selector */}
          <div>
            <Card className="ambient-shadow mb-8">
              <CardBody className="p-6">
                <h2 className="font-gilroy text-lg font-bold mb-6">Available Integrations</h2>

                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${activeTab === integration.id
                        ? 'bg-primary-50 border border-primary-200'
                        : 'hover:bg-foreground-50 border border-foreground-200'
                        }`}
                      onClick={() => setActiveTab(integration.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex items-center justify-center mr-3">
                            <Icon icon={integration.icon} className="h-8 w-8" />
                          </div>
                          <div>
                            <p className="font-medium">{integration.name}</p>
                            <div className="flex items-center text-xs">
                              {integration.status === "connected" ? (
                                <span className="text-success-600 flex items-center">
                                  <Icon icon="lucide:check" className="h-3 w-3 mr-1" />
                                  Connected
                                </span>
                              ) : (
                                <span className="text-foreground-500 flex items-center">
                                  <Icon icon="lucide:x" className="h-3 w-3 mr-1" />
                                  Not Connected
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Icon
                          icon="lucide:chevron-right"
                          className={`h-5 w-5 ${activeTab === integration.id ? 'text-primary-500' : 'text-foreground-300'}`}
                        />
                        <Button
                          color={integration.status === "connected" ? "danger" : "primary"}
                          variant={integration.status === "connected" ? "flat" : "solid"}
                          onPress={() => handleToggleConnection(integration.id)}
                        >
                          {integration.status === "connected" ? "Disconnect" : "Connect"}
                        </Button>
                      </div>

                      {integration.status === "connected" && (
                        <div className="text-xs text-foreground-500">
                          Last sync: {integration.lastSync}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <h2 className="font-gilroy text-lg font-bold mb-6">Sync Settings</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-sync documents</p>
                      <p className="text-sm text-foreground-500">
                        Automatically sync processed documents
                      </p>
                    </div>
                    <Switch
                      isSelected={autoSync}
                      onValueChange={setAutoSync}
                      color="primary"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sync frequency</p>
                      <p className="text-sm text-foreground-500">
                        How often to sync data with accounting software
                      </p>
                    </div>
                    <Select
                      value={syncFrequency}
                      onChange={(e) => setSyncFrequency(e.target.value)}
                      className="w-32"
                      isDisabled={!autoSync}
                    >
                      <SelectItem key="realtime" value="realtime">Real-time</SelectItem>
                      <SelectItem key="hourly" value="hourly">Hourly</SelectItem>
                      <SelectItem key="daily" value="daily">Daily</SelectItem>
                      <SelectItem key="weekly" value="weekly">Weekly</SelectItem>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sync direction</p>
                      <p className="text-sm text-foreground-500">
                        Which way data should flow
                      </p>
                    </div>
                    <Select
                      defaultSelectedKeys={["one-way"]}
                      className="w-32"
                    >
                      <SelectItem key="one-way" value="one-way">One-way</SelectItem>
                      <SelectItem key="two-way" value="two-way">Two-way</SelectItem>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <Button
                      color="primary"
                      className="w-full"
                      startContent={<Icon icon="lucide:refresh-cw" className="h-4 w-4" />}
                      isDisabled={currentIntegration?.status !== "connected"}
                    >
                      Sync Now
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Integration Details */}
          <div className="lg:col-span-2">
            {currentIntegration?.status === "connected" ? (
              <>
                <Card className="ambient-shadow mb-8">
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex items-center justify-center mr-4">
                          <Icon icon={currentIntegration.icon} className="h-10 w-10" />
                        </div>
                        <div>
                          <h2 className="font-gilroy text-xl font-bold">{currentIntegration.name}</h2>
                          <div className="flex items-center text-sm">
                            <span className="text-success-600 flex items-center">
                              <Icon icon="lucide:check" className="h-4 w-4 mr-1" />
                              Connected
                            </span>
                            <span className="mx-2">•</span>
                            <span className="text-foreground-500">Last sync: {currentIntegration.lastSync}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="flat"
                        color="danger"
                        startContent={<Icon icon="lucide:log-out" className="h-4 w-4" />}
                      >
                        Disconnect
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground-500 mb-1">
                          Company
                        </label>
                        <p className="font-medium">{currentIntegration.company}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground-500 mb-1">
                          Connected User
                        </label>
                        <p className="font-medium">{currentIntegration.user}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className="ambient-shadow mb-8">
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-gilroy text-lg font-bold">Account Mapping</h2>
                      <Button
                        variant="flat"
                        color="primary"
                        size="sm"
                        startContent={<Icon icon="lucide:edit" className="h-4 w-4" />}
                      >
                        Edit Mapping
                      </Button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-foreground-200">
                            <th className="py-3 px-4 text-left font-medium text-foreground-500 text-sm">PAPERSTACK CATEGORY</th>
                            <th className="py-3 px-4 text-left font-medium text-foreground-500 text-sm">QUICKBOOKS ACCOUNT</th>
                            <th className="py-3 px-4 text-left font-medium text-foreground-500 text-sm">STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {accountMappings.map((mapping, index) => (
                            <tr key={index} className="border-b border-foreground-100">
                              <td className="py-3 px-4">{mapping.paperstack}</td>
                              <td className="py-3 px-4">{mapping.accounting}</td>
                              <td className="py-3 px-4">
                                {mapping.status === "mapped" ? (
                                  <Badge color="success" variant="flat">Mapped</Badge>
                                ) : (
                                  <Badge color="warning" variant="flat">Not Mapped</Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>

                <Card className="ambient-shadow mb-8">
                  <CardBody className="p-6">
                    <h2 className="font-gilroy text-lg font-bold mb-6">Sync History</h2>

                    <div className="space-y-4">
                      {syncHistory.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 border rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              {item.status === "success" && (
                                <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center mr-3">
                                  <Icon icon="lucide:check" className="h-4 w-4 text-success-500" />
                                </div>
                              )}
                              {item.status === "partial" && (
                                <div className="h-8 w-8 rounded-full bg-warning-100 flex items-center justify-center mr-3">
                                  <Icon icon="lucide:alert-triangle" className="h-4 w-4 text-warning-500" />
                                </div>
                              )}
                              {item.status === "failed" && (
                                <div className="h-8 w-8 rounded-full bg-danger-100 flex items-center justify-center mr-3">
                                  <Icon icon="lucide:x" className="h-4 w-4 text-danger-500" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{item.date}</p>
                                <p className="text-xs text-foreground-500">{item.documents} documents</p>
                              </div>
                            </div>
                            <Badge
                              color={
                                item.status === "success" ? "success" :
                                  item.status === "partial" ? "warning" : "danger"
                              }
                              variant="flat"
                            >
                              {item.status === "success" ? "Success" :
                                item.status === "partial" ? "Partial" : "Failed"}
                            </Badge>
                          </div>

                          <p className="text-sm text-foreground-600">{item.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {syncErrors.length > 0 && (
                  <Card className="ambient-shadow">
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-gilroy text-lg font-bold">Sync Errors</h2>
                        <Badge color="danger" variant="flat">{syncErrors.length} Unresolved</Badge>
                      </div>

                      <div className="space-y-4">
                        {syncErrors.map((error) => (
                          <div
                            key={error.id}
                            className="p-4 border border-danger-200 bg-danger-50 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-danger-100 flex items-center justify-center mr-3">
                                  <Icon icon="lucide:alert-circle" className="h-4 w-4 text-danger-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{error.document}</p>
                                  <p className="text-xs text-foreground-500">{error.date}</p>
                                </div>
                              </div>
                              <Button
                                variant="flat"
                                color="danger"
                                size="sm"
                              >
                                Resolve
                              </Button>
                            </div>

                            <p className="text-sm text-danger-600">{error.error}</p>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                )}
              </>
            ) : (
              <Card className="ambient-shadow">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex items-center justify-center mr-4">
                        <Icon icon={currentIntegration?.icon} className="h-10 w-10" />
                      </div>
                      <div>
                        <h2 className="font-gilroy text-xl font-bold">{currentIntegration?.name}</h2>
                        <div className="flex items-center text-sm">
                          <span className="text-foreground-500 flex items-center">
                            <Icon icon="lucide:x" className="h-4 w-4 mr-1" />
                            Not Connected
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="font-gilroy text-xl font-bold mb-2">Connect to {currentIntegration?.name}</h2>
                    <p className="text-foreground-500 mb-6">
                      Connect your {currentIntegration?.name} account to automatically sync your documents and streamline your accounting workflow.
                    </p>
                    <Button
                      color="primary"
                      startContent={<Icon icon="lucide:link" className="h-4 w-4" />}
                      onPress={() => currentIntegration && handleToggleConnection(currentIntegration.id)}
                    >
                      Connect {currentIntegration?.name}
                    </Button>
                  </div>

                  <div className="bg-foreground-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Benefits of Connecting</h4>
                    <ul className="space-y-2 text-sm text-foreground-600">
                      <li className="flex items-start">
                        <Icon icon="lucide:check" className="h-4 w-4 text-success-500 mr-2 mt-0.5" />
                        <span>Automatically sync processed documents to your accounting software</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="lucide:check" className="h-4 w-4 text-success-500 mr-2 mt-0.5" />
                        <span>Eliminate manual data entry and reduce errors</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="lucide:check" className="h-4 w-4 text-success-500 mr-2 mt-0.5" />
                        <span>Keep your financial records up-to-date and accurate</span>
                      </li>
                      <li className="flex items-start">
                        <Icon icon="lucide:check" className="h-4 w-4 text-success-500 mr-2 mt-0.5" />
                        <span>Map construction-specific categories to your chart of accounts</span>
                      </li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};