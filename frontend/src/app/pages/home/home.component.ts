import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { dataToTest } from './data.js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport, {static: false}) viewport: CdkVirtualScrollViewport;
  searchString: string;
  /*
    filters[0]: name
    filters[1]: description
    filters[2]: metadata
  */
  filters = [1, -1, -1];


  public data = [];
  public dataFiltered = [];
  public itemDescription = '';

  constructor() {
    this.data = dataToTest;
    this.dataFiltered = this.data;
  }

  ngOnInit() { }

  getFilter(filter: string) {
    switch (filter) {
      case 'name': this.filters[0] *= -1; break;
      case 'description': this.filters[1] *= -1; break;
      case 'metadata': this.filters[2] *= -1; break;
    }
  }

  getSearch(search: string) {
    this.dataFiltered = this.data.filter((elem: any) => {
      let res = false;
      /* Filtrando por nombre */
      if (this.filters[0] === 1) { res = res || elem.name.toLowerCase().startsWith(search.toLowerCase()); }
      /* Filtrando por Descripción */
      if (this.filters[1] === 1) { res = res || elem.description.toLowerCase().includes(search.toLowerCase()); console.log(search); }
      /* Filtrando por metadata */
        // if (this.filters[2] === 1) { res = res || elem.metadata.getValue(search.toLowerCase()); }
      return res;
    });
  }

  itemPressed(data: any) {
    this.itemDescription = data.description;
  }
}
