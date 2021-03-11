import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public medicoSeleccionado!: Medico;
  public hospitalSeleccionado!: Hospital;

  constructor( 
      private fb: FormBuilder, 
      private hospitalService: HospitalService,
      private medicoService: MedicoService,
      private router: Router,
      private activateRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.activateRoute.params.subscribe( ({ id }) => {
      this.cargarMedico( id );
    })

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required ],
      hospital: ['', Validators.required ]
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges.subscribe( ( hospitalId ) => {
      this.hospitalSeleccionado = <Hospital>this.hospitales.find((h) => h._id === hospitalId );
    });
  }

  cargarMedico( id: string ) {

    if ( id === 'nuevo' ) {
      return;
    }
    this.medicoService.obtenerMedicoPorId( id )
      .pipe(
        delay(100)
      )
      .subscribe( medico => {
        const { nombre, hospital: { _id } } = medico;

        if ( !medico ) {
          this.router.navigateByUrl(`/dashboard/medicos`)
        }
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({ nombre, hospital: _id });
      })
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe( ( hospitales: Hospital[] ) => {
        this.hospitales = hospitales || [];
      })
  }

  gurardarMedico() {
    const { nombre} = this.medicoForm.value;

    if ( this.medicoSeleccionado ) {

      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      
      this.medicoService.actualizarMedicos( data )
        .subscribe( (resp: any) => {
          console.log(resp);
          Swal.fire('Actualizado', `${ nombre } actualizado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`);
        })
    } else {

      this.medicoService.crearMedicos( this.medicoForm.value )
        .subscribe( (resp: any) => {
          console.log(resp);
          Swal.fire('Creado', `${ nombre } creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`);
        })

    }
    
  }

}