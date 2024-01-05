import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PersonnelModel } from '../personnels/models/personnel-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router) { }

  login(data: any): Observable<any> {
    return this.http.post(`${environment.apiURL}/auth/login`, data, {
        withCredentials: true
    });
  }


  register(data: any): Observable<any> {
    return this.http.post<PersonnelModel>(`${environment.apiURL}/auth/register`, data);
  }


  user(): Observable<PersonnelModel> {
    return this.http.get<PersonnelModel>(`${environment.apiURL}/auth/personnel`);
  }

  isLoggedIn() {
    return localStorage.getItem('jwt') != null;
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiURL}/auth/logout`, {});
  } 


  updateInfo(data: any): Observable<PersonnelModel> {
    return this.http.put<PersonnelModel>(`${environment.apiURL}/personnels/info`, data);
  }

  updatePassword(data: any): Observable<PersonnelModel> {
    return this.http.put<PersonnelModel>(`${environment.apiURL}/personnels/password`, data);
  }

 
}
