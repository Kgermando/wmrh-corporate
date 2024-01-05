import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeureSuppService extends ApiService {
  endpoint: string = `${environment.apiURL}/heures-supp`; 
}
