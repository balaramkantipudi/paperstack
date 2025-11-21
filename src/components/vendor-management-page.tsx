import React from "react";
import { 
  Button, Card, CardBody, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Badge,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Pagination
} from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const VendorManagementPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  const [page, setPage] = React.useState(1);
  
  const rowsPerPage = 5;
  
  const vendors = [
    { 
      id: 1,
      name: "BuildSupply Inc.", 
      category: "Materials Supplier",
      contact: "John Smith",
      email: "john@buildsupply.com",
      spent: 32450,
      invoices: 18,
      status: "Current"
    },
    { 
      id: 2,
      name: "Metro Concrete", 
      category: "Materials Supplier",
      contact: "Sarah Johnson",
      email: "sarah@metroconcrete.com",
      spent: 28750,
      invoices: 12,
      status: "Current"
    },
    { 
      id: 3,
      name: "City Electric Supply", 
      category: "Electrical Supplier",
      contact: "Mike Wilson",
      email: "mike@cityelectric.com",
      spent: 18650,
      invoices: 15,
      status: "Overdue"
    },
    { 
      id: 4,
      name: "ConstructEquip Rentals", 
      category: "Equipment Rental",
      contact: "Lisa Brown",
      email: "lisa@constructequip.com",
      spent: 15800,
      invoices: 8,
      status: "Current"
    },
    { 
      id: 5,
      name: "PlumbPro Services", 
      category: "Plumbing Contractor",
      contact: "David Miller",
      email: "david@plumbpro.com",
      spent: 12450,
      invoices: 6,
      status: "Current"
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
  
  const filteredVendors = vendors.filter(vendor => {
    // Filter by search query
    if (searchQuery && !vendor.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === "overdue" && vendor.status !== "Overdue") {
      return false;
    }
    
    return true;
  });
  
  const paginatedVendors = filteredVendors.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  
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
            <h1 className="font-gilroy text-2xl md:text-3xl font-bold mb-1">Vendor Management</h1>
            <p className="text-foreground-500">Manage your construction suppliers and contractors</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search vendors..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<Icon icon="lucide:search" className="h-4 w-4 text-foreground-400" />}
              className="w-full md:w-64"
            />
            
            <Button 
              color="primary"
              startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
            >
              Add Vendor
            </Button>
          </div>
        </div>
        
        <Card className="ambient-shadow mb-8">
          <CardBody className="p-6">
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
                    <span>All Vendors</span>
                  </div>
                }
              />
              <Tab 
                key="overdue" 
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:alert-circle" className="h-4 w-4" />
                    <span>Overdue</span>
                  </div>
                }
              />
            </Tabs>
            
            <div className="pt-4">
              <Table 
                aria-label="Vendors table"
                removeWrapper
                bottomContent={
                  <div className="flex w-full justify-center">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="primary"
                      page={page}
                      total={Math.ceil(filteredVendors.length / rowsPerPage)}
                      onChange={(page) => setPage(page)}
                    />
                  </div>
                }
              >
                <TableHeader>
                  <TableColumn>VENDOR</TableColumn>
                  <TableColumn>CATEGORY</TableColumn>
                  <TableColumn>CONTACT</TableColumn>
                  <TableColumn>SPENT</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No vendors found">
                  {paginatedVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-xs text-foreground-500">{vendor.invoices} invoices</div>
                      </TableCell>
                      <TableCell>{vendor.category}</TableCell>
                      <TableCell>
                        <div>{vendor.contact}</div>
                        <div className="text-xs text-foreground-500">{vendor.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatCurrency(vendor.spent)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          color={vendor.status === "Current" ? "success" : "danger"} 
                          variant="flat"
                        >
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                          >
                            <Icon icon="lucide:edit" className="h-4 w-4" />
                          </Button>
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            color="primary"
                          >
                            <Icon icon="lucide:file-text" className="h-4 w-4" />
                          </Button>
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            color="success"
                          >
                            <Icon icon="lucide:credit-card" className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <h2 className="font-gilroy text-lg font-bold mb-6">Common Construction Suppliers</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { category: "Concrete & Masonry", count: 5, icon: "lucide:package" },
                    { category: "Lumber & Building Materials", count: 8, icon: "lucide:ruler" },
                    { category: "Electrical", count: 3, icon: "lucide:zap" },
                    { category: "Plumbing", count: 4, icon: "lucide:droplet" }
                  ].map((category, index) => (
                    <div key={index} className="border border-foreground-200 rounded-lg p-4 flex items-center">
                      <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center mr-4">
                        <Icon icon={category.icon} className="h-6 w-6 text-primary-500" />
                      </div>
                      <div>
                        <p className="font-medium">{category.category}</p>
                        <p className="text-sm text-foreground-500">{category.count} vendors</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
          
          <div>
            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Quick Actions</h2>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    variant="flat" 
                    color="primary"
                    startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
                    className="w-full justify-start"
                  >
                    Add New Vendor
                  </Button>
                  <Button 
                    variant="flat" 
                    color="default"
                    startContent={<Icon icon="lucide:upload" className="h-4 w-4" />}
                    className="w-full justify-start"
                  >
                    Import Vendors
                  </Button>
                  <Button 
                    variant="flat" 
                    color="default"
                    startContent={<Icon icon="lucide:file-text" className="h-4 w-4" />}
                    className="w-full justify-start"
                  >
                    Vendor Spending Report
                  </Button>
                  <Button 
                    variant="flat" 
                    color="default"
                    startContent={<Icon icon="lucide:mail" className="h-4 w-4" />}
                    className="w-full justify-start"
                  >
                    Email All Vendors
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