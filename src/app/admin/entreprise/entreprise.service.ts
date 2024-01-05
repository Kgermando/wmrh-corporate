import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService extends ApiService {
  endpoint: string = `${environment.apiURL}/entreprises`;


  getEntreprise(): Observable<any> {
    return this.http.get(`${this.endpoint}`);
  }

  getCodeEntreprise(code_entreprise: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-code-entreprise/${code_entreprise}`);
  }

 
}
