import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartementService extends ApiService {
  endpoint: string = `${environment.apiURL}/departements`;

  findGetAll(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all-id/${id}`);
  } 
}
