import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BarberServiceService } from '../core/services/barber-service.service';
import { Service } from '../core/models/service.model';
import { firstValueFrom } from 'rxjs';
import { ServiceService } from '../core/services/service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HomePage implements OnInit {
  services: Service[] = [];
  categories = [
    { value: 'corte', label: 'Corte de Cabelo', icon: 'cut' },
    { value: 'barba', label: 'Barba', icon: 'cut' },
    { value: 'sobrancelha', label: 'Sobrancelha', icon: 'eye' },
    { value: 'pigmentacao', label: 'Pigmentação', icon: 'color-palette' },
    { value: 'tratamento', label: 'Tratamento', icon: 'flask' }
  ];

  constructor(
    private barberService: BarberServiceService,
    private router: Router,
    private serviceService: ServiceService
  ) { }

  ngOnInit() {
    this.loadServices();
  }

  async loadServices() {
    try {
      const services = await firstValueFrom(this.serviceService.getServices());
      this.services = services || [];
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      this.services = [];
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  }

  navigateToServices() {
    this.router.navigate(['/services']);
  }

  navigateToAppointments() {
    this.router.navigate(['/appointments']);
  }

  getServicesByCategory(category: string): Service[] {
    return this.services.filter(service => service.category === category)
      .slice(0, 3); // Mostra apenas os 3 primeiros serviços de cada categoria
  }
}
