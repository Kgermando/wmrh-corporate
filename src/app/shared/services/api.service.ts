import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class ApiService {
  abstract get endpoint(): string; 

  constructor(protected http: HttpClient) { }

  preference(code_entreprise: string): Observable<any> {
    // let headers: HttpHeaders = new HttpHeaders();
    // headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    // headers.append('Authorization', token);
    return this.http.get(`${this.endpoint}/preference/${code_entreprise}`);
  }

  getAll(code_entreprise: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all/${code_entreprise}`);
  }

  getAllLocation(code_entreprise: string, site_location: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all/${code_entreprise}/${site_location}`);
  }


  all(code_entreprise: string, page?: number): Observable<any> {
    let url = `${this.endpoint}/${code_entreprise}`;
    if (page) { // page is optional
      url += `?page=${page}`;
    } 
    return this.http.get(url); 
  }

  get(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get/${id}`);
  }

  presence(matricule: string): Observable<any> {
    return this.http.get(`${this.endpoint}/presence/${matricule}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.endpoint, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  } 
}
