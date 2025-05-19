import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  standalone: false
})
export class ProductFormComponent implements OnInit {
  @Input() product?: Product;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private productService: ProductService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      image: ['']
    });
  }

  ngOnInit() {
    if (this.product) {
      this.form.patchValue(this.product);
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      const productData = this.form.value;
      
      try {
        if (this.product?.id) {
          await firstValueFrom(this.productService.updateProduct(this.product.id, productData));
        } else {
          await firstValueFrom(this.productService.createProduct(productData));
        }
        this.modalCtrl.dismiss(true);
      } catch (error) {
        console.error('Erro ao salvar produto:', error);
      }
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
} 