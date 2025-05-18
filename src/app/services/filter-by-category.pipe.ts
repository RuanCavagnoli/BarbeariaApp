import { Pipe, PipeTransform } from '@angular/core';
import { Service } from '../core/models/service.model';

@Pipe({
  name: 'filterByCategory',
  standalone: true
})
export class FilterByCategoryPipe implements PipeTransform {
  transform(services: Service[], category: string): Service[] {
    if (!services || !category) {
      return services;
    }
    return services.filter(service => service.category === category);
  }
} 