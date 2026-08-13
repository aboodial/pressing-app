import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  auth = inject(Auth);
  private router = inject(Router);

  seDeconnecter() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
