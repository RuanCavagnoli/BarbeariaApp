export interface Client {
  id?: string;
  name: string;
  phone: string;
  email: string;
  gender: 'M' | 'F' | 'O'; // M: Masculino, F: Feminino, O: Outro
  cpf: string;
  birthDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
} 