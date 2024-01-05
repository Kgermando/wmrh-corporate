import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvanceSalaireService extends ApiService {
  endpoint: string = `${environment.apiURL}/avance-salaires`; 

  getAllByCorporate(corporate_id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all-corporate-id/${corporate_id}`);
  }
}
