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

export interface TicketLigne {
  id: number;
  service_id: number;
  service_libelle: string;
  quantite: number;
  prix_unitaire: number;
  sous_total: number;
}

export interface Ticket {
  id: number;
  statut: 'recu' | 'en_traitement' | 'pret' | 'recupere';
  client: {
    id: number;
    name: string;
    email: string;
  };
  lignes: TicketLigne[];
  montant_total: number;
  paye: boolean;
  created_at: string;
  updated_at: string;
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

  creerTicket(services: { service_id: number; quantite: number }[]): Observable<Ticket> {
    return this.http.post<Ticket>(
      `${API_URL}/tickets`,
      { services },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      },
    );
  }

  getMesTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${API_URL}/tickets`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
}
