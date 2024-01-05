import { PersonnelModel } from "src/app/personnels/models/personnel-model";

export interface DepartementModel{
    id: number;
    departement: string; 
    personnels: PersonnelModel[];
    signature: string; 
    created: Date; 
    update_created: Date;  
    entreprise: string; 
    code_entreprise: string;
}