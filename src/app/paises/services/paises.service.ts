import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaisesInterface } from '../interfaces/paises-interface';

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

  getPaisesPorContinente( continente: string ): Observable<PaisesInterface[]> {

    const url : string = `${this._baseUrl}/region/${continente}?fields=name,alpha3Code`;
    return this.http.get<PaisesInterface[]>(url);
  }
}
