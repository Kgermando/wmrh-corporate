import { CandidatureModel } from "../../candidatures/models/candidature-model";

export interface PosteModel {
    id: number;
    search_profil: string;
    resume: string; 
    type_contrat: string;
    statut: string;
    echeance: Date;
    signature: string;
    created: Date;
    update_created : Date;
    entreprise: string;
    code_entreprise: string; 
    candidatures: CandidatureModel[];
}