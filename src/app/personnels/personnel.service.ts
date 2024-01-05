import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from '../shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService extends ApiService {
  endpoint: string = `${environment.apiURL}/personnels`;
 
  getPersennelByCorporate(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-personnel-corporate/${id}`);
  }

  getMatricule(matricule: any): Observable<any> {
    return this.http.get(`${this.endpoint}/get-matricule/${matricule}`);
  }
  
  getSyndicat(code_entreprise: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-syndicat/${code_entreprise}`);
  }

  resetStatutPaieAll(code_entreprise: string, corporate_id: number): Observable<any> {
    return this.http.put(`${this.endpoint}/reset-statut-paie-all/${code_entreprise}/${corporate_id}`, {});
  }

  resetStatutPaie(code_entreprise: string, id: number): Observable<any> {
    return this.http.put(`${this.endpoint}/reset-statut-paie/${code_entreprise}/${id}`, {});
  }

  uploadCSV(data: any): Observable<any> {
    return this.http.post(`${this.endpoint}/upload-csv`, data);
  }

  downloadReport(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.post(`${this.endpoint}/download-xlsx/${code_entreprise}/${start_date}/${end_date}`, {}, {responseType: 'blob'});
  } 

  downloadModelReport(code_entreprise: string): Observable<any> {
    return this.http.post(`${this.endpoint}/download-model-xlsx/${code_entreprise}`, {}, {responseType: 'blob'});
  }

  corbeil(code_entreprise: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-corbeil/${code_entreprise}`);
  }


  getAllWithSupport(): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all-support`);
  }

}