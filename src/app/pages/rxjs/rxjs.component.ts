import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators'

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {
  intervalSubs: Subscription = new Subscription();

  constructor() { 

    this.retornaIntervalo()
    .subscribe(console.log)
    /* this.retornaObservable().pipe(
      retry(2)
    ).subscribe(
      valor => console.log('Subs: ', valor),
      error => console.warn('Error: ', error),
      () => console.info('Obs terminado')
    ); */
  }

  retornaIntervalo(): Observable<number> {
    return interval(500)
      .pipe( 
        map( valor => valor + 1 ),
        filter( valor => ( valor % 2 === 0) ? true : false ),
        take(2), 
      );
  }

  retornaObservable(): Observable<number> {
    let i = -1;

    return new Observable<number>( observer => {

      const intervalo = setInterval(()=> {
        i++;
        observer.next(i);

        if ( i === 4 ) {
          clearInterval( intervalo );
          observer.complete();
        }
        if ( i === 2 ) {
          observer.error('Error lanzado')
        }
      }, 1000)
    });
  }

  ngOnDestroy() {
    this.intervalSubs.unsubscribe();
  }

}
