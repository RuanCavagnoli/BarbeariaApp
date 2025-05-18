import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GamesPage } from './games.page';
import { GameFormComponent } from './game-form/game-form.component';

const routes: Routes = [
  {
    path: '',
    component: GamesPage
  },
  {
    path: 'new',
    component: GameFormComponent
  },
  {
    path: 'edit/:gameId',
    component: GameFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamesPageRoutingModule {}
