import { Routes } from '@angular/router';
import { Catalogue } from './components/catalogue/catalogue';
import { Login } from './components/login/login';
import { NouvelleCommande } from './components/nouvelle-commande/nouvelle-commande';

export const routes: Routes = [
  { path: '', component: Catalogue },
  { path: 'login', component: Login },
  { path: 'commander', component: NouvelleCommande },
];
