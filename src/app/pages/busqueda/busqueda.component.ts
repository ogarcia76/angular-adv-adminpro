import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public hospitales: Hospital[] = [];
  public medicos: Medico[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private busquedasService: BusquedasService ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({ termino }) => {
      this.busquedaGlobal( termino );
      /* this.router.navigateByUrl(`/dashboard/buscar/${ termino }`); */
    });
  }

  busquedaGlobal( termino: string ) {
    this.busquedasService.busquedaGlobal( termino ).subscribe( (resp: any) => {

      this.usuarios = resp.usuarios;
      this.hospitales = resp.hospitales;
      this.medicos = resp.medicos;

    })
  }

}
