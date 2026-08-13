import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ServicePressing {
  id: number;
  libelle: string;
  prix_unitaire: number;
  description: string | null;
  disponible: boolean;
}

const API_URL = 'http://localhost:8000/api';

@Service()
export class Catalogue {
  private http = inject(HttpClient);

  getAll(): Observable<ServicePressing[]> {
    return this.http.get<ServicePressing[]>(`${API_URL}/services`);
  }

  getOne(id: number): Observable<ServicePressing> {
    return this.http.get<ServicePressing>(`${API_URL}/services/${id}`);
  }

  creerTicket(services: { service_id: number; quantite: number }[]): Observable<any> {
    return this.http.post(
      `${API_URL}/tickets`,
      { services },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      },
    );
  }
}
