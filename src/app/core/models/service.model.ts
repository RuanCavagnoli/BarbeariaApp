export interface Service {
    id?: string;
    name: string;
    description: string;
    price: number;
    duration: number; // duração em minutos
    image?: string;
    category: 'corte' | 'barba' | 'sobrancelha' | 'pigmentacao' | 'tratamento';
    available: boolean;
} 