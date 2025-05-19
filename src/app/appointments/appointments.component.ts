import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Appointment } from './models/appointment.model';
import { AppointmentService } from './services/appointment.service';
import { BarberService } from '../core/services/barber.service';
import { ClientService } from '../core/services/client.service';
import { ServiceService } from '../core/services/service.service';
import { Barber } from '../core/models/barber.model';
import { Client } from '../core/models/client.model';
import { Service } from '../core/models/service.model';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    AppointmentFormComponent
  ]
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  barbers: Barber[] = [];
  clients: Client[] = [];
  services: Service[] = [];
  loading = true;

  constructor(
    private appointmentService: AppointmentService,
    private barberService: BarberService,
    private clientService: ClientService,
    private serviceService: ServiceService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadAppointments();
    this.loadBarbers();
    this.loadClients();
    this.loadServices();
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentService.getAppointments().subscribe(
      (appointments) => {
        this.appointments = appointments;
        this.loading = false;
      },
      (error) => {
        console.error('Erro ao carregar agendamentos:', error);
        this.loading = false;
        this.showToast('Erro ao carregar agendamentos', 'danger');
      }
    );
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

  getClientName(clientId: string): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente não encontrado';
  }

  getBarberName(barberId: string): string {
    const barber = this.barbers.find(b => b.id === barberId);
    return barber ? barber.name : 'Barbeiro não encontrado';
  }

  getServiceName(serviceId: string): string {
    const service = this.services.find(s => s.id === serviceId);
    return service ? service.name : 'Serviço não encontrado';
  }

  getServicePrice(serviceId: string): number {
    const service = this.services.find(s => s.id === serviceId);
    return service ? service.price : 0;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'medium';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  }

  async openAppointmentForm(appointment?: Appointment) {
    const modal = await this.modalCtrl.create({
      component: AppointmentFormComponent,
      componentProps: {
        appointment,
        isEditMode: !!appointment
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.loadAppointments();
      this.showToast(
        appointment ? 'Agendamento atualizado com sucesso!' : 'Agendamento criado com sucesso!',
        'success'
      );
    }
  }

  async deleteAppointment(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir este agendamento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: () => {
            this.appointmentService.deleteAppointment(id).subscribe(
              () => {
                this.loadAppointments();
                this.showToast('Agendamento excluído com sucesso');
              },
              (error) => {
                console.error('Erro ao excluir agendamento:', error);
                this.showToast('Erro ao excluir agendamento', 'danger');
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }

  private async showToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
} 