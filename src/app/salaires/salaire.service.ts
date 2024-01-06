import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaireService extends ApiService {
  endpoint: string = `${environment.apiURL}/salaires`;

  mesBulletins(code_entreprise: string, matricule: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-mes-bulletins/${code_entreprise}/${matricule}`);
  }

  classer(code_entreprise: string, corporate_id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-classer-paie/${code_entreprise}/${corporate_id}`);
  }

  classerDisponible(code_entreprise: string, corporate_id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-classer-disponible-paie/${code_entreprise}/${corporate_id}`);
  }

  // listeService(code_entreprise: string): Observable<any> {
  //   return this.http.get(`${this.endpoint}/get-list-services/${code_entreprise}`);
  // }

  // fardeIsPaieDisponible(code_entreprise: string): Observable<any> {
  //   return this.http.get(`${this.endpoint}/get-farde-paie-disponible-only/${code_entreprise}`);
  // }

  // fardeMaxValue(code_entreprise: string): Observable<any> {
  //   return this.http.get(`${this.endpoint}/get-farde-max-value/${code_entreprise}`);
  // }




  statutPaie(code_entreprise: string, code_corporate: string, month: string, year: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-statut-paie/${code_entreprise}/${code_corporate}/${month}/${year}`);
  }

  relevePaie(code_entreprise: string, code_corporate: string, month: string, year: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-releve-paie/${code_entreprise}/${code_corporate}/${month}/${year}`);
  }

  netAPayerTotal(code_entreprise: string, code_corporate: string, month: string, year: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-net-a-payer-total/${code_entreprise}/${code_corporate}/${month}/${year}`);
  } 

  iprTotal(code_entreprise: string, code_corporate: string, month: string, year: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-ipr-total/${code_entreprise}/${code_corporate}/${month}/${year}`);
  } 

  cnssQPOTotal(code_entreprise: string, code_corporate: string, month: string, year: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-cnss-qpo-total/${code_entreprise}/${code_corporate}/${month}/${year}`);
  }

  rbiTotal(code_entreprise: string, code_corporate: string, month: string, year: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-rbi-total/${code_entreprise}/${code_corporate}/${month}/${year}`);
  }

  fraisBancaireTotal(code_entreprise: string, code_corporate: string, month: string, year: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-frais-bancaire-total/${code_entreprise}/${code_corporate}/${month}/${year}`);
  }

  heureSuppTotal(code_entreprise: string, code_corporate: string, month: string, year: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-heures-supp-total/${code_entreprise}/${code_corporate}/${month}/${year}`);
  }

  primeTotal(code_entreprise: string, code_corporate: string, month: string, year: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-primes-total/${code_entreprise}/${code_corporate}/${month}/${year}`);
  }

  penalitesTotal(code_entreprise: string, code_corporate: string, month: string, year: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-penalites-total/${code_entreprise}/${code_corporate}/${month}/${year}`);
  }

  syndicatTotal(code_entreprise: string, code_corporate: string, month: string, year: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-syndicat-total/${code_entreprise}/${code_corporate}/${month}/${year}`);
  }





  getJrPrestE(code_entreprise: string, matricule: string, date_paie: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-jrs-preste/${code_entreprise}/${matricule}/${date_paie}`);
  }

  getJrCongePayE(code_entreprise: string, matricule: string, date_paie: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-jrs-conge/${code_entreprise}/${matricule}/${date_paie}`);
  } 

  nbrHeureSupp(code_entreprise: string, id: number, date_paie: string, pris_en_compte_mois_plus_1: boolean): Observable<any> {
    return this.http.get(`${this.endpoint}/get-nbr-heures-supp/${code_entreprise}/${id}/${date_paie}/${pris_en_compte_mois_plus_1}`);
  }

  primeTotalCDF(code_entreprise: string, id: number, date_paie: string, pris_en_compte_mois_plus_1: boolean): Observable<any> {
    return this.http.get(`${this.endpoint}/get-prime-total-cdf/${code_entreprise}/${id}/${date_paie}/${pris_en_compte_mois_plus_1}`);
  }
  primeTotalUSD(code_entreprise: string, id: number, date_paie: string, pris_en_compte_mois_plus_1: boolean): Observable<any> {
    return this.http.get(`${this.endpoint}/get-prime-total-usd/${code_entreprise}/${id}/${date_paie}/${pris_en_compte_mois_plus_1}`);
  }

  penaliteTotalCDF(code_entreprise: string, id: number, date_paie: string, pris_en_compte_mois_plus_1: boolean): Observable<any> {
    return this.http.get(`${this.endpoint}/get-penalite-total-cdf/${code_entreprise}/${id}/${date_paie}/${pris_en_compte_mois_plus_1}`);
  }
  penaliteTotalUSD(code_entreprise: string, id: number, date_paie: string, pris_en_compte_mois_plus_1: boolean): Observable<any> {
    return this.http.get(`${this.endpoint}/get-penalite-total-usd/${code_entreprise}/${id}/${date_paie}/${pris_en_compte_mois_plus_1}`);
  }

  avanceSalaireTotalCDF(code_entreprise: string, id: number, date_paie: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-avance-salaire-total-cdf/${code_entreprise}/${id}/${date_paie}`);
  }
  avanceSalaireTotalUSD(code_entreprise: string, id: number, date_paie: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-avance-salaire-total-usd/${code_entreprise}/${id}/${date_paie}`);
  }

  preEntrepriseCDF(code_entreprise: string, id: number, date_paie: string): Observable<any> {
    return this.http.get(`${this.endpoint}/pres-entreprise-cdf/${code_entreprise}/${id}/${date_paie}`);
  }

  preEntrepriseUSD(code_entreprise: string, id: number, date_paie: string): Observable<any> {
    return this.http.get(`${this.endpoint}/pres-entreprise-usd/${code_entreprise}/${id}/${date_paie}`);
  }

  getAnciennete(code_entreprise: string, id: number, date_debut_contrat: string, date_paie: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-date-debut-contrat/${code_entreprise}/${id}/${date_debut_contrat}/${date_paie}`);
  }



  downloadReport(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.post(`${this.endpoint}/download-xlsx/${code_entreprise}/${start_date}/${end_date}`, {}, {responseType: 'blob'});
  } 
}

