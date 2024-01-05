import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndemniteService extends ApiService {
  endpoint: string = `${environment.apiURL}/indemnites`; 

  getAllByCorporate(corporate_id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all-corporate-id/${corporate_id}`);
  }
}

