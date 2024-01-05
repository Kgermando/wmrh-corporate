import { PersonnelModel } from "src/app/personnels/models/personnel-model";
import { CorporateModel } from "src/app/preferences/corporates/models/corporate.model";
import { IndemniteContentModel } from "./indemnite-content.model";

export interface IndemniteModel {
    id: number;
    corporate: CorporateModel;
    personnel: PersonnelModel;
    intitule: string;
    statut: string;
    monnaie: string;
    taux_dollard: string;
    content: IndemniteContentModel[];
    total_a_payer: string;
    signature: string;
    created: Date;
    update_created: Date;
    entreprise: string;
    code_entreprise: string;
}

