import React from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const AboutPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
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

                    <Button
                        variant="light"
                        onPress={() => navigateTo("landing")}
                        startContent={<Icon icon="lucide:arrow-left" className="h-4 w-4" />}
                    >
                        Back to Home
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="font-gilroy text-3xl md:text-4xl font-bold mb-4">About Paperstack</h1>
                    <p className="text-foreground-500 mb-8">Building the future of document processing</p>

                    <div className="space-y-6">
                        <Card className="ambient-shadow">
                            <CardBody className="p-8">
                                <h2 className="font-gilroy text-2xl font-bold mb-4">Our Mission</h2>
                                <p className="text-foreground-600 mb-4">
                                    At Paperstack, we're on a mission to eliminate the paperwork burden for construction companies and businesses. We believe that managing documents should be effortless, allowing you to focus on what really matters - building great projects.
                                </p>
                                <p className="text-foreground-600">
                                    Our AI-powered platform automatically processes invoices, receipts, and other documents, extracting key information and seamlessly integrating with your accounting systems.
                                </p>
                            </CardBody>
                        </Card>

                        <Card className="ambient-shadow">
                            <CardBody className="p-8">
                                <h2 className="font-gilroy text-2xl font-bold mb-4">Our Story</h2>
                                <p className="text-foreground-600 mb-4">
                                    Founded in 2024, Paperstack was born from firsthand experience with the challenges of document management in the construction industry. Our founders spent years watching valuable time being wasted on manual data entry and document organization.
                                </p>
                                <p className="text-foreground-600">
                                    Today, we're proud to serve hundreds of construction companies, helping them save time, reduce errors, and gain better insights into their business operations.
                                </p>
                            </CardBody>
                        </Card>

                        <Card className="ambient-shadow">
                            <CardBody className="p-8">
                                <h2 className="font-gilroy text-2xl font-bold mb-4">Our Values</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <Icon icon="lucide:zap" className="h-6 w-6 text-primary mr-2" />
                                            <h3 className="font-dmsans font-semibold text-lg">Efficiency</h3>
                                        </div>
                                        <p className="text-foreground-600">
                                            We're obsessed with saving you time and streamlining your workflows.
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <Icon icon="lucide:shield-check" className="h-6 w-6 text-primary mr-2" />
                                            <h3 className="font-dmsans font-semibold text-lg">Security</h3>
                                        </div>
                                        <p className="text-foreground-600">
                                            Your data security and privacy are our top priorities.
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <Icon icon="lucide:users" className="h-6 w-6 text-primary mr-2" />
                                            <h3 className="font-dmsans font-semibold text-lg">Customer Focus</h3>
                                        </div>
                                        <p className="text-foreground-600">
                                            We build features based on real customer needs and feedback.
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <Icon icon="lucide:trending-up" className="h-6 w-6 text-primary mr-2" />
                                            <h3 className="font-dmsans font-semibold text-lg">Innovation</h3>
                                        </div>
                                        <p className="text-foreground-600">
                                            We continuously improve our AI to deliver better results.
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};
