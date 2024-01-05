import { EntrepriseModel } from "src/app/admin/entreprise/models/entreprise.model";
import { SiteLocationModel } from "../../site-location/models/site-location-model";
import { ServicePrefModel } from "../../services/models/service-models";
import { FonctionModel } from "../../fonction/models/fonction-model";
import { TitleModel } from "../../titles/models/title-model";
import { DepartementModel } from "../../departements/model/departement-model";
import { PersonnelModel } from "src/app/personnels/models/personnel-model";
import { PrimeModel } from "src/app/primes/models/prime-model";
import { PenaliteModel } from "src/app/penalites/models/penalite-model";
import { AvanceSalaireModel } from "src/app/avance-salaires/models/avance-salaire-model";
import { HeureSuppModel } from "src/app/heures-supp/models/heure-supp-model";
import { SalaireModel } from "src/app/salaires/models/salaire-model";
import { PerformenceModel } from "src/app/performences/models/performence-model";
import { PresEntrepriseModel } from "src/app/pres-entreprise/models/pres-entreprise-model"; 
import { HoraireModel } from "src/app/horaires/models/horaire.model";
import { IndemniteModel } from "src/app/salaires/indemnites/models/indemnite.model";

export interface CorporateModel {
    id: number;
    entreprise_id: EntrepriseModel;
    personnels: PersonnelModel[];
    logo: string; 
    corporate_name: string; // Nom de la corporate 
    statut: boolean; // statut entreprise sous traitant 
    code_corporate: string; 
    nbre_employe: number; 
    rccm: string; 
    id_nat: string; 
    numero_impot: string; 
    numero_cnss: string; 
    responsable: string; 
    telephone: string; 
    email: string; 
    adresse: string;
    departements: DepartementModel[];
    titles: TitleModel[];
    fonctions: FonctionModel[];
    services: ServicePrefModel[];
    site_locations: SiteLocationModel[];
    primes: PrimeModel[]; 
    penalites: PenaliteModel[];
    avances_salaires: AvanceSalaireModel[];
    heures_supp: HeureSuppModel[];
    pres_entreprises: PresEntrepriseModel[];
    indemnites: IndemniteModel[];
    horaires: HoraireModel[];
    salaires: SalaireModel[];
    performences: PerformenceModel[]; 
    code_entreprise: string; 
    signature: string; 
    created: Date;
    update_created: Date;
}