import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, AlertController, ToastController } from '@ionic/angular';
import { ClientService } from '../core/services/client.service';
import { Client } from '../core/models/client.model';
import { ClientFormComponent } from './client-form/client-form.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ClientFormComponent]
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  isLoading = false;
  error: string | null = null;

  constructor(
    private clientService: ClientService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.isLoading = true;
    this.error = null;

    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.filterClients();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.error = 'Erro ao carregar clientes. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  filterClients() {
    if (!this.searchTerm) {
      this.filteredClients = this.clients;
      return;
    }

    const search = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(client => 
      client.name.toLowerCase().includes(search) ||
      client.phone.includes(search) ||
      client.cpf.includes(search)
    );
  }

  async openClientForm(client?: Client) {
    const modal = await this.modalCtrl.create({
      component: ClientFormComponent,
      componentProps: {
        client,
        isEditMode: !!client
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.loadClients();
      this.showToast(
        client ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!',
        'success'
      );
    }
  }

  async deleteClient(client: Client) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: `Deseja realmente excluir o cliente ${client.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: () => {
            this.clientService.deleteClient(client.id!).subscribe({
              next: () => {
                this.loadClients();
                this.showToast('Cliente excluído com sucesso!', 'success');
              },
              error: (error) => {
                console.error('Erro ao excluir cliente:', error);
                this.showToast('Erro ao excluir cliente', 'danger');
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