import React from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const PrivacyPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
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
                    <h1 className="font-gilroy text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-foreground-500 mb-8">Last updated: November 21, 2025</p>

                    <Card className="ambient-shadow">
                        <CardBody className="p-8">
                            <div className="prose max-w-none">
                                <h2 className="font-gilroy text-2xl font-bold mb-4">Introduction</h2>
                                <p className="text-foreground-600 mb-6">
                                    At Paperstack, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our document processing platform.
                                </p>

                                <h2 className="font-gilroy text-2xl font-bold mb-4 mt-8">Information We Collect</h2>
                                <p className="text-foreground-600 mb-4">
                                    We collect information that you provide directly to us, including:
                                </p>
                                <ul className="list-disc list-inside text-foreground-600 mb-6 space-y-2">
                                    <li>Account information (name, email, company details)</li>
                                    <li>Documents and files you upload to our platform</li>
                                    <li>Payment and billing information</li>
                                    <li>Communications with our support team</li>
                                </ul>

                                <h2 className="font-gilroy text-2xl font-bold mb-4 mt-8">How We Use Your Information</h2>
                                <p className="text-foreground-600 mb-4">
                                    We use the information we collect to:
                                </p>
                                <ul className="list-disc list-inside text-foreground-600 mb-6 space-y-2">
                                    <li>Provide, maintain, and improve our services</li>
                                    <li>Process your documents and extract relevant information</li>
                                    <li>Send you technical notices and support messages</li>
                                    <li>Respond to your comments and questions</li>
                                    <li>Protect against fraudulent or illegal activity</li>
                                </ul>

                                <h2 className="font-gilroy text-2xl font-bold mb-4 mt-8">Data Security</h2>
                                <p className="text-foreground-600 mb-6">
                                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit and at rest.
                                </p>

                                <h2 className="font-gilroy text-2xl font-bold mb-4 mt-8">Contact Us</h2>
                                <p className="text-foreground-600">
                                    If you have any questions about this Privacy Policy, please contact us at privacy@paperstack.com
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
};
