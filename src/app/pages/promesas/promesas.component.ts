import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsers().then(usuarios => console.log(usuarios));

    /* const promesa = new Promise((resolveA, rejectError) => {
       if ( false ) {
         resolveA('Hola mundo');
       } else {
         rejectError( 'Algo salio mal');
       }
    });

    promesa.then((mensaje) => {
      console.log(mensaje);
    }).catch(error => console.log('Error en mi promesa: ', error)); */
  }

  getUsers () {
    return new Promise(resolve => {
      fetch('https://reqres.in/api/users')
        .then( resp => resp.json() )
        .then(body => console.log( body.data ));
    });
  }

}
