import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceService extends ApiService {
  endpoint: string = `${environment.apiURL}/dashboard-finances`;

  iprAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/total-ipr-all/${code_entreprise}/${start_date}/${end_date}`);
  }

  cnssQPOAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/total-cnss-qpo-all/${code_entreprise}/${start_date}/${end_date}`);
  }

  totalRBIAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/total-rbi-all/${code_entreprise}/${start_date}/${end_date}`);
  }
 

  // Depenses payés Masse salairiale
  depensePayEALl(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/total-depenses-paye-all/${code_entreprise}/${start_date}/${end_date}`);
  } 

  
}
