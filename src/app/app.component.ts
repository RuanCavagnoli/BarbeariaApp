import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home'},
    { title: 'Serviços', url: '/services', icon: 'cut' },
    { title: 'Barbeiros', url: '/barbers', icon: 'people' },
    { title: 'Produtos', url: '/products', icon: 'cart' },
    { title: 'Clientes', url: '/clients', icon: 'person' },
  ];

  constructor(private menuCtrl: MenuController) {}

  closeMenu() {
    this.menuCtrl.close();
  }
}
