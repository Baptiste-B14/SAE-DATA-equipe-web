/**
 * Notre représentation du fichier JSON
 *
 * Angular ne peut pas savoir exactement le type de données du fichier
 * On pourra se servir de ce type pour faire un cast
 */
export type DataFromJson = TravelData[];

/**
 * Notre représentation d'un voyage
 */
export type TravelData = {
  company: string;
  destination: string;
  price: number;
  date: string;
  rate: number;
  motive: string;
  satisfied: boolean;
  gender: 'M' | 'F' | 'N/A';
  shipType: string;
  travelClass: 'eco' | 'premios' | 'business';
  isMember: boolean;
};

export type SingleData = {
  value: number;
  name: string;
}[];

export type MultipleData = {
  name: string;
  series: SingleData;
}[];
