import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ProductService } from '../core/services/product.service';
import { Product } from '../core/models/product.model';
import { ProductFormComponent } from './product-form/product-form.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: false
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const products = await firstValueFrom(this.productService.getProducts());
      this.products = products || [];
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      this.products = [];
    }
  }

  async addProduct() {
    const modal = await this.modalCtrl.create({
      component: ProductFormComponent
    });

    modal.onDidDismiss().then((result) => {
      if (result && result.data) {
        this.loadProducts();
      }
    });

    return await modal.present();
  }

  async editProduct(product: Product) {
    const modal = await this.modalCtrl.create({
      component: ProductFormComponent,
      componentProps: {
        product: product
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result && result.data) {
        this.loadProducts();
      }
    });

    return await modal.present();
  }

  async deleteProduct(product: Product) {
    if (!product.id) {
      console.error('Tentativa de excluir produto sem ID');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: `Deseja realmente excluir o produto ${product.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: async () => {
            try {
              await firstValueFrom(this.productService.deleteProduct(product.id!));
              await this.loadProducts();
            } catch (error) {
              console.error('Erro ao excluir produto:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }
} 