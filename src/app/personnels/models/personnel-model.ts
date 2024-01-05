import { AvanceSalaireModel } from "src/app/avance-salaires/models/avance-salaire-model";
import { HeureSuppModel } from "src/app/heures-supp/models/heure-supp-model";
import { NotifyModel } from "src/app/notify/models/notify-model";
import { PenaliteModel } from "src/app/penalites/models/penalite-model";
import { PerformenceModel } from "src/app/performences/models/performence-model";
import { CorporateModel } from "src/app/preferences/corporates/models/corporate.model";
import { DepartementModel } from "src/app/preferences/departements/model/departement-model";
import { FonctionModel } from "src/app/preferences/fonction/models/fonction-model";
import { ServicePrefModel } from "src/app/preferences/services/models/service-models";
import { SiteLocationModel } from "src/app/preferences/site-location/models/site-location-model";
import { TitleModel } from "src/app/preferences/titles/models/title-model";
import { PresEntrepriseModel } from "src/app/pres-entreprise/models/pres-entreprise-model";
import { ApointementModel } from "src/app/presences/models/presence-model";
import { PrimeModel } from "src/app/primes/models/prime-model";
import { SalaireModel } from "src/app/salaires/models/salaire-model";

export interface PersonnelModel {
    id: number;
    photo: string;
    nom: string;
    postnom: string;
    prenom: string;
    email: string;
    telephone: string;
    sexe: string;
    adresse: string;
    matricule: string;
    category: string; 

    statut_personnel: boolean;
    roles: string[];
    permission: string;
    corporate_view: string[];

    numero_cnss: string;
    date_naissance: Date;
    lieu_naissance: string;
    nationalite: string;
    etat_civile: string;
    nbr_dependants: number;

    corporates: CorporateModel;
    departements: DepartementModel;
    titles: TitleModel;
    fonctions: FonctionModel;
    services: ServicePrefModel;
    site_locations: SiteLocationModel; 

    type_contrat: string;
    date_debut_contrat: Date;
    date_fin_contrat: Date;
     
    monnaie: string;
    salaire_base: string;
    alloc_logement: string;
    alloc_transport: string;
    alloc_familliale: string;
    soins_medicaux: string;
    compte_bancaire: string;
    nom_banque: string;
    frais_bancaire: string;
    
    syndicat: boolean; 
    cv_url: string; 

    password: string;

    date_paie: Date; // La fade de la masse salariale deja généré
    statut_paie: string;

    presences: ApointementModel[];
    primes: PrimeModel[]; 
    penalites: PenaliteModel[];
    avances_salaires: AvanceSalaireModel[];
    heures_supp: HeureSuppModel[];
    pres_entreprises: PresEntrepriseModel[];
    salaires: SalaireModel[];
    performences: PerformenceModel[];
    notify: NotifyModel[];
    
    signature: string; 
    created: Date; 
    update_created: Date; 
    
    
    entreprise: string; 
    code_entreprise: string; 
    
}