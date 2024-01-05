import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerformenceService extends ApiService { 
  endpoint: string = `${environment.apiURL}/performences`; 

  ponctualiteTotal(code_entreprise: string, id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-ponctualite-total/${code_entreprise}/${id}`);
  }

  hospitaliteTotal(code_entreprise: string, id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-hospitalite-total/${code_entreprise}/${id}`);
  }

  travailTotal(code_entreprise: string, id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-travail-total/${code_entreprise}/${id}`);
  }

  piePerformence(code_entreprise: string, id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-pie-total/${code_entreprise}/${id}`);
  } 

  getPieYEAR(code_entreprise: string, id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-pie-year/${code_entreprise}/${id}`);
  }

  getPieAll(code_entreprise: string, id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-pie-all/${code_entreprise}/${id}`);
  }

  ponctualiteTotalYEAR(code_entreprise: string, id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-ponctualite-total-year/${code_entreprise}/${id}`);
  }

  hospitaliteTotalYEAR(code_entreprise: string, id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-hospitalite-total-year/${code_entreprise}/${id}`);
  }

  travailTotalYEAR(code_entreprise: string, id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-travail-total-year/${code_entreprise}/${id}`);
  }

  ponctualiteTotalALL(code_entreprise: string, id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-ponctualite-total-all/${code_entreprise}/${id}`);
  }

  hospitaliteTotalALL(code_entreprise: string, id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-hospitalite-total-all/${code_entreprise}/${id}`);
  }

  travailTotalALL(code_entreprise: string, id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-travail-total-all/${code_entreprise}/${id}`);
  }
 
}
