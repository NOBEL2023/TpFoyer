export interface Chambre {
  idChambre?: number;
  numeroChambre: number;
  typeC: TypeChambre;
  reservations?: any[];
  bloc?: any;
}

export enum TypeChambre {
  SIMPLE = 'SIMPLE',
  DOUBLE = 'DOUBLE',
  TRIPLE = 'TRIPLE'
}