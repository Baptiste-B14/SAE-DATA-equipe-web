import { Routes } from '@angular/router';
import { IndexPageComponent } from './index-page/index-page.component';
import { AnalysePageComponent } from './analyse-page/analyse-page.component';
import { RecherchePageComponent } from './recherche-page/recherche-page.component';
import { PresentationPageComponent } from './presentation-page/presentation-page.component';
import { DynamiquePageComponent } from './dynamique-page/dynamique-page.component';
import { TeamPageComponent } from './team-page/team-page.component';

export const routes: Routes = [
    {
        path: '',
        component: IndexPageComponent,
      },
      {
        path: 'analyses',
        component: AnalysePageComponent,
      },
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
];
