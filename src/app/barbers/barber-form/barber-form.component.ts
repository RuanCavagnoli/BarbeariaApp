import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Barber } from '../../core/models/barber.model';
import { BarberService } from '../../core/services/barber.service';

@Component({
  selector: 'app-barber-form',
  templateUrl: './barber-form.component.html',
  styleUrls: ['./barber-form.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class BarberFormComponent implements OnInit {
  @Input() barber?: Barber;
  barberForm!: FormGroup;
  specialties = [
    'Corte Masculino',
    'Barba',
    'Design de Sobrancelha',
    'Pigmentação Capilar',
    'Hidratação Capilar'
  ];

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private barberService: BarberService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.barberForm = this.fb.group({
      name: [this.barber?.name || '', [Validators.required]],
      phone: [this.barber?.phone || '', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11)
      ]],
      specialties: [this.barber?.specialties || [], [Validators.required, Validators.minLength(1)]],
      experience: [this.barber?.experience || 0, [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]],
      active: [this.barber?.active ?? true]
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.barberForm.get(controlName);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) {
      return 'Este campo é obrigatório';
    }

    if (control.errors['minlength'] || control.errors['maxlength']) {
      if (controlName === 'phone') {
        return 'O telefone deve ter 11 dígitos';
      }
    }

    if (control.errors['min']) {
      if (controlName === 'experience') {
        return 'A experiência não pode ser negativa';
      }
    }

    if (control.errors['max']) {
      if (controlName === 'experience') {
        return 'A experiência não pode ser maior que 100 anos';
      }
    }

    if (control.errors['minlength']) {
      if (controlName === 'specialties') {
        return 'Selecione pelo menos uma especialidade';
    }
  }

    return '';
  }

  onSubmit() {
    if (this.barberForm.valid) {
      const barberData: Barber = {
        ...this.barberForm.value,
        id: this.barber?.id
      };

      const request = this.barber?.id
        ? this.barberService.updateBarber(this.barber.id, barberData)
        : this.barberService.createBarber(barberData);

      request.subscribe({
        next: () => {
        this.modalCtrl.dismiss(true);
        },
        error: (error) => {
        console.error('Erro ao salvar barbeiro:', error);
      }
      });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
} 