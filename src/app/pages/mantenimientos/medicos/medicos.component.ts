import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public imgSubs: Subscription = new Subscription; 

  constructor( 
    private medicoService: MedicoService, 
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe( delay( 100 ) )
    .subscribe( () => this.cargarMedicos() );
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarHMedicos()
      .subscribe( medicos => {
        this.cargando = false;
        this.medicos = medicos;
        console.log(medicos);
      })

  }

  abrirModal( medico: Medico ) {
    this.modalImagenService.abrirModal('medicos', medico._id || '' ,medico.img );
  }

  buscar( terminos: string ) {

    if ( terminos.length === 0 ) {
     this.cargarMedicos();
    }

    this.busquedasService.buscar( 'medicos', terminos )
      .subscribe( resp => {
        this.medicos = resp || [];
      });
  }

  borrarMedico( medico: Medico ) {
    Swal.fire({
      title: '¿Borrar médico?',
      text: `Esta a punto de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
       this.medicoService.borrarMedicos( medico._id = '' )
        .subscribe( resp => {
          this.cargarMedicos();
          Swal.fire(
            'Médico borrado',
            `${ medico.nombre }, fue borrado correctamente`,
            'success'
          )
        });
      }
    })
  }

}
