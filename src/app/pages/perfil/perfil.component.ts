import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario: Usuario;
  public imagenSubir!: File;
  public imgTemp: any = null;

  constructor( 
      private fb: FormBuilder, 
      private usuarioService: UsuarioService,
      private fileUploadService: FileUploadService ) { 
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required ],
      email: [this.usuario.email, [Validators.required, Validators.email] ]
    });
  }

  actualizarPerfil() {
    console.log( this.perfilForm.value );
    this.usuarioService.actualizarPerfil( this.perfilForm.value ).subscribe( resp => {
      const { nombre, email } = this.perfilForm.value;
      this.usuario.nombre = nombre;
      this.usuario.email = email;
      
      Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
    }, (error) => {
      console.log(error.error.msg);
      Swal.fire('Error', error.error.msg, 'error');
    });
  }

  cambiarImagen( event: any ) {
    
    const file = event &&  event.target && event.target.files[0];
    this.imagenSubir = file;

    if ( !file ) {
      this.imgTemp = null; 
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.fileUploadService.actualizarFoto(
      this.imagenSubir,
      'usuarios',
      this.usuario.uid || ''
    ).then( img => {
      this.usuario.img = img;

      Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
    }).catch( err => {
      console.log(err);
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    });
  }

}
