import { Routes } from '@angular/router';
import { Catalogue } from './components/catalogue/catalogue';
import { Login } from './components/login/login';
import { NouvelleCommande } from './components/nouvelle-commande/nouvelle-commande';
import { MesCommandes } from './components/mes-commandes/mes-commandes';

export const routes: Routes = [
  { path: '', component: Catalogue },
  { path: 'login', component: Login },
  { path: 'commander', component: NouvelleCommande },
  { path: 'mes-commandes', component: MesCommandes },
];
