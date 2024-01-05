import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class PresenceService extends ApiService {
  endpoint: string = `${environment.apiURL}/apointements`;
 
  getMatricule(code_entreprise: string, matricule: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-matricule/${code_entreprise}/${matricule}`);
  } 

  getRegisterPresence(code_entreprise: string, site_location: string, date_presence: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-registre/${code_entreprise}/${site_location}/${date_presence}`);
  }



  getPie(code_entreprise: string, matricule: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-pie/${code_entreprise}/${matricule}`);
  }

  getPieYEAR(code_entreprise: string, matricule: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-pie-year/${code_entreprise}/${matricule}`);
  }

  getPieAll(code_entreprise: string, matricule: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-pie-all/${code_entreprise}/${matricule}`);
  }

  getLastItem(code_entreprise: string, matricule: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-last-item/${code_entreprise}/${matricule}`);
  }

  getItemsPAAAALL(code_entreprise: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-item-p-a-aa/${code_entreprise}`);
  }
  getItemsPAAA(code_entreprise: string, site_location: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-item-p-a-aa/${code_entreprise}/${site_location}`);
  }

  getItemsCongEALL(code_entreprise: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-item-conge/${code_entreprise}`);
  }
  getItemsCongE(code_entreprise: string, site_location: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-item-conge/${code_entreprise}/${site_location}`);
  }

  downloadReport(code_entreprise: string, site_location: string, start_date: string, end_date: string): Observable<any> {
    return this.http.post(`${this.endpoint}/download-xlsx/${code_entreprise}/${site_location}/${start_date}/${end_date}`, {}, {responseType: 'blob'});
  }

  uploadCSV(data: any): Observable<any> {
    return this.http.post(`${this.endpoint}/upload-csv`, data);
  } 

  downloadModelReport(code_entreprise: string, site_location: string): Observable<any> {
    return this.http.post(`${this.endpoint}/download-model-xlsx/${code_entreprise}/${site_location}`, {}, {responseType: 'blob'});
  } 
 
}
