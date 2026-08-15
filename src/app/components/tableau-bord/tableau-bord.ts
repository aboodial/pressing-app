import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Catalogue, ResumeStats, TicketsParMois, CaParService } from '../../services/catalogue';

Chart.register(...registerables);

@Component({
  selector: 'app-tableau-bord',
  imports: [],
  templateUrl: './tableau-bord.html',
  styleUrl: './tableau-bord.css',
})
export class TableauBord implements AfterViewInit {
  private catalogueService = inject(Catalogue);

  @ViewChild('graphiqueTickets') graphiqueTicketsRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graphiqueServices') graphiqueServicesRef!: ElementRef<HTMLCanvasElement>;

  resume = signal<ResumeStats | null>(null);
  loading = signal(true);

  constructor() {
    this.catalogueService.getResumeStats().subscribe({
      next: (data) => {
        this.resume.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  ngAfterViewInit() {
    this.chargerGraphiqueTickets();
    this.chargerGraphiqueServices();
  }

  private chargerGraphiqueTickets() {
    this.catalogueService.getTicketsParMois().subscribe({
      next: (data: TicketsParMois[]) => {
        new Chart(this.graphiqueTicketsRef.nativeElement, {
          type: 'bar',
          data: {
            labels: data.map((d) => d.mois),
            datasets: [
              {
                label: 'Tickets créés',
                data: data.map((d) => d.total),
                backgroundColor: '#1E3A5F',
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } },
          },
        });
      },
    });
  }

  private chargerGraphiqueServices() {
    this.catalogueService.getCaParService().subscribe({
      next: (data: CaParService[]) => {
        // On regroupe le CA total par service (toutes périodes confondues)
        const totauxParService = new Map<string, number>();
        data.forEach((d) => {
          const montant = parseFloat(d.chiffre_affaires);
          totauxParService.set(d.libelle, (totauxParService.get(d.libelle) ?? 0) + montant);
        });

        const couleurs = ['#1E3A5F', '#2c7a4b', '#c0392b', '#8e44ad', '#e67e22'];

        new Chart(this.graphiqueServicesRef.nativeElement, {
          type: 'pie',
          data: {
            labels: Array.from(totauxParService.keys()),
            datasets: [
              {
                data: Array.from(totauxParService.values()),
                backgroundColor: couleurs,
              },
            ],
          },
          options: {
            responsive: true,
          },
        });
      },
    });
  }
}
