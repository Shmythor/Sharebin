import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { dataToTest } from './data.js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('textarea', {static: false}) textarea: ElementRef;
  @ViewChild('nameInput', {static: false}) nameInput: ElementRef;

  /*
    filters[0]: name
    filters[1]: description
    filters[2]: metadata
  */
  filters = [true, false, false];


  public data = [];
  public dataFiltered = [];
  public itemSelected: any;
  public textAreaText: string;


  constructor() {
    this.data = dataToTest;
    this.dataFiltered = this.data;
    this.itemSelected = {id: '', name: '', description: '', metadata: {}};

    this.textAreaText = this.itemSelected.description;
  }

  ngOnInit() {

  }

  getFilter(filter: string) {
    switch (filter) {
      case 'name': this.filters[0] = !this.filters[0]; break;
      case 'description': this.filters[1] = !this.filters[1]; break;
      case 'metadata': this.filters[2] = !this.filters[2]; break;
    }
  }

  getSearch(search: string) {
    this.dataFiltered = this.data.filter((elem: any) => {
      let res = false;
      /* Filtrando por nombre */
      if (this.filters[0]) { res = res || elem.name.toLowerCase().startsWith(search.toLowerCase()); }
      /* Filtrando por Descripción */
      if (this.filters[1]) { res = res || elem.description.toLowerCase().includes(search.toLowerCase()); }
      /* Filtrando por metadata */
        // if (this.filters[2]) { res = res || elem.metadata.getValue(search.toLowerCase()); }
      return res;
    });
  }

  itemPressed(data: any) {
    this.itemSelected = data;
    this.textarea.nativeElement.value = this.itemSelected.description; // Necesario (porque es un textarea ?)
  }

  saveChanges() {
    const lastItemSelected = this.itemSelected;

    if (this.itemSelected.id !== '') {
      const index = this.data.findIndex((x) => x.id === lastItemSelected.id);

      this.data[index].name = this.nameInput.nativeElement.value;
      this.data[index].description = this.textarea.nativeElement.value;
      // metadata
    }
  }
  
  upload() {
    
  }
}
