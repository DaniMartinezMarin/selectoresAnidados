import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesInterface } from '../../interfaces/paises-interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    continente: [ '', Validators.required ],
    pais: [ '', Validators.required ],
  });

  continentes: string[] = [];
  paises: PaisesInterface[] = [];

  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {

    this.continentes = this.paisesService.continentes;

    this.miFormulario.get('continente')?.valueChanges.subscribe(
      (continente: string) => {
        if(continente === '') {
          this.paises = [];
          return;
        }
        this.paisesService.getPaisesPorContinente(continente).subscribe(
          (paises: PaisesInterface[]) => this.paises = paises
        )
      }
    )
  }

  guardar(): void {
    console.log(this.miFormulario.value);
  }

}
