import { IndemniteModel } from "./indemnite.model";

export interface IndemniteContentModel {
    id: number;
    indemnite: IndemniteModel;
    nom: string;
    montant: string;
}