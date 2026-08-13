import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  erreur = signal<string | null>(null);
  chargement = signal(false);

  onEmailChange(event: Event) {
    this.email.set((event.target as HTMLInputElement).value);
  }

  onPasswordChange(event: Event) {
    this.password.set((event.target as HTMLInputElement).value);
  }

  seConnecter() {
    this.erreur.set(null);
    this.chargement.set(true);

    this.auth.login(this.email(), this.password()).subscribe({
      next: () => {
        this.chargement.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur de connexion');
      },
    });
  }
}
