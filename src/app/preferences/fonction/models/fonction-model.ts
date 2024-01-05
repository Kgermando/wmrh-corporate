import { PersonnelModel } from "src/app/personnels/models/personnel-model";
import { CorporateModel } from "../../corporates/models/corporate.model";

export interface FonctionModel {
    id: number;
    fonction: string;
    personnels: PersonnelModel[];
    corporate: CorporateModel;
    signature: string;
    created: Date;
    update_created: Date;
    entreprise: string;
    code_entreprise: string;
}