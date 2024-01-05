import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PresenceDashService extends ApiService {
  endpoint: string = `${environment.apiURL}/dashboard-presences`; 
  
  getPieAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/pie-all/${code_entreprise}/${start_date}/${end_date}`);
  }

  getCourbePresenceAll(code_entreprise: string, start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/courbe-presences-all/${code_entreprise}/${start_date}/${end_date}`);
  }
  

}
