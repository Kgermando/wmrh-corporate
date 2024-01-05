import { EntrepriseModel } from "../../entreprise/models/entreprise.model";

export interface AbonnementAdminModel {
    id: number;
    entreprise: EntrepriseModel;
    devise: string;
    taux_devise: string;
    montant: string;
    reference: string; // N° de reference de paiment
    responsable: string; // Celui qui a effectué le paiement
    bouquet: string; // Starter, Standard, Plus, Entreprise
    dure_paiement: string; // 1Mois, 3Mois, 6Mois, 1AN, 3ANS
    bordereau: string;
    signature: string;  // Celui qui a remplie cette fiche
    created: Date;
    update_created: Date;
}