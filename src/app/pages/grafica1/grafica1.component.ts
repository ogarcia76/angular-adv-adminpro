import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

  public labels1: string[] = ['Pan', 'Refrescos', 'Tacos'];
  public data1 = [
    [10, 15, 40]
  ];
  public labels2: string[] = ['Pelotas', 'Palas', 'Zapatillas'];
  public data2 = [
    [40, 37, 10]
  ];
  public labels3: string[] = ['Ladrillos', 'Cemento', 'Hormigon'];
  public data3 = [
    [45, 25, 20]
  ];
  public labels4: string[] = ['Coches', 'Barcos', 'Tren'];
  public data4 = [
    [10, 15, 40]
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
