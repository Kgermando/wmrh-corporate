import { PersonnelModel } from "src/app/personnels/models/personnel-model";

export interface PenaliteModel {
    id: number;
    intitule: string;
    monnaie: string;
    montant: number;
    personnel: PersonnelModel;
    signature: string;
    created: Date;
    update_created: Date;
    entreprise: string;
    code_entreprise: string;
}