export interface AbonnementModel {
    id: number;
    originatingTransactionId: string;
    statusCode: string;
    statusDescription: string;
    transactionId: string;
    signature: string;
    created: Date;
    update_created : Date;
    entreprise: string;
    code_entreprise: string;
}