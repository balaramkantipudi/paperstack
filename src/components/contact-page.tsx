import React from "react";
import { Button, Card, CardBody, Input, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const ContactPage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        company: "",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you for your message! We'll get back to you soon.");
        setFormData({ name: "", email: "", company: "", message: "" });
    };

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
                    <h1 className="font-gilroy text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
                    <p className="text-foreground-500 mb-8">Get in touch with our team</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="ambient-shadow">
                            <CardBody className="p-8">
                                <h2 className="font-gilroy text-2xl font-bold mb-6">Send us a message</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground-700 mb-2">
                                            Name
                                        </label>
                                        <Input
                                            value={formData.name}
                                            onValueChange={(value) => setFormData({ ...formData, name: value })}
                                            placeholder="John Smith"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground-700 mb-2">
                                            Email
                                        </label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onValueChange={(value) => setFormData({ ...formData, email: value })}
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground-700 mb-2">
                                            Company
                                        </label>
                                        <Input
                                            value={formData.company}
                                            onValueChange={(value) => setFormData({ ...formData, company: value })}
                                            placeholder="Acme Construction"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground-700 mb-2">
                                            Message
                                        </label>
                                        <Textarea
                                            value={formData.message}
                                            onValueChange={(value) => setFormData({ ...formData, message: value })}
                                            placeholder="How can we help you?"
                                            minRows={4}
                                            required
                                        />
                                    </div>

                                    <Button type="submit" color="primary" className="w-full">
                                        Send Message
                                    </Button>
                                </form>
                            </CardBody>
                        </Card>

                        <div className="space-y-6">
                            <Card className="ambient-shadow">
                                <CardBody className="p-6">
                                    <div className="flex items-start">
                                        <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center mr-4">
                                            <Icon icon="lucide:mail" className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-dmsans font-semibold text-lg mb-1">Email</h3>
                                            <p className="text-foreground-600">support@paperstack.com</p>
                                            <p className="text-foreground-500 text-sm mt-1">We'll respond within 24 hours</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="ambient-shadow">
                                <CardBody className="p-6">
                                    <div className="flex items-start">
                                        <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center mr-4">
                                            <Icon icon="lucide:phone" className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-dmsans font-semibold text-lg mb-1">Phone</h3>
                                            <p className="text-foreground-600">+1 (555) 123-4567</p>
                                            <p className="text-foreground-500 text-sm mt-1">Mon-Fri, 9am-5pm PST</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="ambient-shadow">
                                <CardBody className="p-6">
                                    <div className="flex items-start">
                                        <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center mr-4">
                                            <Icon icon="lucide:map-pin" className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-dmsans font-semibold text-lg mb-1">Office</h3>
                                            <p className="text-foreground-600">123 Tech Street</p>
                                            <p className="text-foreground-600">San Francisco, CA 94105</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};
