import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, IonicModule } from '@ionic/angular';
import { BarberServiceService } from '../core/services/barber-service.service';
import { Service } from '../core/models/service.model';
import { ServiceFormComponent } from './service-form/service-form.component';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FilterByCategoryPipe } from './filter-by-category.pipe';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FilterByCategoryPipe]
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  categories = [
    { value: 'corte', label: 'Corte de Cabelo' },
    { value: 'barba', label: 'Barba' },
    { value: 'sobrancelha', label: 'Sobrancelha' },
    { value: 'pigmentacao', label: 'Pigmentação' },
    { value: 'tratamento', label: 'Tratamento' }
  ];

  constructor(
    private barberService: BarberServiceService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loadServices();
  }

  async loadServices() {
    try {
      const services = await firstValueFrom(this.barberService.getServices());
      this.services = services || [];
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      this.services = [];
    }
  }

  getCategoryLabel(category: string): string {
    return this.categories.find(c => c.value === category)?.label || category;
  }

  async addService() {
    const modal = await this.modalCtrl.create({
      component: ServiceFormComponent
    });

    modal.onDidDismiss().then((result) => {
      if (result && result.data) {
        this.loadServices();
      }
    });

    return await modal.present();
  }

  async editService(service: Service) {
    const modal = await this.modalCtrl.create({
      component: ServiceFormComponent,
      componentProps: {
        service: service
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result && result.data) {
        this.loadServices();
      }
    });

    return await modal.present();
  }

  async deleteService(service: Service) {
    if (!service.id) {
      console.error('Tentativa de excluir serviço sem ID');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: `Deseja realmente excluir o serviço ${service.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: async () => {
            try {
              await firstValueFrom(this.barberService.deleteService(service.id!));
              await this.loadServices();
            } catch (error) {
              console.error('Erro ao excluir serviço:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  }
} 