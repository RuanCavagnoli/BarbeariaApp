import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, AlertController, ToastController } from '@ionic/angular';
import { BarberService } from '../core/services/barber.service';
import { Barber } from '../core/models/barber.model';
import { BarberFormComponent } from './barber-form/barber-form.component';

@Component({
  selector: 'app-barbers',
  templateUrl: './barbers.component.html',
  styleUrls: ['./barbers.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class BarbersComponent implements OnInit {
  barbers: Barber[] = [];
  isLoading = false;

  constructor(
    private barberService: BarberService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadBarbers();
  }

  loadBarbers() {
    this.isLoading = true;
    this.barberService.getBarbers().subscribe({
      next: (barbers) => {
      this.barbers = barbers || [];
        this.isLoading = false;
      },
      error: (error) => {
      console.error('Erro ao carregar barbeiros:', error);
      this.barbers = [];
        this.isLoading = false;
      }
    });
  }

  async openBarberForm(barber?: Barber) {
    const modal = await this.modalCtrl.create({
      component: BarberFormComponent,
      componentProps: {
        barber: barber
      }
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        this.loadBarbers();
        this.showToast(
          barber ? 'Barbeiro atualizado com sucesso!' : 'Barbeiro cadastrado com sucesso!',
          'success'
        );
      }
    });

    await modal.present();
  }

  async deleteBarber(barber: Barber) {
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
          handler: () => {
            this.barberService.deleteBarber(barber.id!).subscribe({
              next: () => {
                this.loadBarbers();
                this.showToast('Barbeiro excluído com sucesso!', 'success');
              },
              error: (error) => {
              console.error('Erro ao excluir barbeiro:', error);
                this.showToast('Erro ao excluir barbeiro', 'danger');
            }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
} 