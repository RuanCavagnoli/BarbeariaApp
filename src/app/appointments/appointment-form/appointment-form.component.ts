import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Appointment } from '../models/appointment.model';
import { AppointmentService } from '../services/appointment.service';
import { BarberService } from '../../core/services/barber.service';
import { ClientService } from '../../core/services/client.service';
import { ServiceService } from '../../core/services/service.service';
import { Barber } from '../../core/models/barber.model';
import { Client } from '../../core/models/client.model';
import { Service } from '../../core/models/service.model';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class AppointmentFormComponent implements OnInit {
  @Input() appointment?: Appointment;
  @Input() isEditMode = false;
  
  appointmentForm: FormGroup;
  appointmentId: string | null = null;
  barbers: Barber[] = [];
  clients: Client[] = [];
  services: Service[] = [];
  availableTimes: string[] = [];
  selectedDate: string = '';
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private appointmentService: AppointmentService,
    private barberService: BarberService,
    private clientService: ClientService,
    private serviceService: ServiceService
  ) {
    this.minDate = new Date().toISOString();
    this.appointmentForm = this.fb.group({
      clientId: ['', Validators.required],
      barberId: ['', Validators.required],
      serviceId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.loadBarbers();
    this.loadClients();
    this.loadServices();
    this.generateAvailableTimes();

    if (this.isEditMode && this.appointment) {
      this.appointmentId = this.appointment.id!;
      this.appointmentForm.patchValue({
        clientId: this.appointment.clientId,
        barberId: this.appointment.barberId,
        serviceId: this.appointment.serviceId,
        date: this.appointment.date,
        time: this.appointment.time,
        notes: this.appointment.notes
      });
    }
  }

  loadBarbers() {
    this.barberService.getBarbers().subscribe(
      (barbers) => {
        this.barbers = barbers;
      },
      (error) => {
        console.error('Erro ao carregar barbeiros:', error);
      }
    );
  }

  loadClients() {
    this.clientService.getClients().subscribe(
      (clients) => {
        this.clients = clients;
      },
      (error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    );
  }

  loadServices() {
    this.serviceService.getServices().subscribe(
      (services) => {
        this.services = services;
      },
      (error) => {
        console.error('Erro ao carregar serviços:', error);
      }
    );
  }

  generateAvailableTimes() {
    const startHour = 9; // 9:00 AM
    const endHour = 18; // 6:00 PM
    const interval = 30; // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        this.availableTimes.push(time);
      }
    }
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    // Aqui você pode adicionar lógica para verificar horários disponíveis
    // baseado na data selecionada
  }

  async onSubmit() {
    if (this.appointmentForm.valid) {
      const appointment: Appointment = {
        ...this.appointmentForm.value,
        status: 'scheduled'
      };

      try {
        if (this.isEditMode && this.appointmentId) {
          await this.appointmentService.updateAppointment(this.appointmentId, {
            ...appointment,
            id: this.appointmentId
          }).toPromise();
        } else {
          await this.appointmentService.createAppointment(appointment).toPromise();
        }
        this.modalCtrl.dismiss(true);
      } catch (error) {
        console.error('Erro ao salvar agendamento:', error);
      }
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
} 