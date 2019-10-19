import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-metadata-item',
  templateUrl: './metadata-item.component.html',
  styleUrls: ['./metadata-item.component.css']
})
export class MetadataItemComponent implements OnInit {

  @Input() item: any;

  public clave: any;
  public valor: any;

  constructor() { }

  ngOnInit() {
    let clave = this.item[0];
    let valor = this.item[1];

    if (clave === '') { clave = 'clave'; }
    if (valor === '') { valor = 'valor'; }

    this.clave = clave;
    this.valor = valor;
  }

}
