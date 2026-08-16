import { Component, inject, signal } from '@angular/core';
import { Catalogue, ServicePressing } from '../../services/catalogue';

@Component({
  selector: 'app-gestion-services',
  imports: [],
  templateUrl: './gestion-services.html',
  styleUrl: './gestion-services.css',
})
export class GestionServices {
  private catalogueService = inject(Catalogue);

  services = signal<ServicePressing[]>([]);
  loading = signal(true);
  erreur = signal<string | null>(null);

  modeEdition = signal<number | null>(null);
  afficherFormulaire = signal(false);

  libelle = signal('');
  prixUnitaire = signal(0);
  description = signal('');

  constructor() {
    this.chargerServices();
  }

  chargerServices() {
    this.loading.set(true);
    this.catalogueService.getAllPourGestion().subscribe({
      next: (data) => {
        this.services.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les services');
        this.loading.set(false);
      },
    });
  }

  onLibelleChange(event: Event) {
    this.libelle.set((event.target as HTMLInputElement).value);
  }

  onPrixChange(event: Event) {
    this.prixUnitaire.set(Number((event.target as HTMLInputElement).value));
  }

  onDescriptionChange(event: Event) {
    this.description.set((event.target as HTMLTextAreaElement).value);
  }

  ouvrirFormulaireCreation() {
    this.modeEdition.set(null);
    this.libelle.set('');
    this.prixUnitaire.set(0);
    this.description.set('');
    this.afficherFormulaire.set(true);
  }

  ouvrirFormulaireEdition(service: ServicePressing) {
    this.modeEdition.set(service.id);
    this.libelle.set(service.libelle);
    this.prixUnitaire.set(service.prix_unitaire);
    this.description.set(service.description ?? '');
    this.afficherFormulaire.set(true);
  }

  fermerFormulaire() {
    this.afficherFormulaire.set(false);
    this.erreur.set(null);
  }

  enregistrer() {
    this.erreur.set(null);

    const payload = {
      libelle: this.libelle(),
      prix_unitaire: this.prixUnitaire(),
      description: this.description(),
      disponible: true,
    };

    const id = this.modeEdition();

    const requete = id
      ? this.catalogueService.modifierService(id, payload)
      : this.catalogueService.creerService(payload);

    requete.subscribe({
      next: () => {
        this.afficherFormulaire.set(false);
        this.chargerServices();
      },
      error: (err) => {
        this.erreur.set(err.error?.message ?? "Erreur lors de l'enregistrement");
      },
    });
  }

  basculerDisponibilite(service: ServicePressing) {
    this.catalogueService
      .modifierService(service.id, { disponible: !service.disponible })
      .subscribe({
        next: () => this.chargerServices(),
        error: () => this.erreur.set('Erreur lors de la mise à jour'),
      });
  }

  supprimer(service: ServicePressing) {
    if (!confirm(`Supprimer définitivement le service "${service.libelle}" ?`)) return;

    this.catalogueService.supprimerService(service.id).subscribe({
      next: () => this.chargerServices(),
      error: () => this.erreur.set('Erreur lors de la suppression'),
    });
  }
}
