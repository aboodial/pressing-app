import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-inscription',
  imports: [RouterLink],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription {
  private auth = inject(Auth);
  private router = inject(Router);

  name = signal('');
  email = signal('');
  password = signal('');
  passwordConfirmation = signal('');
  erreur = signal<string | null>(null);
  chargement = signal(false);

  onNameChange(event: Event) {
    this.name.set((event.target as HTMLInputElement).value);
  }

  onEmailChange(event: Event) {
    this.email.set((event.target as HTMLInputElement).value);
  }

  onPasswordChange(event: Event) {
    this.password.set((event.target as HTMLInputElement).value);
  }

  onPasswordConfirmationChange(event: Event) {
    this.passwordConfirmation.set((event.target as HTMLInputElement).value);
  }

  sInscrire() {
    this.erreur.set(null);
    this.chargement.set(true);

    this.auth
      .register(this.name(), this.email(), this.password(), this.passwordConfirmation())
      .subscribe({
        next: () => {
          this.chargement.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.chargement.set(false);
          this.erreur.set(err.error?.message ?? "Erreur lors de l'inscription");
        },
      });
  }
}
