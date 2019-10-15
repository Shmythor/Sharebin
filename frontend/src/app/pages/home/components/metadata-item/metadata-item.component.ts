import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-metadata-item',
  templateUrl: './metadata-item.component.html',
  styleUrls: ['./metadata-item.component.css']
})
export class MetadataItemComponent implements OnInit {

  @Input() clave: any;
  @Input() valor: any;

  constructor() { }

  ngOnInit() {
  }

}
