import React from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const TermsPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
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
                    <h1 className="font-gilroy text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-foreground-500 mb-8">Last updated: November 21, 2025</p>

                    <Card className="ambient-shadow">
                        <CardBody className="p-8">
                            <div className="prose max-w-none">
                                <h2 className="font-gilroy text-2xl font-bold mb-4">Agreement to Terms</h2>
                                <p className="text-foreground-600 mb-6">
                                    By accessing or using Paperstack, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
                                </p>

                                <h2 className="font-gilroy text-2xl font-bold mb-4 mt-8">Use License</h2>
                                <p className="text-foreground-600 mb-4">
                                    Permission is granted to temporarily use Paperstack for personal or commercial document processing purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
                                </p>
                                <ul className="list-disc list-inside text-foreground-600 mb-6 space-y-2">
                                    <li>Modify or copy the materials</li>
                                    <li>Use the materials for any commercial purpose without a valid subscription</li>
                                    <li>Attempt to reverse engineer any software contained in Paperstack</li>
                                    <li>Remove any copyright or proprietary notations from the materials</li>
                                </ul>

                                <h2 className="font-gilroy text-2xl font-bold mb-4 mt-8">Service Description</h2>
                                <p className="text-foreground-600 mb-6">
                                    Paperstack provides automated document processing services for construction and business documents. We use AI and machine learning to extract data from your documents and integrate with accounting platforms.
                                </p>

                                <h2 className="font-gilroy text-2xl font-bold mb-4 mt-8">User Responsibilities</h2>
                                <p className="text-foreground-600 mb-4">
                                    You are responsible for:
                                </p>
                                <ul className="list-disc list-inside text-foreground-600 mb-6 space-y-2">
                                    <li>Maintaining the confidentiality of your account credentials</li>
                                    <li>All activities that occur under your account</li>
                                    <li>Ensuring your use complies with applicable laws</li>
                                    <li>The accuracy of information you provide</li>
                                </ul>

                                <h2 className="font-gilroy text-2xl font-bold mb-4 mt-8">Limitation of Liability</h2>
                                <p className="text-foreground-600 mb-6">
                                    Paperstack shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
                                </p>

                                <h2 className="font-gilroy text-2xl font-bold mb-4 mt-8">Contact Information</h2>
                                <p className="text-foreground-600">
                                    For questions about these Terms of Service, please contact us at legal@paperstack.com
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
};
