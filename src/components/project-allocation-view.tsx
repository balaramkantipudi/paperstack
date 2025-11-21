import React from "react";
import { Button, Card, CardBody, Input, Tooltip, Progress, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Divider } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const ProjectAllocationView: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [selectedProject, setSelectedProject] = React.useState("Downtown Office Tower");
  const [splitAllocation, setSplitAllocation] = React.useState(false);
  const [allocations, setAllocations] = React.useState([
    { project: "Downtown Office Tower", percentage: 100, amount: "$13,446.00" }
  ]);

  const projects = [
    "Downtown Office Tower",
    "Westside Residential Complex",
    "Harbor Bridge Renovation",
    "City Center Mall"
  ];

  const commonSplits = [
    { label: "50/50", values: [50, 50] },
    { label: "25/75", values: [25, 75] },
    { label: "33/33/33", values: [33, 33, 34] }
  ];

  const handleAddProject = () => {
    if (allocations.length >= 3) return;

    // Find a project that's not already allocated
    const availableProjects = projects.filter(
      project => !allocations.some(allocation => allocation.project === project)
    );

    if (availableProjects.length === 0) return;

    // Recalculate percentages to distribute evenly
    const newCount = allocations.length + 1;
    const basePercentage = Math.floor(100 / newCount);
    const remainder = 100 - (basePercentage * newCount);

    const newAllocations = allocations.map(allocation => ({
      ...allocation,
      percentage: basePercentage + (allocation === allocations[0] ? remainder : 0),
      amount: calculateAmount(basePercentage + (allocation === allocations[0] ? remainder : 0))
    }));

    newAllocations.push({
      project: availableProjects[0],
      percentage: basePercentage,
      amount: calculateAmount(basePercentage)
    });

    setAllocations(newAllocations);
    setSplitAllocation(true);
  };

  const handleRemoveProject = (index: number) => {
    if (allocations.length <= 1) return;

    const newAllocations = [...allocations];
    newAllocations.splice(index, 1);

    // Recalculate percentages to distribute evenly
    const totalPercentage = 100;
    const basePercentage = Math.floor(totalPercentage / newAllocations.length);
    const remainder = totalPercentage - (basePercentage * newAllocations.length);

    const updatedAllocations = newAllocations.map((allocation, idx) => ({
      ...allocation,
      percentage: basePercentage + (idx === 0 ? remainder : 0),
      amount: calculateAmount(basePercentage + (idx === 0 ? remainder : 0))
    }));

    setAllocations(updatedAllocations);

    if (updatedAllocations.length === 1) {
      setSplitAllocation(false);
    }
  };

  const handlePercentageChange = (index: number, newPercentage: number) => {
    if (allocations.length <= 1) return;

    // Ensure percentage is between 0 and 100
    newPercentage = Math.max(0, Math.min(100, newPercentage));

    // Calculate how much we need to adjust other allocations
    const currentTotal = allocations.reduce((sum, allocation, idx) =>
      idx === index ? sum : sum + allocation.percentage, 0
    );

    const availablePercentage = 100 - newPercentage;
    const adjustmentFactor = availablePercentage / currentTotal;

    const newAllocations = allocations.map((allocation, idx) => {
      if (idx === index) {
        return {
          ...allocation,
          percentage: newPercentage,
          amount: calculateAmount(newPercentage)
        };
      } else {
        const adjustedPercentage = Math.round(allocation.percentage * adjustmentFactor);
        return {
          ...allocation,
          percentage: adjustedPercentage,
          amount: calculateAmount(adjustedPercentage)
        };
      }
    });

    setAllocations(newAllocations);
  };

  const handleProjectChange = (index: number, projectName: string) => {
    const newAllocations = [...allocations];
    newAllocations[index].project = projectName;
    setAllocations(newAllocations);
  };

  const handleApplySplit = (values: number[]) => {
    if (values.length > allocations.length) {
      // Need to add more projects
      const diff = values.length - allocations.length;
      let newAllocations = [...allocations];

      for (let i = 0; i < diff; i++) {
        const availableProjects = projects.filter(
          project => !newAllocations.some(allocation => allocation.project === project)
        );

        if (availableProjects.length === 0) break;

        newAllocations.push({
          project: availableProjects[0],
          percentage: 0,
          amount: "$0.00"
        });
      }

      // Apply percentages
      newAllocations = newAllocations.map((allocation, idx) => {
        const percentage = idx < values.length ? values[idx] : 0;
        return {
          ...allocation,
          percentage,
          amount: calculateAmount(percentage)
        };
      });

      setAllocations(newAllocations);
      setSplitAllocation(true);
    } else {
      // Apply percentages to existing allocations
      const newAllocations = allocations.map((allocation, idx) => {
        const percentage = idx < values.length ? values[idx] : 0;
        return {
          ...allocation,
          percentage,
          amount: calculateAmount(percentage)
        };
      });

      setAllocations(newAllocations);
    }
  };

  const calculateAmount = (percentage: number): string => {
    const totalAmount = 13446; // $13,446.00
    const amount = (totalAmount * percentage / 100).toFixed(2);
    return `$${Number(amount).toLocaleString()}`;
  };

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
              onPress={() => navigateTo("document-processing")}
            >
              Back to Document
            </Button>

            <div className="hidden md:flex items-center ml-4">
              <span className="text-foreground-500">Allocating:</span>
              <span className="font-medium ml-2">Invoice #2458 ($13,446.00)</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="flat"
              color="primary"
              startContent={<Icon icon="lucide:save" className="h-4 w-4" />}
              onPress={() => navigateTo("document-processing")}
            >
              Save Allocation
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-gilroy text-2xl md:text-3xl font-bold mb-1">Project Allocation</h1>
            <p className="text-foreground-500">Allocate this invoice to one or more projects</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="ambient-shadow mb-8">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gilroy text-lg font-bold">Invoice #2458 - BuildSupply Inc.</h2>
                  <div className="text-xl font-bold">$13,446.00</div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <span className="text-foreground-500 mr-2">Allocation Type:</span>
                    <div className="flex items-center border border-foreground-200 rounded-lg overflow-hidden">
                      <button
                        className={`px-4 py-2 text-sm ${!splitAllocation ? 'bg-primary-500 text-white' : 'bg-white text-foreground-700'}`}
                        onClick={() => {
                          setSplitAllocation(false);
                          setAllocations([{ project: allocations[0].project, percentage: 100, amount: "$13,446.00" }]);
                        }}
                      >
                        Single Project
                      </button>
                      <button
                        className={`px-4 py-2 text-sm ${splitAllocation ? 'bg-primary-500 text-white' : 'bg-white text-foreground-700'}`}
                        onClick={() => {
                          setSplitAllocation(true);
                          if (allocations.length === 1) {
                            handleAddProject();
                          }
                        }}
                      >
                        Split Allocation
                      </button>
                    </div>
                  </div>

                  {splitAllocation && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground-500">Quick Split:</span>
                      {commonSplits.map((split, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="flat"
                          color="default"
                          onPress={() => handleApplySplit(split.values)}
                          isDisabled={split.values.length > projects.length}
                        >
                          {split.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {allocations.map((allocation, index) => (
                    <div key={index} className="p-6 border border-foreground-200 rounded-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-dmsans font-semibold">
                          {splitAllocation ? `Project ${index + 1}` : 'Project'}
                        </h3>
                        {splitAllocation && allocations.length > 1 && (
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            color="danger"
                            onPress={() => handleRemoveProject(index)}
                          >
                            <Icon icon="lucide:x" className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground-700 mb-2">
                            Project
                          </label>
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                variant="bordered"
                                className="w-full justify-between"
                                endContent={<Icon icon="lucide:chevron-down" className="h-4 w-4" />}
                              >
                                {allocation.project}
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              aria-label="Project selection"
                              onAction={(key) => handleProjectChange(index, projects[Number(key)])}
                            >
                              {projects.map((project, idx) => (
                                <DropdownItem
                                  key={idx}
                                  isDisabled={allocations.some((a, i) => i !== index && a.project === project)}
                                >
                                  {project}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground-700 mb-2">
                            Job Cost Code
                          </label>
                          <Input
                            value={allocation.project === "Downtown Office Tower" ? "DTW-MAT-2023" :
                              allocation.project === "Westside Residential Complex" ? "WRC-MAT-2023" :
                                allocation.project === "Harbor Bridge Renovation" ? "HBR-MAT-2023" :
                                  "CCM-MAT-2023"}
                            className="w-full"
                          />
                        </div>
                      </div>

                      {splitAllocation && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-foreground-700">
                              Allocation Percentage
                            </label>
                            <div className="flex items-center">
                              <Input
                                type="number"
                                value={String(allocation.percentage)}
                                onChange={(e) => handlePercentageChange(index, Number(e.target.value))}
                                className="w-20 text-right"
                                min="0"
                                max="100"
                              />
                              <span className="ml-2">%</span>
                            </div>
                          </div>

                          <Progress
                            value={allocation.percentage}
                            color="primary"
                            className="mb-4"
                          />

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground-500">Amount</span>
                            <span className="font-bold">{allocation.amount}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {splitAllocation && allocations.length < 3 && (
                    <Button
                      variant="flat"
                      color="primary"
                      startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
                      className="w-full"
                      onPress={handleAddProject}
                    >
                      Add Project
                    </Button>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-foreground-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Total Allocated</span>
                    <div className="flex items-center">
                      <span className="mr-4">{allocations.reduce((sum, allocation) => sum + allocation.percentage, 0)}%</span>
                      <span className="font-bold">$13,446.00</span>
                    </div>
                  </div>

                  <Progress
                    value={allocations.reduce((sum, allocation) => sum + allocation.percentage, 0)}
                    color={allocations.reduce((sum, allocation) => sum + allocation.percentage, 0) === 100 ? "success" : "danger"}
                  />

                  {allocations.reduce((sum, allocation) => sum + allocation.percentage, 0) !== 100 && (
                    <p className="text-danger text-sm mt-2">
                      Total allocation must equal 100%
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>

            <div className="flex justify-between gap-4">
              <Button
                variant="flat"
                color="default"
                className="flex-1"
                onPress={() => navigateTo("document-processing")}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                className="flex-1"
                endContent={<Icon icon="lucide:check" className="h-4 w-4" />}
                onPress={() => navigateTo("document-processing")}
                isDisabled={allocations.reduce((sum, allocation) => sum + allocation.percentage, 0) !== 100}
              >
                Save Allocation
              </Button>
            </div>
          </div>

          <div>
            <Card className="ambient-shadow mb-8">
              <CardBody className="p-6">
                <h2 className="font-gilroy text-lg font-bold mb-4">Project Information</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-dmsans font-semibold mb-2">{selectedProject}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-foreground-500">Status:</span>
                        <span className="font-medium">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground-500">Start Date:</span>
                        <span className="font-medium">Mar 15, 2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground-500">End Date:</span>
                        <span className="font-medium">Dec 31, 2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground-500">Budget:</span>
                        <span className="font-medium">$1,250,000.00</span>
                      </div>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="font-dmsans font-semibold mb-2">Budget Status</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground-500">Materials:</span>
                          <div>
                            <span className="font-medium">$425,680.00</span>
                            <span className="text-foreground-500 ml-1">/ $500,000.00</span>
                          </div>
                        </div>
                        <Progress value={85} color="primary" size="sm" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground-500">Labor:</span>
                          <div>
                            <span className="font-medium">$312,450.00</span>
                            <span className="text-foreground-500 ml-1">/ $400,000.00</span>
                          </div>
                        </div>
                        <Progress value={78} color="primary" size="sm" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground-500">Equipment:</span>
                          <div>
                            <span className="font-medium">$156,780.00</span>
                            <span className="text-foreground-500 ml-1">/ $200,000.00</span>
                          </div>
                        </div>
                        <Progress value={78} color="primary" size="sm" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground-500">Other:</span>
                          <div>
                            <span className="font-medium">$98,540.00</span>
                            <span className="text-foreground-500 ml-1">/ $150,000.00</span>
                          </div>
                        </div>
                        <Progress value={65} color="primary" size="sm" />
                      </div>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="font-dmsans font-semibold mb-2">Recent Allocations</h3>
                    <div className="space-y-3">
                      {[
                        { vendor: "ConMaterials Co.", amount: "$8,750.00", date: "Jul 10, 2023" },
                        { vendor: "Equipment Rental Pro", amount: "$4,320.00", date: "Jul 5, 2023" },
                        { vendor: "Electrical Wholesale Supply", amount: "$6,845.00", date: "Jun 28, 2023" }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <div>
                            <div className="font-medium">{item.vendor}</div>
                            <div className="text-foreground-500">{item.date}</div>
                          </div>
                          <div className="font-medium">{item.amount}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};