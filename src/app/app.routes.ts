import { Routes } from '@angular/router';
import { Catalogue } from './components/catalogue/catalogue';
import { Login } from './components/login/login';
import { Inscription } from './components/inscription/inscription';
import { NouvelleCommande } from './components/nouvelle-commande/nouvelle-commande';
import { MesCommandes } from './components/mes-commandes/mes-commandes';
import { GestionTickets } from './components/gestion-tickets/gestion-tickets';
import { TableauBord } from './components/tableau-bord/tableau-bord';
import { GestionServices } from './components/gestion-services/gestion-services';

export const routes: Routes = [
  { path: '', component: Catalogue },
  { path: 'login', component: Login },
  { path: 'inscription', component: Inscription },
  { path: 'commander', component: NouvelleCommande },
  { path: 'mes-commandes', component: MesCommandes },
  { path: 'gestion', component: GestionTickets },
  { path: 'tableau-bord', component: TableauBord },
  { path: 'gestion-services', component: GestionServices },
];
