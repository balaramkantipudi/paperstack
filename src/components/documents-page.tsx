import React from "react";
import { Button, Card, CardBody, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip, Badge, Tabs, Tab } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { documentService, Document, CategoryStat } from "../services/document-service";

export const DocumentsPage: React.FC<{ navigateTo: (view: string, data?: any) => void; initialCategory?: string; initialVendor?: string }> = ({ navigateTo, initialCategory, initialVendor }) => {
    const [selectedCategory, setSelectedCategory] = React.useState(initialCategory || "all");
    const [selectedVendor, setSelectedVendor] = React.useState(initialVendor || "all");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortBy, setSortBy] = React.useState("date_desc");

    const [documents, setDocuments] = React.useState<Document[]>([]);
    const [categories, setCategories] = React.useState<CategoryStat[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [fetchedDocs, fetchedCategories] = await Promise.all([
                    documentService.getDocuments(),
                    documentService.getCategoryStats()
                ]);
                setDocuments(fetchedDocs);
                // Add "All Documents" category manually
                setCategories([
                    { name: "All Documents", count: fetchedDocs.length, color: "default" },
                    ...fetchedCategories
                ]);
            } catch (error) {
                console.error("Failed to load documents:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();

        // Subscribe to Realtime Updates
        const subscription = documentService.subscribeToDocuments(() => {
            // Refresh data on any change
            loadData();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const filteredDocuments = documents
        .filter(doc => {
            if (selectedCategory === "all" || selectedCategory === "All Documents") return true;
            // Match "Invoice" type to "Invoices" category
            return (doc.type + "s") === selectedCategory || doc.type === selectedCategory;
        })
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
                                key={cat.name}
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
                                                    color={doc.status === "approved" || doc.status === "exported" ? "success" : "warning"}
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
