import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Barber } from '../../core/models/barber.model';
import { BarberService } from '../../core/services/barber.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-barber-form',
  templateUrl: './barber-form.component.html',
  styleUrls: ['./barber-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class BarberFormComponent implements OnInit {
  @Input() barber?: Barber;
  form: FormGroup;
  
  specialtyOptions = [
    'Corte Masculino',
    'Barba',
    'Corte Feminino',
    'Coloração',
    'Tratamentos Capilares',
    'Design de Sobrancelhas'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private barberService: BarberService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      specialties: [[], [Validators.required, Validators.minLength(1)]],
      experience: [0, [Validators.required, Validators.min(0)]],
      active: [true]
    });
  }

  ngOnInit() {
    if (this.barber) {
      this.form.patchValue(this.barber);
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      const barberData = this.form.value;
      
      try {
        if (this.barber?.id) {
          await firstValueFrom(this.barberService.updateBarber(this.barber.id, barberData));
        } else {
          await firstValueFrom(this.barberService.createBarber(barberData));
        }
        this.modalCtrl.dismiss(true);
      } catch (error) {
        console.error('Erro ao salvar barbeiro:', error);
      }
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
} 