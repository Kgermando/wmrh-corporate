import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HoraireService extends ApiService {
  endpoint: string = `${environment.apiURL}/horaires`;

  getAllHoraireByCorporate(corporate_id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all-corporate-id/${corporate_id}`);
  }
 
}
