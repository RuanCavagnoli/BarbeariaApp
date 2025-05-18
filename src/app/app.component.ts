import { Component } from '@angular/core';
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
  ];

  constructor() { }
}
