import { Component, inject, signal } from '@angular/core';
import { Catalogue as CatalogueService, ServicePressing } from '../../services/catalogue';

@Component({
  selector: 'app-catalogue',
  imports: [],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue {
  private catalogueService = inject(CatalogueService);

  services = signal<ServicePressing[]>([]);
  loading = signal(true);
  erreur = signal<string | null>(null);

  constructor() {
    this.catalogueService.getAll().subscribe({
      next: (data) => {
        this.services.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.erreur.set('Impossible de charger le catalogue');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
