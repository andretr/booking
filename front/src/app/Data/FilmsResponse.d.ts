import {Href} from './CinemasResponse';

export interface AulasResponse {
  _embedded: Embedded;
  _links: Links;
  page: Page;
}

export interface Embedded {
  aulas?: (Aula)[] | null;
}

export interface Aula {
  id: number;
  nombre: string;
  nroAsientos: number;
  nroFilas: number;
  nroColumnas: number;
  photo: string;
  _links: FilmLinks;
}

export interface FilmLinks {
  self: Href;
  film: Href;
  projections: Projections;
  categorie: Href;
}

export interface Projections {
  href: string;
  templated: boolean;
}

export interface Links {
  self: Href;
  profile: Href;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
