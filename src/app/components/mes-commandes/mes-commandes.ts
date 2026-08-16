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
  telechargementEnCours = signal<number | null>(null);

  etapesStatut = ['recu', 'en_traitement', 'pret', 'recupere'];

  libellesStatut: Record<string, string> = {
    recu: 'Reçu',
    en_traitement: 'En traitement',
    pret: 'Prêt',
    recupere: 'Récupéré'
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
      }
    });
  }

  indexEtape(statut: string): number {
    return this.etapesStatut.indexOf(statut);
  }

  telechargerRecu(ticket: Ticket) {
    this.telechargementEnCours.set(ticket.id);

    this.catalogueService.telechargerRecu(ticket.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const lien = document.createElement('a');
        lien.href = url;
        lien.download = `recu-ticket-${ticket.id}.pdf`;
        lien.click();
        window.URL.revokeObjectURL(url);
        this.telechargementEnCours.set(null);
      },
      error: () => {
        this.erreur.set('Impossible de télécharger le reçu');
        this.telechargementEnCours.set(null);
      }
    });
  }
}
