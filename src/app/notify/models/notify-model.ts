import { PersonnelModel } from "src/app/personnels/models/personnel-model";

export class NotifyModel { 
    id: number;
    personnel: PersonnelModel;
    is_read: boolean; // Permet de savoir si cette element est ouvert
    title: string; // Titre de l'élément à notifier
    route: string; // Permet de rediriger directement
    signature: string;
    created: Date;
    update_created : Date;
    entreprise: string;
    code_entreprise: string;
}