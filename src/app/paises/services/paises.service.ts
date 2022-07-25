import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisInterface, PaisSmall } from '../interfaces/pais-interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl = 'https://restcountries.com/v2';
  private _continentes: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get continentes(): string[] {
    return [...this._continentes];
  }

  constructor( private http: HttpClient ) { }

  getPaisesPorContinente( continente: string ): Observable<PaisSmall[]> {
    const url: string = `${this._baseUrl}/region/${continente}?fields=name,alpha3Code`;
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorCodigo( codigoPais: string ): Observable<PaisInterface | null> {

    if(!codigoPais) return of(null);

    const url: string = `${this._baseUrl}/alpha/${codigoPais}`;
    return this.http.get<PaisInterface>(url);
  }

  getPaisPorCodigoSmall( codigoPais: string ): Observable<PaisSmall> {

    const url: string = `${this._baseUrl}/alpha/${codigoPais}?fields=name,alpha3Code`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigos( borders: string[]): Observable<PaisSmall[]> {

    if(!borders)
      return of([]);

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( border => peticiones.push( this.getPaisPorCodigoSmall(border) ) );

    return combineLatest(peticiones);

  }
}
