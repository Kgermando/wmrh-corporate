import { PersonnelModel } from "src/app/personnels/models/personnel-model";

export interface HeureSuppModel {
    id: number; 
    motif: string; 
    nbr_heures: number;
    personnel: PersonnelModel;
    signature: string;
    created: Date;
    update_created : Date;
    entreprise: string;
    code_entreprise: string;
}