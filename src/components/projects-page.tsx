import React from "react";
import { Button, Card, CardBody, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip, Progress, Tabs, Tab, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const ProjectsPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
    const [selectedTab, setSelectedTab] = React.useState("active");
    const [searchQuery, setSearchQuery] = React.useState("");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [projects, setProjects] = React.useState([
        {
            id: 1,
            name: "Downtown Office Tower",
            client: "ABC Corporation",
            budget: 2500000,
            spent: 1875000,
            status: "active",
            progress: 75,
            startDate: "2024-01-15",
            endDate: "2024-12-31",
            documents: 124,
            expenses: [
                { category: "Materials", amount: 850000 },
                { category: "Labor", amount: 625000 },
                { category: "Equipment", amount: 250000 },
                { category: "Permits", amount: 150000 }
            ]
        },
        {
            id: 2,
            name: "Westside Residential Complex",
            client: "Green Homes LLC",
            budget: 1800000,
            spent: 1260000,
            status: "active",
            progress: 70,
            startDate: "2024-02-01",
            endDate: "2024-11-30",
            documents: 87,
            expenses: [
                { category: "Materials", amount: 580000 },
                { category: "Labor", amount: 450000 },
                { category: "Equipment", amount: 180000 },
                { category: "Permits", amount: 50000 }
            ]
        },
        {
            id: 3,
            name: "Harbor Bridge Renovation",
            client: "City Infrastructure",
            budget: 3200000,
            spent: 3200000,
            status: "completed",
            progress: 100,
            startDate: "2023-06-01",
            endDate: "2024-01-31",
            documents: 156,
            expenses: [
                { category: "Materials", amount: 1400000 },
                { category: "Labor", amount: 1200000 },
                { category: "Equipment", amount: 450000 },
                { category: "Permits", amount: 150000 }
            ]
        }
    ]);

    const [newProject, setNewProject] = React.useState({
        name: "",
        client: "",
        budget: "",
        startDate: "",
        endDate: ""
    });

    const handleAddProject = () => {
        if (!newProject.name || !newProject.client) return;

        const project = {
            id: projects.length + 1,
            name: newProject.name,
            client: newProject.client,
            budget: Number(newProject.budget) || 0,
            spent: 0,
            status: "active",
            progress: 0,
            startDate: newProject.startDate || new Date().toISOString().split('T')[0],
            endDate: newProject.endDate || "",
            documents: 0,
            expenses: []
        };

        setProjects([...projects, project]);
        setNewProject({ name: "", client: "", budget: "", startDate: "", endDate: "" });
    };

    const filteredProjects = projects.filter(project => {
        const matchesTab = selectedTab === "all" || project.status === selectedTab;
        const matchesSearch = searchQuery === "" ||
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.client.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

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
                    <h1 className="font-gilroy text-3xl font-bold mb-2">Project Expense Tracker</h1>
                    <p className="text-foreground-500">Track expenses and budgets across all your construction projects</p>
                </div>

                {/* Tabs and Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <Tabs
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(key as string)}
                        color="primary"
                        variant="underlined"
                    >
                        <Tab key="all" title="All Projects" />
                        <Tab key="active" title="Active" />
                        <Tab key="completed" title="Completed" />
                    </Tabs>

                    <div className="flex items-center gap-4">
                        <Input
                            placeholder="Search projects..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            startContent={<Icon icon="lucide:search" className="h-4 w-4" />}
                            className="w-full md:w-64"
                        />
                        <Button
                            color="primary"
                            startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
                            onPress={onOpen}
                        >
                            New Project
                        </Button>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="ambient-shadow hover:shadow-lg transition-shadow">
                                <CardBody className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                        {/* Project Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="font-gilroy text-xl font-bold mb-1">{project.name}</h3>
                                                    <p className="text-foreground-500">{project.client}</p>
                                                </div>
                                                <Chip
                                                    color={project.status === "active" ? "success" : "default"}
                                                    variant="flat"
                                                >
                                                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                                </Chip>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-foreground-500">Budget</p>
                                                    <p className="font-semibold">{formatCurrency(project.budget)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-foreground-500">Spent</p>
                                                    <p className="font-semibold">{formatCurrency(project.spent)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-foreground-500">Remaining</p>
                                                    <p className="font-semibold">{formatCurrency(project.budget - project.spent)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-foreground-500">Documents</p>
                                                    <p className="font-semibold">{project.documents}</p>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium">Progress</span>
                                                    <span className="text-sm text-foreground-500">{project.progress}%</span>
                                                </div>
                                                <Progress value={project.progress} color="primary" />
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-foreground-500">
                                                <span className="flex items-center gap-1">
                                                    <Icon icon="lucide:calendar" className="h-4 w-4" />
                                                    {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Expense Breakdown */}
                                        <div className="lg:w-80">
                                            <h4 className="font-semibold mb-3">Expense Breakdown</h4>
                                            <div className="space-y-2">
                                                {project.expenses.map((expense, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span className="text-sm text-foreground-600">{expense.category}</span>
                                                        <span className="text-sm font-medium">{formatCurrency(expense.amount)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-foreground-200">
                                                <Button
                                                    variant="flat"
                                                    color="primary"
                                                    className="w-full"
                                                    onPress={() => navigateTo("documents")}
                                                >
                                                    View Documents
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                        <Icon icon="lucide:folder-x" className="h-16 w-16 mx-auto text-foreground-300 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">No projects found</h3>
                        <p className="text-foreground-500 mb-4">Try adjusting your search or filters</p>
                        <Button color="primary">
                            Create New Project
                        </Button>
                    </div>
                )}
            </main>


            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Create New Project</ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Project Name"
                                    placeholder="Enter project name"
                                    variant="bordered"
                                    value={newProject.name}
                                    onValueChange={(val) => setNewProject({ ...newProject, name: val })}
                                />
                                <Input
                                    label="Client"
                                    placeholder="Enter client name"
                                    variant="bordered"
                                    value={newProject.client}
                                    onValueChange={(val) => setNewProject({ ...newProject, client: val })}
                                />
                                <Input
                                    label="Budget"
                                    placeholder="Enter total budget"
                                    type="number"
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">$</span>
                                        </div>
                                    }
                                    variant="bordered"
                                    value={newProject.budget}
                                    onValueChange={(val) => setNewProject({ ...newProject, budget: val })}
                                />
                                <div className="flex gap-4">
                                    <Input
                                        label="Start Date"
                                        type="date"
                                        variant="bordered"
                                        className="flex-1"
                                        value={newProject.startDate}
                                        onValueChange={(val) => setNewProject({ ...newProject, startDate: val })}
                                    />
                                    <Input
                                        label="End Date"
                                        type="date"
                                        variant="bordered"
                                        className="flex-1"
                                        value={newProject.endDate}
                                        onValueChange={(val) => setNewProject({ ...newProject, endDate: val })}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={() => {
                                    handleAddProject();
                                    onClose();
                                }}>
                                    Create Project
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div >
    );
};
