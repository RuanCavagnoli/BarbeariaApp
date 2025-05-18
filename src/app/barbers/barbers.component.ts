import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BarberService } from '../core/services/barber.service';
import { Barber } from '../core/models/barber.model';
import { firstValueFrom } from 'rxjs';
import { BarberFormComponent } from './barber-form/barber-form.component';

@Component({
  selector: 'app-barbers',
  templateUrl: './barbers.component.html',
  styleUrls: ['./barbers.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class BarbersComponent implements OnInit {
  barbers: Barber[] = [];

  constructor(
    private barberService: BarberService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loadBarbers();
  }

  async loadBarbers() {
    try {
      const barbers = await firstValueFrom(this.barberService.getBarbers());
      this.barbers = barbers || [];
    } catch (error) {
      console.error('Erro ao carregar barbeiros:', error);
      this.barbers = [];
    }
  }

  async addBarber() {
    const modal = await this.modalCtrl.create({
      component: BarberFormComponent
    });

    modal.onDidDismiss().then((result) => {
      if (result && result.data) {
        this.loadBarbers();
      }
    });

    return await modal.present();
  }

  async editBarber(barber: Barber) {
    const modal = await this.modalCtrl.create({
      component: BarberFormComponent,
      componentProps: {
        barber: barber
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result && result.data) {
        this.loadBarbers();
      }
    });

    return await modal.present();
  }

  async deleteBarber(barber: Barber) {
    if (!barber.id) {
      console.error('Tentativa de excluir barbeiro sem ID');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: `Deseja realmente excluir o barbeiro ${barber.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: async () => {
            try {
              await firstValueFrom(this.barberService.deleteBarber(barber.id!));
              await this.loadBarbers();
            } catch (error) {
              console.error('Erro ao excluir barbeiro:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }
} 