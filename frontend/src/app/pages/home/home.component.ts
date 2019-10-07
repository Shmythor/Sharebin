import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';



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

  constructor() {
    this.data = [
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
      /* Filtrando por metadata */
        // if (this.filters[1] === 1) { res = res || elem.metadata.getValue(search.toLowerCase()); }
      /* Filtrando por Descripción */
        // if (this.filters[2] === 1) { res = res || elem.description.toLowerCase().contains(search.toLowerCase()); }
      return res;
    });
  }
}
