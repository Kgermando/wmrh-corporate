import { PersonnelModel } from "src/app/personnels/models/personnel-model";

export class SiteLocationModel {
    id: number;
    site_location: string;
    manager: string;
    adresse: string;
    personnels: PersonnelModel[];
    signature: string;
    created: Date;
    update_created : Date;
    entreprise: string;
    code_entreprise: string;
}