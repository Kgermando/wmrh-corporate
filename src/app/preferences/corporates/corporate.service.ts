import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CorporateService extends ApiService {
  endpoint: string = `${environment.apiURL}/corporates`;

  allGetNavigation(code_entreprise: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all-navigation/${code_entreprise}`);
  }

  getOne(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-one/${id}`);
  }
}
