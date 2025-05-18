import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudiosPage } from './studios.page';

const routes: Routes = [
  {
    path: '',
    component: StudiosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudiosPageRoutingModule {}
