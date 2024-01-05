import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CorporateReglageService  extends ApiService {
  endpoint: string = `${environment.apiURL}/corporate-reglages`;

  updatePref(code_entreprise: string, signature: string, data: any): Observable<any> {
    return this.http.put(`${this.endpoint}/${code_entreprise}/${signature}`, data);
  }


  getAllReglage(): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all`);
  }

  
}
