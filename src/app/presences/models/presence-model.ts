import { PersonnelModel } from "src/app/personnels/models/personnel-model";

export interface ApointementModel {
    id: number;
    matricule: string;
    apointement: string;
    prestation: string;
    observation: string;
    date_entree: Date;
    date_sortie: Date;
    personnel: PersonnelModel;
    site_location: string;
    signature: string;
    created: Date;
    update_created: Date;
    entreprise: string;
    code_entreprise: string;
    
}