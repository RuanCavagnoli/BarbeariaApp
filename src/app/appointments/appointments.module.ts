import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AppointmentService } from './services/appointment.service';
import { BarberService } from '../core/services/barber.service';
import { ClientService } from '../core/services/client.service';
import { ServiceService } from '../core/services/service.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HttpClientModule,
    AppointmentsRoutingModule,
    AppointmentFormComponent
  ],
  providers: [
    AppointmentService,
    BarberService,
    ClientService,
    ServiceService
  ]
})
export class AppointmentsModule { } 