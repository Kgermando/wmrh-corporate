import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashAllService extends ApiService {
  endpoint: string = `${environment.apiURL}/dash-all`;
 
  totalEnmployesAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/total-enmployes-all/${code_entreprise}/${start_date}/${end_date}`);
  }
  totalEnmployeFemmeAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/total-enmployes-femme-all/${code_entreprise}/${start_date}/${end_date}`);
  } 
  totalEnmployeHommeAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/total-enmployes-homme-all/${code_entreprise}/${start_date}/${end_date}`);
  }
 
   
  // Performences Employés 
  getPerformencesAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/performences-all/${code_entreprise}/${start_date}/${end_date}`);
  }

  // Finances 

  masseSalarialAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/masse-salarial-all/${code_entreprise}/${start_date}/${end_date}`);
  }

  statutPaieAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/statut-paie-all/${code_entreprise}/${start_date}/${end_date}`);
  } 

  allocationALl(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/allocation-all/${code_entreprise}/${start_date}/${end_date}`);
  } 

  primesAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/primes-all/${code_entreprise}/${start_date}/${end_date}`);
  }

  primeAncienneteAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/primes-anciennete-all/${code_entreprise}/${start_date}/${end_date}`);
  }

  penaliteAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/penalites-all/${code_entreprise}/${start_date}/${end_date}`);
  }

  avanceSalaireAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/avances-salaires-all/${code_entreprise}/${start_date}/${end_date}`);
  }

  presEntrepriseAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/pres-entreprise-all/${code_entreprise}/${start_date}/${end_date}`);
  }

  heureSuppAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/heures-supp-all/${code_entreprise}/${start_date}/${end_date}`);
  }

  syndicatAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/syndicats-all/${code_entreprise}/${start_date}/${end_date}`);
  } 
  
  // Presences 

  presencePieAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/presence-all/${code_entreprise}/${start_date}/${end_date}`);
  }

  // Recrutements
  recrutementsTotalAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/recrutements-total-all/${code_entreprise}/${start_date}/${end_date}`);
  }

  postulantsTotalAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/postulants-total-all/${code_entreprise}/${start_date}/${end_date}`);
  } 

  postulantsRetenuTotalAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/postulants-retenus-total-all/${code_entreprise}/${start_date}/${end_date}`);
  } 
 
}
