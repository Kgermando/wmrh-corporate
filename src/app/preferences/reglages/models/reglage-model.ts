import { EntrepriseModel } from "src/app/admin/entreprise/models/entreprise.model";

export interface PreferenceModel {
    id: number;  
    
    // Infos entreprise
    company: EntrepriseModel;

    // Date de paie
    date_paie : Date;

    // Impôt societe
    cnss_qpp : string;
    inpp : string;
    onem : string;

    // Parametre de deduction
    cotisation_syndicale: string;
    cnss_qpo : string;
    smig: string;

    // Taux
    // monnaie: string;
    nbre_heure_travail: number;
    taux_dollard: number;
    prise_en_charge_frais_bancaire : boolean;
    courses_transport : number;

    montant_travailler_quadre : string;
    montant_travailler_non_quadre : string;

    // Total jours prestés
    total_jours_a_prester: number;

    // Jours feries
    new_year: Date;
    noel: Date;
    martyr_day: Date;
    kabila_day: Date;
    lumumba_day: Date;
    labour_day: Date;
    liberation_day: Date;
    indepence_day: Date;
    parent_day: Date;
    kimbangu_day: Date;

    // Ancienneté
    prime_ancien_0: number;
    prime_ancien_5: number;
    prime_ancien_10: number;
    prime_ancien_15: number;
    prime_ancien_20: number;
    prime_ancien_25: number;

    // IPR barèmes
    bareme_3: number;
    bareme_15: number;
    bareme_30: number;

     // Paiement mois plus N+1
    pris_en_compte_mois_plus_1: boolean;

    delai_edit_bulletin: number;

    signature: string;
    created: Date;
    update_created : Date;
    entreprise: string;
    code_entreprise: string;
}