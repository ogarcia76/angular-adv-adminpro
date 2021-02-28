import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalusuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public imgSubs: Subscription = new Subscription;

  constructor( 
    private usuarioService: UsuarioService, 
    private busquedasService: BusquedasService, 
    private modalImagenService: ModalImagenService ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe( delay( 100 ) )
    .subscribe( () => this.cargarUsuarios() );
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios() {
    this.usuarioService.cargarUsuarios( this.desde )
      .subscribe( ({ total, usuarios }) => {
        this.totalusuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
    })
  }

  cambiarPagina( valor: number ) {

    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde > this.totalusuarios ) {
      this.desde -= valor;
    }

    this.cargarUsuarios();

  }

  buscar( terminos: string ) {

    if ( terminos.length === 0 ) {
      this.usuarios = this.usuariosTemp;
    }

    this.busquedasService.buscar( 'usuarios', terminos )
      .subscribe( resp => {
        this.usuarios = resp || [];
      });
  }

  eliminarUsuario( usuario: Usuario ) {

    if ( usuario.uid === this.usuarioService.uid ) {
      Swal.fire('Error', 'No puede borrarse así mismo', 'error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
       this.usuarioService.eliminarUsuario( usuario )
        .subscribe( resp => {
          this.cargarUsuarios();
          Swal.fire(
            'Usuario borrado',
            `${ usuario.nombre }, fue borrado correctamente`,
            'success'
          )
        });
      }
    })
  }

  cambiarRole( usuario: Usuario ) {
    this.usuarioService.guardarUsuario( usuario )
      .subscribe( resp => {
        console.log( resp );
      });
  }

  abrirModal( usuario: Usuario ) {
    const id = usuario.uid || '';

    this.modalImagenService.abrirModal('usuarios', id, usuario.img);
  }

}
