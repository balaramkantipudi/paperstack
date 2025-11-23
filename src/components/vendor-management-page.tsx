import React from "react";
import { Button, Card, CardBody, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Badge, Pagination, Tabs, Tab, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const VendorManagementPage: React.FC<{ navigateTo: (view: string, data?: any) => void }> = ({ navigateTo }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  const [page, setPage] = React.useState(1);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const rowsPerPage = 10;

  const [vendors, setVendors] = React.useState([
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
  ]);

  const [newVendor, setNewVendor] = React.useState({
    name: "",
    category: "",
    contact: "",
    email: ""
  });

  const handleAddVendor = () => {
    if (!newVendor.name || !newVendor.category) return;

    const vendor = {
      id: vendors.length + 1,
      ...newVendor,
      spent: 0,
      invoices: 0,
      status: "Current"
    };

    setVendors([...vendors, vendor]);
    setNewVendor({ name: "", category: "", contact: "", email: "" });
    // Close modal logic is handled by the Modal component's onOpenChange, 
    // but we need to trigger it. Since we don't have direct control over isOpen here 
    // without passing it, we'll rely on the button press which also needs to close it.
    // Actually, we can just pass a close function to the button.
  };

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
              onPress={onOpen}
            >
              Add Vendor
            </Button>

            <Button
              variant="flat"
              color="default"
              startContent={<Icon icon="lucide:mail" className="h-4 w-4" />}
              onPress={() => {
                alert('Email functionality coming soon!');
              }}
            >
              Email All Vendors
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
                  <TableColumn>INVOICES</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No vendors found">
                  {paginatedVendors.map((vendor) => (
                    <TableRow key={vendor.id} className="cursor-pointer hover:bg-foreground-50" onClick={() => navigateTo("documents", { vendor: vendor.name })}>
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell>{vendor.category}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{vendor.contact}</p>
                          <p className="text-xs text-foreground-500">{vendor.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(vendor.spent)}</TableCell>
                      <TableCell>{vendor.invoices}</TableCell>
                      <TableCell>
                        <Chip
                          color={vendor.status === "Current" ? "success" : "danger"}
                          variant="flat"
                          size="sm"
                        >
                          {vendor.status}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            onPress={(e) => {
                              e.stopPropagation(); // Prevent row click
                              // Edit logic
                            }}
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


      </main>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add New Vendor</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Vendor Name"
                  placeholder="Enter vendor name"
                  variant="bordered"
                  value={newVendor.name}
                  onValueChange={(val) => setNewVendor({ ...newVendor, name: val })}
                />
                <Input
                  label="Category"
                  placeholder="e.g. Materials, Labor"
                  variant="bordered"
                  value={newVendor.category}
                  onValueChange={(val) => setNewVendor({ ...newVendor, category: val })}
                />
                <Input
                  label="Contact Person"
                  placeholder="Enter contact name"
                  variant="bordered"
                  value={newVendor.contact}
                  onValueChange={(val) => setNewVendor({ ...newVendor, contact: val })}
                />
                <Input
                  label="Email"
                  placeholder="Enter email address"
                  variant="bordered"
                  value={newVendor.email}
                  onValueChange={(val) => setNewVendor({ ...newVendor, email: val })}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() => {
                  handleAddVendor();
                  onClose();
                }}>
                  Add Vendor
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};