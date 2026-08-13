import { Routes } from '@angular/router';
import { Catalogue } from './components/catalogue/catalogue';
import { Login } from './components/login/login';

export const routes: Routes = [
  { path: '', component: Catalogue },
  { path: 'login', component: Login },
];
