import React from "react";
import {
  Button, Card, CardBody, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Badge, Progress
} from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useUser } from "@clerk/clerk-react";

import { documentService } from "../services/document-service";

export const FinancialDashboardPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [selectedProject, setSelectedProject] = React.useState("All Projects");
  const [selectedDateRange, setSelectedDateRange] = React.useState("This Month");
  const { user } = useUser();

  const projects = [
    "All Projects",
    "Downtown Office Tower",
    "Westside Residential Complex",
    "Harbor Bridge Renovation",
    "City Center Mall"
  ];

  const dateRanges = [
    "Today",
    "This Week",
    "This Month",
    "Last Month",
    "This Quarter",
    "This Year",
    "Custom Range"
  ];




  const [stats, setStats] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const [expenseCategories, setExpenseCategories] = React.useState<any[]>([]);
  const [projectBudgets, setProjectBudgets] = React.useState<any[]>([]);

  React.useEffect(() => {
    const loadFinancialData = async () => {
      setIsLoading(true);
      try {
        const [fetchedStats, fetchedCategories, fetchedProjects] = await Promise.all([
          documentService.getStats(),
          documentService.getCategoryStats(),
          documentService.getProjects()
        ]);
        setStats(fetchedStats);

        // Transform categories for expense chart
        const totalDocs = fetchedStats.totalProcessed || 1;
        setExpenseCategories(fetchedCategories.map(cat => ({
          name: cat.name,
          amount: 0, // We don't have per-category amount yet, would need aggregation
          percentage: Math.round((cat.count / totalDocs) * 100),
          color: cat.color
        })));

        // Transform projects for budget list
        setProjectBudgets(fetchedProjects.map(p => ({
          name: p.name,
          budget: p.budget,
          actual: p.spent,
          percentage: p.progress,
          status: p.spent > p.budget ? "Over Budget" : "On Budget"
        })));

      } catch (error) {
        console.error("Failed to load financial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFinancialData();
  }, []);



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
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-gilroy text-2xl md:text-3xl font-bold mb-1">Financial Overview</h1>
            <p className="text-foreground-500">Track your project expenses and document processing status.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
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


          </div>
        </div>

        {/* Document Status Cards */}


        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8">
          {/* Full Width Column */}
          <div className="space-y-8">
            {/* Expense Breakdown */}
            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Expense Breakdown</h2>
                  <Button
                    variant="light"
                    color="primary"
                    size="sm"
                    endContent={<Icon icon="lucide:arrow-right" className="h-4 w-4" />}
                    onPress={() => navigateTo("documents")}
                  >
                    View Details
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Pie Chart */}
                  <div className="flex items-center justify-center">
                    <div className="relative h-48 w-48">
                      <svg viewBox="0 0 100 100" className="h-full w-full">
                        {expenseCategories.map((category, i) => {
                          // Calculate the segment positions
                          const previousPercentages = expenseCategories
                            .slice(0, i)
                            .reduce((sum, cat) => sum + cat.percentage, 0);

                          const startAngle = (previousPercentages / 100) * 360;
                          const endAngle = ((previousPercentages + category.percentage) / 100) * 360;

                          // Convert polar to cartesian coordinates
                          const x1 = 50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180));
                          const y1 = 50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180));
                          const x2 = 50 + 40 * Math.cos((endAngle - 90) * (Math.PI / 180));
                          const y2 = 50 + 40 * Math.sin((endAngle - 90) * (Math.PI / 180));

                          // Determine if the arc should be greater than 180 degrees
                          const largeArcFlag = category.percentage > 50 ? 1 : 0;

                          // Map category colors to actual hex/Tailwind colors
                          const getColor = (color: string) => {
                            const colors: Record<string, string> = {
                              primary: "#006FEE", // NextUI primary
                              success: "#17C964", // NextUI success
                              secondary: "#7828C8", // NextUI secondary
                              warning: "#F5A524", // NextUI warning
                              danger: "#F31260", // NextUI danger
                              default: "#71717A"  // NextUI default
                            };
                            return colors[color] || colors.default;
                          };

                          return (
                            <path
                              key={i}
                              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                              fill={getColor(category.color)}
                              stroke="white"
                              strokeWidth="1"
                            />
                          );
                        })}
                        <circle cx="50" cy="50" r="25" fill="white" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-sm text-foreground-500">Total</p>
                          <p className="font-bold text-lg">{stats ? formatCurrency(stats.totalValue) : "$0"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category List */}
                  <div className="space-y-4">
                    {expenseCategories.map((category, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <div className={`h-3 w-3 rounded-full bg-${category.color}-500 mr-2`}></div>
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium">{formatCurrency(category.amount)}</span>
                            <span className="text-xs text-foreground-500 ml-2">({category.percentage}%)</span>
                          </div>
                        </div>
                        <Progress
                          value={category.percentage}
                          maxValue={100}
                          color={category.color as any}
                          size="sm"
                          className="mb-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Project Expense Tracker */}
            <Card className="ambient-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Project Expense Tracker</h2>
                  <Button
                    variant="light"
                    color="primary"
                    size="sm"
                    endContent={<Icon icon="lucide:arrow-right" className="h-4 w-4" />}
                    onPress={() => navigateTo("projects")}
                  >
                    View All Projects
                  </Button>
                </div>

                <div className="space-y-6">
                  {projectBudgets.map((project, index) => (
                    <div key={index} className="border border-foreground-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{project.name}</h3>
                        <Badge
                          color={
                            project.status === "Over Budget" ? "danger" :
                              project.status === "Under Budget" ? "success" :
                                "warning"
                          }
                          variant="flat"
                        >
                          {project.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-sm text-foreground-500 mr-2">Budget:</span>
                          <span className="font-medium">{formatCurrency(project.budget)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-foreground-500 mr-2">Actual:</span>
                          <span className="font-medium">{formatCurrency(project.actual)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-foreground-500 mr-2">Used:</span>
                          <span className="font-medium">{project.percentage}%</span>
                        </div>
                      </div>

                      <Progress
                        value={project.percentage}
                        maxValue={100}
                        color={
                          project.percentage > 90 ? "danger" :
                            project.percentage > 75 ? "warning" :
                              "success"
                        }
                        className="mb-2"
                      />

                      <div className="flex justify-end">
                        <Button
                          variant="flat"
                          size="sm"
                          color="primary"
                          onPress={() => navigateTo("projects")}
                        >
                          View Breakdown
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};