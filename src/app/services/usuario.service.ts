import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';
import { UsuariosComponent } from '../pages/mantenimientos/usuarios/usuarios.component';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario!: Usuario;

  constructor( 
    private http: HttpClient, 
    private router: Router,
    private ngZone: NgZone ) { this.googleInit() }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  googleInit() {

    return new Promise<void>( resolve => {
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '637149564063-n4lcm0qphautiostkco8h7s26167g4h4.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    })
  };

  logout() {
    localStorage.removeItem('token');
    
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });

  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${ base_url }/login/renew`, this.headers ).pipe(
      map( (resp: any) => {
        console.log( resp );
        const {
          email,
          google,
          nombre,
          role,
          img = '',
          uid
        } = resp.usuario;
        this.usuario = new Usuario(
          nombre,
          email,
          '',
          img,
          google,
          role,
          uid
        )
        localStorage.setItem('token', resp.token );
        return true;
      }),
      catchError( error => of(false) )
    );
  }

  crearUsuario( formData: RegisterForm ) {

     return this.http.post(`${ base_url }/usuarios`, formData )
      .pipe(
        tap( (resp: any) => {
          console.log( resp );
          localStorage.setItem('token', resp.token );
        })
      );
  }

  actualizarPerfil( data: { email: string, nombre: string, role: string }) {

    data = {
      ...data,
      role: this.usuario.role || ''
    }

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, this.headers )
  }

  login( formData: LoginForm ) {

    return this.http.post(`${ base_url }/login`, formData )
      .pipe(
        tap( (resp: any) => {
          console.log( resp );
          localStorage.setItem('token', resp.token );
        })
      );
  }

  loginGoogle( token: string ) {

  return this.http.post(`${ base_url }/login/google`, { token } )
    .pipe(
      tap( (resp: any) => {
        console.log( resp );
        localStorage.setItem('token', resp.token );
      })
    );
  }

  cargarUsuarios( desde: number = 0 ) {

    const url = `${ base_url }/usuarios?desde=${ desde }`;

    return this.http.get<CargarUsuario>( url, this.headers )
      .pipe(
        map( resp => {
          const usuarios = resp.usuarios.map(
            user => new Usuario( user.nombre, user.email, '', user.img, user.google, user.role, user.uid,)
          );

          return {
            total: resp.total,
            usuarios
          }
        })
      );

  }

  eliminarUsuario( usuario: Usuario ) {

    const url = `${ base_url }/usuarios/${ usuario.uid }`;

    return this.http.delete( url, this.headers );
  }

  guardarUsuario( usuario: Usuario ) {

    return this.http.put(`${ base_url }/usuarios/${ this.usuario.uid }`, usuario, this.headers )
  }
}
