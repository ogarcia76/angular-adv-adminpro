import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription = new Subscription; 

  constructor( 
    private hospitalService: HospitalService, 
    private modalImagenService: ModalImagenService, 
    private busquedasService: BusquedasService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargandoHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe( delay( 100 ) )
    .subscribe( () => this.cargandoHospitales() );
  }

  cargandoHospitales() {

    this.cargando = true;

    this.hospitalService.cargarHospitales()
      .subscribe( resp => {
        this.cargando = false;
        console.log( resp );

        this.hospitales = resp;
      });

  }

  guradarCambios( hospital: Hospital ) {
    this.hospitalService.actualizarHospitales( hospital._id || '', hospital.nombre )
      .subscribe( resp => {
        Swal.fire( 'Actualizado', hospital.nombre, 'success');
      });
  }

  eliminarHospital( hospital: Hospital ) {
    this.hospitalService.borrarHospitales( hospital._id || '' )
      .subscribe( resp => {
        this.cargandoHospitales();
        Swal.fire( 'Borrado', hospital.nombre, 'success');
      });
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      input: 'text',
      title: 'Crear Hospital',
      inputLabel: 'Ingrese el nombre del hospital',
      showCancelButton: true,
      inputPlaceholder: 'Nombre del hospital'
    })
    
    if ( value && value.trim().length > 0 ) {
      this.hospitalService.crearHospitales( value )
        .subscribe( resp => {
          this.hospitales.push(resp.hospital);
        });
    }
  }

  abrirModal(hospital: Hospital ) {
    this.modalImagenService.abrirModal('hospitales', hospital._id || '' ,hospital.img )
  }

  buscar( terminos: string ) {

    if ( terminos.length === 0 ) {
     this.cargandoHospitales();
    }

    this.busquedasService.buscar( 'hospitales', terminos )
      .subscribe( resp => {
        this.hospitales = resp || [];
      });
  }

}
