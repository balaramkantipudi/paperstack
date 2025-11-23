import React from "react";
import { Button, Card, CardBody, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip, Badge, Tabs, Tab } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const DocumentsPage: React.FC<{ navigateTo: (view: string, data?: any) => void; initialCategory?: string; initialVendor?: string }> = ({ navigateTo, initialCategory, initialVendor }) => {
    const [selectedCategory, setSelectedCategory] = React.useState(initialCategory || "all");
    const [selectedVendor, setSelectedVendor] = React.useState(initialVendor || "all");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortBy, setSortBy] = React.useState("date_desc");

    const documents = [
        { id: 1, name: "BuildSupply Inc. Invoice", category: "Invoices", vendor: "BuildSupply Inc.", amount: 2450.00, date: "2024-01-15", status: "Processed", project: "Downtown Office Tower" },
        { id: 2, name: "Hardware Store Receipt", category: "Receipts", vendor: "Hardware Store", amount: 156.75, date: "2024-01-14", status: "Processed", project: "Westside Residential" },
        { id: 3, name: "Subcontractor Agreement", category: "Contracts", vendor: "ABC Contractors", amount: 15000.00, date: "2024-01-13", status: "Review", project: "Harbor Bridge" },
        { id: 4, name: "City Building Permit", category: "Permits", vendor: "City Hall", amount: 850.00, date: "2024-01-12", status: "Processed", project: "Downtown Office Tower" },
        { id: 5, name: "Material Change Order", category: "Change Orders", vendor: "BuildSupply Inc.", amount: 3200.00, date: "2024-01-11", status: "Processed", project: "City Center Mall" },
        { id: 6, name: "Equipment Rental Invoice", category: "Invoices", vendor: "Equipment Rentals Co.", amount: 1200.00, date: "2024-01-10", status: "Processed", project: "Westside Residential" },
        { id: 7, name: "Lumber Receipt", category: "Receipts", vendor: "Lumber Yard", amount: 4500.00, date: "2024-01-09", status: "Processed", project: "Harbor Bridge" },
        { id: 8, name: "Insurance Certificate", category: "Contracts", vendor: "Insurance Co.", amount: 2400.00, date: "2024-01-08", status: "Processed", project: "Downtown Office Tower" },
    ];

    const categories = [
        { id: "all", name: "All Documents", count: documents.length, color: "default" },
        { id: "Invoices", name: "Invoices", count: documents.filter(d => d.category === "Invoices").length, color: "primary" },
        { id: "Receipts", name: "Receipts", count: documents.filter(d => d.category === "Receipts").length, color: "secondary" },
        { id: "Contracts", name: "Contracts", count: documents.filter(d => d.category === "Contracts").length, color: "success" },
        { id: "Permits", name: "Permits", count: documents.filter(d => d.category === "Permits").length, color: "warning" },
        { id: "Change Orders", name: "Change Orders", count: documents.filter(d => d.category === "Change Orders").length, color: "danger" },
    ];

    const filteredDocuments = documents
        .filter(doc => selectedCategory === "all" || doc.category === selectedCategory)
        .filter(doc => selectedVendor === "all" || doc.vendor === selectedVendor)
        .filter(doc =>
            searchQuery === "" ||
            doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.vendor.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "date_desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
            if (sortBy === "date_asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
            if (sortBy === "amount_desc") return b.amount - a.amount;
            if (sortBy === "amount_asc") return a.amount - b.amount;
            return 0;
        });

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "Invoices": return "lucide:file-text";
            case "Receipts": return "lucide:receipt";
            case "Contracts": return "lucide:file-signature";
            case "Permits": return "lucide:scale";
            case "Change Orders": return "lucide:file-plus";
            default: return "lucide:file";
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-white border-b border-foreground-200 py-4">
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                    <div className="flex items-center cursor-pointer" onClick={() => navigateTo("landing")}>
                        <Icon icon="lucide:layers" className="text-primary h-7 w-7 mr-2" />
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
                <div className="mb-8">
                    <h1 className="font-gilroy text-3xl font-bold mb-2">Documents</h1>
                    <p className="text-foreground-500">Manage and organize all your construction documents</p>
                </div>

                {selectedVendor !== "all" && (
                    <div className="mb-6 flex items-center gap-2">
                        <span className="text-sm font-medium">Filtered by Vendor:</span>
                        <Chip
                            onClose={() => setSelectedVendor("all")}
                            variant="flat"
                            color="primary"
                        >
                            {selectedVendor}
                        </Chip>
                    </div>
                )}

                {/* Category Tabs */}
                <div className="mb-6">
                    <Tabs
                        selectedKey={selectedCategory}
                        onSelectionChange={(key) => setSelectedCategory(key as string)}
                        color="primary"
                        variant="underlined"
                    >
                        {categories.map((cat) => (
                            <Tab
                                key={cat.id}
                                title={
                                    <div className="flex items-center gap-2">
                                        <span>{cat.name}</span>
                                        <Chip size="sm" variant="flat" color={cat.color as any}>
                                            {cat.count}
                                        </Chip>
                                    </div>
                                }
                            />
                        ))}
                    </Tabs>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <Input
                        placeholder="Search documents..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        startContent={<Icon icon="lucide:search" className="h-4 w-4" />}
                        className="flex-1"
                    />

                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="flat" endContent={<Icon icon="lucide:chevron-down" className="h-4 w-4" />}>
                                Sort: {sortBy === "date_desc" ? "Newest First" : sortBy === "date_asc" ? "Oldest First" : sortBy === "amount_desc" ? "Highest Amount" : "Lowest Amount"}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu onAction={(key) => setSortBy(key as string)}>
                            <DropdownItem key="date_desc">Newest First</DropdownItem>
                            <DropdownItem key="date_asc">Oldest First</DropdownItem>
                            <DropdownItem key="amount_desc">Highest Amount</DropdownItem>
                            <DropdownItem key="amount_asc">Lowest Amount</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    <Button
                        color="primary"
                        startContent={<Icon icon="lucide:upload" className="h-4 w-4" />}
                        onPress={() => navigateTo("document-upload")}
                    >
                        Upload Document
                    </Button>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {filteredDocuments.map((doc) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardBody className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center">
                                                <Icon icon={getCategoryIcon(doc.category)} className="h-6 w-6 text-primary-500" />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-semibold mb-1">{doc.name}</h3>
                                                <div className="flex items-center gap-4 text-sm text-foreground-500">
                                                    <span className="flex items-center gap-1">
                                                        <Icon icon="lucide:building-2" className="h-4 w-4" />
                                                        {doc.vendor}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Icon icon="lucide:calendar" className="h-4 w-4" />
                                                        {new Date(doc.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Icon icon="lucide:folder" className="h-4 w-4" />
                                                        {doc.project}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-2xl font-bold">${doc.amount.toLocaleString()}</p>
                                                <Chip
                                                    size="sm"
                                                    color={doc.status === "Processed" ? "success" : "warning"}
                                                    variant="flat"
                                                >
                                                    {doc.status}
                                                </Chip>
                                            </div>

                                            <Button
                                                isIconOnly
                                                variant="light"
                                                onPress={() => navigateTo("document-review")}
                                            >
                                                <Icon icon="lucide:eye" className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredDocuments.length === 0 && (
                    <div className="text-center py-12">
                        <Icon icon="lucide:file-x" className="h-16 w-16 mx-auto text-foreground-300 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">No documents found</h3>
                        <p className="text-foreground-500 mb-4">Try adjusting your search or filters</p>
                        <Button color="primary" onPress={() => navigateTo("document-upload")}>
                            Upload Your First Document
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
};
