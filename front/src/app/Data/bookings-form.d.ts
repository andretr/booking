export interface BookingsForm {
  claseId: number;
  aulaId: number;
  reservas: Reserva[];
}

export interface Reserva {
  date: string;
  price: number;
}
