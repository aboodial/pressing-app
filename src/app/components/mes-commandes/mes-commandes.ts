import { Component, inject, signal } from '@angular/core';
import { Catalogue, Ticket } from '../../services/catalogue';

@Component({
  selector: 'app-mes-commandes',
  imports: [],
  templateUrl: './mes-commandes.html',
  styleUrl: './mes-commandes.css',
})
export class MesCommandes {
  private catalogueService = inject(Catalogue);

  tickets = signal<Ticket[]>([]);
  loading = signal(true);
  erreur = signal<string | null>(null);

  // Ordre des statuts pour construire la frise
  etapesStatut = ['recu', 'en_traitement', 'pret', 'recupere'];

  libellesStatut: Record<string, string> = {
    recu: 'Reçu',
    en_traitement: 'En traitement',
    pret: 'Prêt',
    recupere: 'Récupéré',
  };

  constructor() {
    this.catalogueService.getMesTickets().subscribe({
      next: (data) => {
        this.tickets.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger vos commandes');
        this.loading.set(false);
      },
    });
  }

  indexEtape(statut: string): number {
    return this.etapesStatut.indexOf(statut);
  }
}
