import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudiosPageRoutingModule } from './studios-routing.module';

import { StudiosPage } from './studios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudiosPageRoutingModule
  ],
  declarations: [StudiosPage]
})
export class StudiosPageModule {}
