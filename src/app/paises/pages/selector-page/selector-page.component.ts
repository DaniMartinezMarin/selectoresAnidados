import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';

import { switchMap, tap } from 'rxjs/operators'
import { PaisInterface, PaisSmall } from '../../interfaces/pais-interface';
import { of } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    continente: [ '', Validators.required ],
    pais      : [ '', Validators.required ],
    frontera  : [ '', Validators.required ]
  });

  //  Selectores
  continentes: string[] = [];
  paises: PaisSmall[] = [];
  paisesFronterizos: PaisInterface[] = [];

  // UI
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {

    this.continentes = this.paisesService.continentes;

    //Cuando cambia el continente
    this.miFormulario.get('continente')?.valueChanges
    .pipe(
      tap( () => {
        this.miFormulario.get('pais')?.reset('');
        this.cargando = true;
      })
      ,switchMap( continente => this.paisesService.getPaisesPorContinente( continente ) )
    )
    .subscribe( (paises: PaisSmall[]) => {
      this.paises = paises;
      this.cargando = false;
    });

    //Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => {
          this.paisesFronterizos = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        })
        ,switchMap( (codigoPais) => this.paisesService.getPaisPorCodigo( codigoPais ) )
      )
      .subscribe(
        ( pais: PaisInterface | null ) => {
          this.setFronteras(pais?.borders || []);
          this.cargando = false;
        }
      )
  }

  setFronteras( codigosPaises: string[] ) {

    codigosPaises.forEach( codigo => {
      this.paisesService.getPaisPorCodigo(codigo).subscribe(
        (pais: PaisInterface | null) => {
          if(pais != null)
            this.paisesFronterizos.push(pais);
        }
      )
    })
  }

  guardar(): void {
    console.log(this.miFormulario.value);
  }

}
