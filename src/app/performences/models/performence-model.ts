import { PersonnelModel } from "src/app/personnels/models/personnel-model";

export interface PerformenceModel {
    id: number;
    personnel: PersonnelModel;
    ponctualite: number;
    hospitalite: number;
    travail: number;
    observation: string;
    signature: string;
    created: Date;
    update_created: Date;
    entreprise: string;
    code_entreprise: string; 
}