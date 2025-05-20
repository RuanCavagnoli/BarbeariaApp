import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Client } from '../../core/models/client.model';
import { ClientService } from '../../core/services/client.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class ClientFormComponent implements OnInit {
  @Input() client?: Client;
  clientForm: FormGroup;
  isEditMode = false;
  clientId: string | null = null;
  maxDate = new Date().toISOString().split('T')[0];
  minDate = '1900-01-01';

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private clientService: ClientService
  ) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.initForm();
  }

  loadClientData() {
    this.clientService.getClient(this.clientId!).subscribe(
      (client) => {
        this.clientForm.patchValue({
          name: client.name,
          phone: client.phone,
          email: client.email
        });
      },
      (error) => {
        console.error('Erro ao carregar dados do cliente:', error);
      }
    );
  }

  initForm() {
    this.clientForm = this.fb.group({
      name: [this.client?.name || '', [Validators.required, Validators.minLength(3)]],
      phone: [this.client?.phone || '', [
        Validators.required,
        Validators.pattern(/^\d{11}$/),
        Validators.minLength(11),
        Validators.maxLength(11)
      ]],
      cpf: [this.client?.cpf || '', [
        Validators.required,
        Validators.pattern(/^\d{11}$/),
        Validators.minLength(11),
        Validators.maxLength(11)
      ]],
      gender: [this.client?.gender || '', [Validators.required]],
      birthDate: [this.client?.birthDate ? new Date(this.client.birthDate).toISOString().split('T')[0] : '', [
        Validators.required,
        this.dateValidator.bind(this)
      ]],
      email: [this.client?.email || '', [Validators.required, Validators.email]]
    });
  }

  dateValidator(control: any) {
    const date = new Date(control.value);
    const today = new Date();
    const minDate = new Date(1900, 0, 1);

    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }

    if (date > today) {
      return { futureDate: true };
    }

    if (date < minDate) {
      return { pastDate: true };
    }

    return null;
  }

  getErrorMessage(controlName: string): string {
    const control = this.clientForm.get(controlName);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) {
      return 'Este campo é obrigatório';
    }

    if (control.errors['pattern'] || control.errors['minlength'] || control.errors['maxlength']) {
      if (controlName === 'phone') {
        return 'O telefone deve ter 11 dígitos';
      }
      if (controlName === 'cpf') {
        return 'O CPF deve ter 11 dígitos';
      }
    }

    if (control.errors['futureDate']) {
      return 'A data não pode ser futura';
    }

    if (control.errors['pastDate']) {
      return 'A data não pode ser anterior a 1900';
    }

    return '';
  }

  async onSubmit() {
    if (this.clientForm.valid) {
      const clientData: Client = {
        ...this.clientForm.value,
        id: this.client?.id // importante para edição!
      };

      try {
        if (this.client?.id) {
          await this.clientService.updateClient(this.client.id, clientData).toPromise();
        } else {
          await this.clientService.createClient(clientData).toPromise();
        }
        this.modalCtrl.dismiss(true);
      } catch (error) {
        console.error('Erro ao salvar cliente:', error);
      }
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
}
