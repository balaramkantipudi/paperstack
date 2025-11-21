export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            documents: {
                Row: { [key: string]: any }
                Insert: { [key: string]: any }
                Update: { [key: string]: any }
            }
            'original-documents': {
                Row: { [key: string]: any }
                Insert: { [key: string]: any }
                Update: { [key: string]: any }
            }
            document_line_items: {
                Row: { [key: string]: any }
                Insert: { [key: string]: any }
                Update: { [key: string]: any }
            }
            document_processing_history: {
                Row: { [key: string]: any }
                Insert: { [key: string]: any }
                Update: { [key: string]: any }
            }
            expense_categories: {
                Row: { [key: string]: any }
                Insert: { [key: string]: any }
                Update: { [key: string]: any }
            }
            vendors: {
                Row: { [key: string]: any }
                Insert: { [key: string]: any }
                Update: { [key: string]: any }
            }
            integration_settings: {
                Row: { [key: string]: any }
                Insert: { [key: string]: any }
                Update: { [key: string]: any }
            }
            organization_members: {
                Row: { [key: string]: any }
                Insert: { [key: string]: any }
                Update: { [key: string]: any }
            }
            [key: string]: {
                Row: { [key: string]: any }
                Insert: { [key: string]: any }
                Update: { [key: string]: any }
            }
        }
        Views: {
            [key: string]: {
                Row: { [key: string]: any }
            }
        }
        Functions: {
            [key: string]: {
                Args: { [key: string]: any }
                Returns: any
            }
        }
        Enums: {
            [key: string]: any
        }
    }
}
