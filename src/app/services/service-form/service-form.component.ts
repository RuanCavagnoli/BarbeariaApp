import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Service } from '../../core/models/service.model';
import { BarberServiceService } from '../../core/services/barber-service.service';
import { firstValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class ServiceFormComponent implements OnInit {
  @Input() service?: Service;
  form: FormGroup;
  categories = [
    { value: 'corte', label: 'Corte de Cabelo' },
    { value: 'barba', label: 'Barba' },
    { value: 'sobrancelha', label: 'Sobrancelha' },
    { value: 'pigmentacao', label: 'Pigmentação' },
    { value: 'tratamento', label: 'Tratamento' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private barberService: BarberServiceService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      duration: ['', [Validators.required, Validators.min(1)]],
      category: ['', [Validators.required]],
      image: [''],
      available: [true]
    });
  }

  ngOnInit() {
    if (this.service) {
      this.form.patchValue(this.service);
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      const serviceData = this.form.value;
      
      try {
        if (this.service?.id) {
          await firstValueFrom(this.barberService.updateService(this.service.id, serviceData));
        } else {
          await firstValueFrom(this.barberService.createService(serviceData));
        }
        this.modalCtrl.dismiss(true);
      } catch (error) {
        console.error('Erro ao salvar serviço:', error);
      }
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
} 