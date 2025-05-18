import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Barber } from '../models/barber.model';

@Injectable({
  providedIn: 'root'
})
export class BarberService {
  private apiUrl = 'http://localhost:3000/barbers';

  constructor(private http: HttpClient) { }

  getBarbers(): Observable<Barber[]> {
    return this.http.get<Barber[]>(this.apiUrl);
  }

  getBarber(id: string): Observable<Barber> {
    return this.http.get<Barber>(`${this.apiUrl}/${id}`);
  }

  createBarber(barber: Barber): Observable<Barber> {
    return this.http.post<Barber>(this.apiUrl, barber);
  }

  updateBarber(id: string, barber: Barber): Observable<Barber> {
    return this.http.put<Barber>(`${this.apiUrl}/${id}`, barber);
  }

  deleteBarber(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 