import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifyService extends ApiService {
  endpoint: string = `${environment.apiURL}/notify`;

  
  getAllNotify(code_entreprise: string, matricule: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all/${code_entreprise}/${matricule}`);
  } 
} 