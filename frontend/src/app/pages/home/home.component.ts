import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { dataToTest } from './data.js';
import { ClientApi } from '../../services/lb-api/services/index';

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
  metadata: any;
  tempMetadata: any;
  searchValue: string;
  metadataKeys: any;
  hoverIndex:number = -1;



  constructor(private clientapi: ClientApi) {
    this.data = dataToTest;
    this.dataFiltered = this.data;
    this.itemSelected = {id: '', name: '', description: '', metadata: {}};
    this.metadata = {};
    this.tempMetadata = {};

    this.textAreaText = this.itemSelected.description;
  }

  ngOnInit() {

    this.clientapi.uploadDocument({file:"C:\Users\Shaheer\Desktop\UPV\ETSINF4\Cuatrimestre 1\PIN\Sharebin Project\Sharebin\frontend\src\assets\prueba.txt"},
    {description:"Fichero de prueba"}, localStorage.getItem("currentUser")).subscribe((accessToken) => {
      console.log("Fichero subido");
    }, (err) => {
      console.log("Error al subir el fichero");
    });
    /*let userId = localStorage.getItem('currentUser');
    this.clientapi.getDocuments(userId).subscribe((accessToken) => {
      console.log(accessToken);
    }, (err) => {
      console.log('Error documentos');
    });*/
  }

  getFilter(filter: string) {
    switch (filter) {
      case 'name': this.filters[0] = !this.filters[0]; break;
      case 'description': this.filters[1] = !this.filters[1]; break;
      case 'metadata': this.filters[2] = !this.filters[2]; break;
    }

    this.getSearch(this.searchValue);
  }

  getSearch(search: string) {
    this.searchValue = search;
    this.dataFiltered = this.data.filter((elem: any) => {
      let res = false;
      /* Filtrando por nombre */
      if (this.filters[0]) { res = res || elem.name.toLowerCase().startsWith(search.toLowerCase()); }
      /* Filtrando por Descripción */
      if (this.filters[1]) { res = res || elem.description.toLowerCase().includes(search.toLowerCase()); }
      /* Filtrando por metadata */
      if (this.filters[2]) {
      Object.keys(elem.metadata).forEach(element => {
       // res = res || element.toLowerCase().includes(search.toLowerCase()); // Buscamos la clave
          res = res || elem.metadata[element].toLowerCase().includes(search.toLowerCase()); // Buscamos el valor
      });
      }
      return res;
    });
  }

  itemPressed(data: any) {
    this.itemSelected = data;
    this.metadata = this.convertObjToArray( this.itemSelected.metadata);
    this.tempMetadata = this.metadata;

    this.textarea.nativeElement.value = this.itemSelected.description; // Necesario (porque es un textarea ?)
  }


  saveChanges() {
    const lastItemSelected = this.itemSelected;

    if (this.itemSelected.id !== '') {
      const index = this.data.findIndex((x) => x.id === lastItemSelected.id);

      this.data[index].name = this.nameInput.nativeElement.value;
      this.data[index].description = this.textarea.nativeElement.value;
      this.data[index].metadata = this.convertArrayToObj(this.tempMetadata);
    }
  }

  newMetadata() {
    this.tempMetadata.push(['', '']);
  }

  updateMetadataKey(event: any, id: any) {
    this.tempMetadata[id][0] = event.target.value;
  }
  updateMetadataValue(event: any, id: any) {
    this.tempMetadata[id][1] = event.target.value;
  }

  convertObjToArray(obj: any) {
    return Object.keys(obj).map((key) => {
      return [key, obj[key]];
    });
  }

  convertArrayToObj(array: any) {
    const newObject = {};

    array.forEach(elem => {
      newObject[elem[0]] = elem[1];
    });
    return newObject;
  }

  upload() {

  }

  downloadFile(url: string){
    console.log('Descargar ' + url);
    window.open('../../../assets/favicon-32x32.png');
  }

  showDownloadButton(buttonId: any) {
    document.getElementById('downloadButton' + buttonId).style.display = 'block';
  }

  hideDownloadButton(buttonId: any) {
    document.getElementById('downloadButton' + buttonId).style.display = 'none';
  }
}
