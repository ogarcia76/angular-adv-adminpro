import { Component, OnInit } from '@angular/core';
import { Event } from '@angular/router';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir!: File;
  public imgTemp: any = null;

  constructor( public modalImagenService: ModalImagenService, private fileUploadService: FileUploadService ) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto(
      this.imagenSubir,
      'usuarios',
      id
    ).then( img => {

      Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
      this.modalImagenService.nuevaImagen.emit(img);
      this.cerrarModal();
    }).catch( err => {
      console.log(err);
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    });
  }
}
