// Stub implementation for @azure/ai-form-recognizer
export class DocumentAnalysisClient {
  constructor(endpoint, credential) {
    this.endpoint = endpoint;
    this.credential = credential;
  }

  async beginAnalyzeDocument(modelId, documentBuffer) {
    return {
      pollUntilDone: async () => ({
        documents: [
          {
            docType: 'invoice',
            fields: {
              VendorName: { value: 'Stub Vendor', confidence: 0.95 },
              InvoiceDate: { value: '2023-01-01', confidence: 0.95 },
              DueDate: { value: '2023-01-31', confidence: 0.95 },
              InvoiceTotal: { value: { amount: 100.00, currencyCode: 'USD' }, confidence: 0.95 },
              TotalTax: { value: { amount: 10.00 }, confidence: 0.95 },
              InvoiceId: { value: 'INV-001', confidence: 0.95 },
              Items: {
                value: [
                  {
                    value: {
                      Description: { value: 'Item 1' },
                      Quantity: { value: 1 },
                      UnitPrice: { value: { amount: 90.00 } },
                      Amount: { value: { amount: 90.00 } }
                    }
                  }
                ],
                confidence: 0.95
              }
            }
          }
        ]
      })
    };
  }
}

export class AzureKeyCredential {
  constructor(key) {
    this.key = key;
  }
}

export default {
  DocumentAnalysisClient,
  AzureKeyCredential
};
