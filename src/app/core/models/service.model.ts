export interface Service {
    id?: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    category: string;
    image?: string;
    available: boolean;
} 