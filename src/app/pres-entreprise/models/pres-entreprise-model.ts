import { PersonnelModel } from "src/app/personnels/models/personnel-model";

export interface PresentrepriseModel {
    id: number;
    personnel: PersonnelModel;
    intitule: string; // Objet de l'empreint
    monnaie: string;
    total_empreints: string;  // Près de l'entreprise 
    deboursement: string; // Montant à debourser par mois
    date_debut: Date; //Date choisi pour commencer les paiements
    date_limit: Date;  // Date de dernier remboursement
    signature: string;
    created: Date;
    update_created: Date;
    entreprise: string;
    code_entreprise: string;
}