import { PersonnelModel } from "src/app/personnels/models/personnel-model";

export interface ServicePrefModel { 
    id: number; 
    service: string;
    personnels: PersonnelModel[];
    signature: string;
    created: Date;
    update_created : Date;
    entreprise: string;
    code_entreprise: string; 
}