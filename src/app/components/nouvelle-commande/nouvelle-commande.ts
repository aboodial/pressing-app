import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Catalogue, ServicePressing } from '../../services/catalogue';

interface LignePanier {
  service: ServicePressing;
  quantite: number;
}

@Component({
  selector: 'app-nouvelle-commande',
  imports: [],
  templateUrl: './nouvelle-commande.html',
  styleUrl: './nouvelle-commande.css',
})
export class NouvelleCommande {
  private catalogueService = inject(Catalogue);
  private router = inject(Router);

  services = signal<ServicePressing[]>([]);
  loading = signal(true);
  panier = signal<LignePanier[]>([]);
  envoiEnCours = signal(false);
  erreur = signal<string | null>(null);

  total = computed(() =>
    this.panier().reduce((sum, ligne) => sum + ligne.service.prix_unitaire * ligne.quantite, 0)
  );

  constructor() {
    this.catalogueService.getAll().subscribe({
      next: (data) => {
        this.services.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  ajouterAuPanier(service: ServicePressing) {
    const panierActuel = this.panier();
    const ligneExistante = panierActuel.find(l => l.service.id === service.id);

    if (ligneExistante) {
      this.panier.set(panierActuel.map(l =>
        l.service.id === service.id ? { ...l, quantite: l.quantite + 1 } : l
      ));
    } else {
      this.panier.set([...panierActuel, { service, quantite: 1 }]);
    }
  }

  retirerDuPanier(serviceId: number) {
    this.panier.set(this.panier().filter(l => l.service.id !== serviceId));
  }

  validerCommande() {
    if (this.panier().length === 0) return;

    this.envoiEnCours.set(true);
    this.erreur.set(null);

    const payload = this.panier().map(l => ({
      service_id: l.service.id,
      quantite: l.quantite
    }));

    this.catalogueService.creerTicket(payload).subscribe({
      next: () => {
        this.envoiEnCours.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.envoiEnCours.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur lors du dépôt de la commande');
      }
    });
  }
}
