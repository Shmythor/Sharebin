import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport, {static: false}) viewport: CdkVirtualScrollViewport;

  public data = [
    { id: 1, name: 'Mr Nice' },
    { id: 2, name: 'Marco' },
    { id: 3, name: 'Bombastico' },
    { id: 4, name: 'Celeritas 2' },
    { id: 5, name: 'Magneto' },
    { id: 6, name: 'RubberWoman' },
    { id: 7, name: 'Dynamo' },
    { id: 8, name: 'Dr -IQ' },
    { id: 9, name: 'Magmatron' },
    { id: 10, name: 'Huracan' },
    { id: 11, name: 'Dr Nice' },
    { id: 12, name: 'Narco' },
    { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' },
    { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' },
    { id: 17, name: 'Dynama' },
    { id: 18, name: 'Dr IQ' },
    { id: 19, name: 'Magma' },
    { id: 20, name: 'Tornado' }
  ];

  constructor() { }
  ngOnInit() {
  }
}
