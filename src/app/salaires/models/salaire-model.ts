import { PersonnelModel } from "src/app/personnels/models/personnel-model";

export class SalaireModel {
    id: number;
    personnel: PersonnelModel;
    departement: string;
    fonction: string;
    monnaie: string;
    taux_dollard : string;
    nbr_dependants: number;
    alloc_logement: string;
    alloc_transport: string;
    alloc_familliale: string;
    soins_medicaux: string;
    salaire_base: string;  // Par jour 
    primes: string;
    anciennete_nbr_age: number;
    prime_anciennete: string;
    heures_supp: number;
    heure_supplementaire_monnaie: string;
    conge_paye: number;
    nbre_jrs_preste: number; // Nombre de jours presents
    nbre_jrs_ferie: number;
    rbi: string;  // Remuneration brute imposable
    cnss_qpo: string; // Impôt de 5% => 0.05
    rni: string;  // Remuneration Nette Imposable
    ipr: string;  // Impôt Professionnel sur les Rémunérations (IPR)
    impot_elide: string; // Economie de l'impôt ce qui sera sanctionné
    syndicat: string;  // 1 % 
    penalites: string;  // Sanctions sur le salaire net à payer
    avance_slaire: string;
    prise_en_charge_frais_bancaire: string;
    pres_entreprise: string;
    net_a_payer: string;
    statut: string; // Genereted, Traitement, Disponible
    date_paie: Date;
    signature: string;
    created: Date;
    update_created: Date;
    entreprise: string;
    code_entreprise: string; 
}