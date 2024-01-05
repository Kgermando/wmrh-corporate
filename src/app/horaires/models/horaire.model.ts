import { CorporateModel } from "src/app/preferences/corporates/models/corporate.model";

export class HoraireModel { 
    id: number; 
    name_horaire: string; // Horaire
    events: HoraireEventModel[];
    
    personnel_shift_1: string[];
    date_shift_1: string[];
    time_1: string;
    personnel_shift_2: string[];
    date_shift_2: string[];
    time_2: string;
    personnel_shift_3: string[];
    date_shift_3: string[];
    time_3: string;
    signature: string;
    created: Date;
    update_created : Date;
    entreprise: string;
    code_entreprise: string;
    corporate: CorporateModel;
}

export class HoraireEventModel { 
    time: string;
    date: Date;
    backgroundColor: string;
    textColor: string;
}