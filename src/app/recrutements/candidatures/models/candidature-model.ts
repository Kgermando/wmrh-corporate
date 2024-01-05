import { PosteModel } from "../../postes/models/poste-model";

export interface CandidatureModel {
    id: number;
    search_profil: string;
    scan_url: string;
    full_name: string;
    sexe: string;
    departement: string;
    statut: string; // Pour distinger les candidat qui sont selection avec les autres
    signature: string;
    created: Date;
    update_created : Date;
    entreprise: string;
    code_entreprise: string; 
    post: PosteModel;
}