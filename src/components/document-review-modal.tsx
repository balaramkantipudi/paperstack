import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@heroui/react";
import { Document, documentService } from "../services/document-service";

interface DocumentReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    document: Document | null;
    onSave: (updatedDoc: Document) => void;
}

export const DocumentReviewModal: React.FC<DocumentReviewModalProps> = ({ isOpen, onClose, document, onSave }) => {
    const [editedDoc, setEditedDoc] = React.useState<Document | null>(null);
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        if (document) {
            setEditedDoc({ ...document });
        }
    }, [document]);

    const handleSave = async () => {
        if (!editedDoc) return;
        setIsSaving(true);
        try {
            // Update in Supabase
            const updated = await documentService.updateDocument(editedDoc.id, {
                ...editedDoc,
                status: 'approved' // Auto-approve on save
            });
            if (updated) {
                onSave(updated);
                onClose();
            }
        } catch (error) {
            console.error("Failed to save document:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!editedDoc) return null;

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Review Document</ModalHeader>
                        <ModalBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left: Form Data */}
                                <div className="space-y-4">
                                    <Input
                                        label="Vendor Name"
                                        value={editedDoc.vendor}
                                        onValueChange={(val) => setEditedDoc({ ...editedDoc, vendor: val })}
                                    />
                                    <div className="flex gap-4">
                                        <Input
                                            label="Date"
                                            type="date"
                                            value={editedDoc.date}
                                            onValueChange={(val) => setEditedDoc({ ...editedDoc, date: val })}
                                        />
                                        <Input
                                            label="Amount"
                                            type="number"
                                            startContent={<span className="text-default-400">$</span>}
                                            value={editedDoc.amount.toString()}
                                            onValueChange={(val) => setEditedDoc({ ...editedDoc, amount: parseFloat(val) || 0 })}
                                        />
                                    </div>
                                    <Select
                                        label="Category"
                                        selectedKeys={editedDoc.type ? [editedDoc.type] : []}
                                        onChange={(e) => setEditedDoc({ ...editedDoc, type: e.target.value as any })}
                                    >
                                        <SelectItem key="Invoice" value="Invoice">Invoice</SelectItem>
                                        <SelectItem key="Receipt" value="Receipt">Receipt</SelectItem>
                                        <SelectItem key="Contract" value="Contract">Contract</SelectItem>
                                        <SelectItem key="Permit" value="Permit">Permit</SelectItem>
                                    </Select>
                                    <Select
                                        label="Project"
                                        placeholder="Select a project"
                                        selectedKeys={editedDoc.project ? [editedDoc.project] : []}
                                        onChange={(e) => setEditedDoc({ ...editedDoc, project: e.target.value })}
                                    >
                                        <SelectItem key="Downtown Loft Reno" value="Downtown Loft Reno">Downtown Loft Reno</SelectItem>
                                        <SelectItem key="Suburban Kitchen" value="Suburban Kitchen">Suburban Kitchen</SelectItem>
                                        <SelectItem key="Lakeside Cabin" value="Lakeside Cabin">Lakeside Cabin</SelectItem>
                                        <SelectItem key="General" value="General">General Overhead</SelectItem>
                                    </Select>
                                </div>

                                {/* Right: File Preview (Placeholder for now) */}
                                <div className="bg-default-100 rounded-lg p-4 flex items-center justify-center min-h-[300px]">
                                    {editedDoc.fileUrl ? (
                                        <iframe src={editedDoc.fileUrl} className="w-full h-full min-h-[300px] border-none" title="Document Preview" />
                                    ) : (
                                        <p className="text-default-500">No preview available</p>
                                    )}
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" isLoading={isSaving} onPress={handleSave}>
                                Approve & Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
