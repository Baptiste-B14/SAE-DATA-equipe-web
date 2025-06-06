import { Routes } from '@angular/router';
import { IndexPageComponent } from './index-page/index-page.component';
import { AnalysePageComponent } from './analyse-page/analyse-page.component';
import { RecherchePageComponent } from './recherche-page/recherche-page.component';
import { PresentationPageComponent } from './presentation-page/presentation-page.component';
import { DynamiquePageComponent } from './dynamique-page/dynamique-page.component';
import { TeamPageComponent } from './team-page/team-page.component';
import { LegalPageComponent } from './legal-page/legal-page.component';
import {AdririenComponent} from "./adririen/adririen.component"
import {PagePlusLoinComponent} from "./page-plus-loin/page-plus-loin.component";
export const routes: Routes = [
    {
        path: '',
        component: IndexPageComponent,
      },
      {
        path: 'analyses/:id',
        component: AnalysePageComponent,
      },
      { path: '', redirectTo: '/analyses/1', pathMatch: 'full' },
      {
        path: 'recherche',
        component: RecherchePageComponent,
      },
      {
        path: 'presentation',
        component: PresentationPageComponent,
      },
      {
        path: 'dynamique',
        component: DynamiquePageComponent,
      },
      {
        path: 'team',
        component: TeamPageComponent,
      },
      {
        path: 'legal',
        component: LegalPageComponent,
      },
      {
      path: 'adririen',
        component: AdririenComponent,
      },
      {
      path: 'pour_aller_plus_loin',
        component: PagePlusLoinComponent,
      }
];
