import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbonnementService extends ApiService {
  endpoint: string = `${environment.apiURL}/abonnements`;

  payement(data: any): Observable<any> {
    return this.http.post(`${this.endpoint}/payement`, data);
  }
}

