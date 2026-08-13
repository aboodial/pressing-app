import { Component, inject, signal } from '@angular/core';
import { Catalogue, Ticket } from '../../services/catalogue';

@Component({
  selector: 'app-gestion-tickets',
  imports: [],
  templateUrl: './gestion-tickets.html',
  styleUrl: './gestion-tickets.css',
})
export class GestionTickets {
  private catalogueService = inject(Catalogue);

  tickets = signal<Ticket[]>([]);
  loading = signal(true);
  erreur = signal<string | null>(null);
  actionEnCours = signal<number | null>(null);

  libellesStatut: Record<string, string> = {
    recu: 'Reçu',
    en_traitement: 'En traitement',
    pret: 'Prêt',
    recupere: 'Récupéré',
  };

  constructor() {
    this.chargerTickets();
  }

  chargerTickets() {
    this.loading.set(true);
    this.catalogueService.getMesTickets().subscribe({
      next: (data) => {
        this.tickets.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les tickets');
        this.loading.set(false);
      },
    });
  }

  passerAuStatutSuivant(ticket: Ticket) {
    const ordre = ['recu', 'en_traitement', 'pret', 'recupere'];
    const indexActuel = ordre.indexOf(ticket.statut);
    const prochainStatut = ordre[indexActuel + 1];

    if (!prochainStatut) return;

    this.actionEnCours.set(ticket.id);
    this.erreur.set(null);

    this.catalogueService.changerStatut(ticket.id, prochainStatut).subscribe({
      next: () => {
        this.actionEnCours.set(null);
        this.chargerTickets();
      },
      error: (err) => {
        this.actionEnCours.set(null);
        this.erreur.set(err.error?.message ?? 'Erreur lors du changement de statut');
      },
    });
  }

  enregistrerPaiement(ticket: Ticket) {
    this.actionEnCours.set(ticket.id);
    this.erreur.set(null);

    this.catalogueService.enregistrerPaiement(ticket.id, ticket.montant_total).subscribe({
      next: () => {
        this.actionEnCours.set(null);
        this.chargerTickets();
      },
      error: (err) => {
        this.actionEnCours.set(null);
        this.erreur.set(err.error?.message ?? "Erreur lors de l'enregistrement du paiement");
      },
    });
  }

  libelleProchainStatut(statut: string): string | null {
    const ordre = ['recu', 'en_traitement', 'pret', 'recupere'];
    const indexActuel = ordre.indexOf(statut);
    const prochain = ordre[indexActuel + 1];
    return prochain ? this.libellesStatut[prochain] : null;
  }
}
