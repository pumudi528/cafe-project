export class CreateMenuDto {
  name: string;
  description: string;
  price: number;
  stock?: number; // optional, default 0
}
