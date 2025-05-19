export interface Service {
    id?: string;
    name: string;
    description: string;
    price: number;
    duration: number; // duração em minutos
    category?: string;
    available?: boolean;
    image?: string;
} 